import React, { useEffect, useRef } from "react";
import styled from "styled-components";
import usePrefersReducedMotion from "../../hooks/usePrefersReducedMotion";
import useIsPointerFine from "../../hooks/useIsPointerFine";

/*
 * Hero background: a drifting constellation.
 *
 * Every previous version got the *edges* wrong. One drew the literal agent
 * graph as labelled boxes, which read as broken UI over the headline. One drew
 * fixed node pairs, so the edges were permanent long diagonals that merely slid
 * around. The last one dropped edges entirely and fanned every nearby slice at
 * the cursor, which is why it read as a starburst pinned to one point.
 *
 * Here there are no owned edges at all. A link is drawn purely because two
 * nodes happen to be within LINK_DIST of each other *this frame*, at an opacity
 * that falls off with distance. Since every node wanders along its own slow
 * path, links fade up and fade out continuously with nothing scripting them —
 * that is the "connect and disconnect" the field is supposed to have.
 *
 * The cursor is a gravity well, not a fan. Nodes inside CURSOR_WELL accelerate
 * toward it and fall in; a short-range repulsion inside CORE stops them
 * collapsing onto a single pixel, so they settle into a loose cluster instead.
 * Meanwhile the spring holding each node to its own drifting home is *released*
 * in proportion to the well's grip (HOME_RELEASE) — otherwise the spring wins
 * at range and nothing ever actually falls in. Move away and the springs take
 * over again and the field re-spreads over a couple of seconds.
 *
 * Canvas rather than SVG: this draws ~130 nodes plus a few hundred links every
 * frame, and mutating that many DOM attributes per frame does not hold 60fps.
 * The whole simulation lives in refs — no React state is touched while it runs.
 */

/* Density is expressed as area-per-node so a laptop and an ultrawide get the
   same visual spacing rather than the same node count. */
const AREA_PER_NODE = 15500;
const MIN_NODES = 28;
const MAX_NODES = 130;

const LINK_DIST = 150;
const LINK_DIST_SQ = LINK_DIST * LINK_DIST;
const LINK_ALPHA = 0.3;

const CURSOR_LINK_DIST = 215;
const CURSOR_WELL = 360; // radius of the gravity well, CSS px
const PULL = 250; // px/s^2 at the centre, falling linearly to 0 at the rim
const CORE = 40; // inside this the well pushes back out
const PUSH = 420;

const HOME_K = 1.35; // spring constant back to the node's drifting home
const HOME_RELEASE = 0.5; // how much of that spring the well may cancel
const DAMP = 2.0; // velocity damping, 1/s
const MAX_SPEED = 340;
const GLOW_LAMBDA = 6;

/*
 * Why PULL is this low. A strong well plus a released home spring makes every
 * captured node settle at the same force-balance radius, and ~20 dots at an
 * identical radius is a hard mechanical ring, not a gather. Keeping the well
 * weak enough that each node's own home tension still matters at equilibrium
 * means each one stops at a different distance: nodes crowd in toward the
 * cursor and lean at it, but the crowd stays soft.
 *
 * Simulated at 1600x900 (93 nodes): within 150px of a parked cursor the count
 * goes 5 idle -> 16 over four seconds, spread across every distance band
 * rather than piled into one, with peak node speed ~50px/s. Five seconds after
 * the cursor leaves, distance-from-home is statistically identical to a field
 * that was never touched at all, so nothing accumulates a permanent wake.
 */

/* Click sends a ring outward through the field. */
const RIPPLE_SPEED = 560; // px/s
const RIPPLE_LIFE = 1.2; // seconds
const RIPPLE_KICK = 300; // px/s^2 inside the band
const RIPPLE_BAND = 74; // how wide the pushing edge is

const INK_DOT = "rgb(58, 47, 31)";
const BRONZE_DOT = "rgb(107, 81, 44)";
const LINK_COLOR = "rgb(36, 29, 19)";
const CURSOR_COLOR = "rgb(107, 81, 44)";

// Deterministic PRNG so the layout is stable across re-renders instead of
// reshuffling every time React happens to re-run the effect.
function mulberry32(seed) {
  let a = seed;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Jittered grid, so the field is evenly spread without the clumps plain
    random scattering produces — clumps make every link fire at once. */
function buildNodes(w, h, count) {
  const cols = Math.max(1, Math.round(Math.sqrt((count * w) / h)));
  const rows = Math.max(1, Math.ceil(count / cols));
  const cellW = w / cols;
  const cellH = h / rows;
  const rand = mulberry32(9173);

  const nodes = [];
  for (let r = 0; r < rows && nodes.length < count; r += 1) {
    for (let c = 0; c < cols && nodes.length < count; c += 1) {
      const bx = c * cellW + cellW * 0.5 + (rand() - 0.5) * cellW * 0.85;
      const by = r * cellH + cellH * 0.5 + (rand() - 0.5) * cellH * 0.85;
      nodes.push({
        bx,
        by,
        x: bx,
        y: by,
        vx: 0,
        vy: 0,
        r: 1.05 + rand() * 1.35,
        // Independent sine wander. Amplitude is about a third of the node
        // spacing, which is what makes neighbours cross the link threshold in
        // both directions instead of holding a fixed separation forever.
        ampX: 30 + rand() * 40,
        ampY: 26 + rand() * 36,
        fx: 0.25 + rand() * 0.3, // rad/s -> 12-25s per cycle
        fy: 0.22 + rand() * 0.3,
        phx: rand() * Math.PI * 2,
        phy: rand() * Math.PI * 2,
        glow: 0,
      });
    }
  }
  return nodes;
}

const Wrap = styled.div`
  position: absolute;
  inset: 0;
  z-index: 0;
  pointer-events: none;
  /* Only the outer edge feathers, so the field fills the band instead of
     bunching into a blob in the middle. */
  mask-image: radial-gradient(ellipse 96% 92% at 50% 46%, #000 52%, transparent 100%);
  -webkit-mask-image: radial-gradient(ellipse 96% 92% at 50% 46%, #000 52%, transparent 100%);
`;

const Canvas = styled.canvas`
  width: 100%;
  height: 100%;
  display: block;
`;

const AgentFlow = () => {
  const prefersReduced = usePrefersReducedMotion();
  const isPointerFine = useIsPointerFine();

  const wrapRef = useRef(null);
  const canvasRef = useRef(null);
  const pointerRef = useRef({ x: 0, y: 0, active: false });
  const ripplesRef = useRef([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const wrap = wrapRef.current;
    if (!canvas || !wrap) return undefined;

    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return undefined;

    let nodes = [];
    let w = 0;
    let h = 0;
    let raf = 0;
    let last = performance.now();
    let running = false;
    let visible = true;

    const resize = () => {
      const rect = wrap.getBoundingClientRect();
      const nextW = Math.max(1, Math.round(rect.width));
      const nextH = Math.max(1, Math.round(rect.height));
      if (nextW === w && nextH === h) return;
      w = nextW;
      h = nextH;

      // Cap the backing store at 2x: beyond that the extra pixels cost real
      // time on this many strokes and buy nothing visible on hairlines.
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      const count = Math.round(
        Math.min(MAX_NODES, Math.max(MIN_NODES, (w * h) / AREA_PER_NODE))
      );
      nodes = buildNodes(w, h, count);
    };

    const step = (dt, t) => {
      const p = pointerRef.current;
      const ripples = ripplesRef.current;
      const reacting = p.active;

      for (let i = ripples.length - 1; i >= 0; i -= 1) {
        const rp = ripples[i];
        rp.age += dt;
        rp.radius = rp.age * RIPPLE_SPEED;
        if (rp.age > RIPPLE_LIFE) ripples.splice(i, 1);
      }

      for (let i = 0; i < nodes.length; i += 1) {
        const n = nodes[i];

        // The home is itself moving — this is the ambient drift. The node is
        // sprung to it rather than free-flying, which keeps the field evenly
        // spread no matter how often the cursor drags it around.
        const hx = n.bx + Math.sin(t * n.fx + n.phx) * n.ampX;
        const hy = n.by + Math.cos(t * n.fy + n.phy) * n.ampY;

        let ax = 0;
        let ay = 0;
        let grip = 0;

        if (reacting) {
          const dx = p.x - n.x;
          const dy = p.y - n.y;
          const d = Math.hypot(dx, dy);
          if (d < CURSOR_WELL) {
            grip = 1 - d / CURSOR_WELL;
            const inv = 1 / (d || 1);
            if (d < CORE) {
              // Soft core. Without it every node in range converges on one
              // pixel and the cluster reads as a single blob.
              const g = PUSH * (1 - d / CORE);
              ax -= dx * inv * g;
              ay -= dy * inv * g;
            } else {
              const g = PULL * grip;
              ax += dx * inv * g;
              ay += dy * inv * g;
            }
          }
        }

        for (let k = 0; k < ripples.length; k += 1) {
          const rp = ripples[k];
          const dx = n.x - rp.x;
          const dy = n.y - rp.y;
          const d = Math.hypot(dx, dy) || 1;
          const off = Math.abs(d - rp.radius);
          if (off > RIPPLE_BAND) continue;
          const g =
            RIPPLE_KICK * (1 - off / RIPPLE_BAND) * (1 - rp.age / RIPPLE_LIFE);
          ax += (dx / d) * g;
          ay += (dy / d) * g;
        }

        // Releasing the home spring under the well is the whole trick: at full
        // strength it out-pulls the cursor at range and nothing ever falls in.
        const k = HOME_K * (1 - HOME_RELEASE * grip);
        ax += (hx - n.x) * k - n.vx * DAMP;
        ay += (hy - n.y) * k - n.vy * DAMP;

        n.vx += ax * dt;
        n.vy += ay * dt;

        const sp = Math.hypot(n.vx, n.vy);
        if (sp > MAX_SPEED) {
          n.vx = (n.vx / sp) * MAX_SPEED;
          n.vy = (n.vy / sp) * MAX_SPEED;
        }

        n.x += n.vx * dt;
        n.y += n.vy * dt;
        n.glow += (grip - n.glow) * (1 - Math.exp(-GLOW_LAMBDA * dt));
      }
    };

    const draw = () => {
      const p = pointerRef.current;
      const ripples = ripplesRef.current;
      ctx.clearRect(0, 0, w, h);

      /* --- links: derived from this frame's distances, never from a stored
             pair list, which is what lets them appear and vanish on their own */
      ctx.lineWidth = 0.7;
      ctx.strokeStyle = LINK_COLOR;
      for (let i = 0; i < nodes.length; i += 1) {
        const a = nodes[i];
        for (let j = i + 1; j < nodes.length; j += 1) {
          const b = nodes[j];
          const dx = a.x - b.x;
          const dy = a.y - b.y;
          const d2 = dx * dx + dy * dy;
          if (d2 >= LINK_DIST_SQ) continue;
          const f = 1 - Math.sqrt(d2) / LINK_DIST;
          const alpha = f * f * LINK_ALPHA * (1 + (a.glow + b.glow) * 0.75);
          ctx.globalAlpha = alpha > 1 ? 1 : alpha;
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.stroke();
        }
      }

      /* --- links to the cursor itself, warmer so the gathering reads as
             deliberate rather than as the field having drifted */
      if (p.active) {
        ctx.strokeStyle = CURSOR_COLOR;
        ctx.lineWidth = 0.8;
        for (let i = 0; i < nodes.length; i += 1) {
          const n = nodes[i];
          const d = Math.hypot(p.x - n.x, p.y - n.y);
          if (d >= CURSOR_LINK_DIST) continue;
          const f = 1 - d / CURSOR_LINK_DIST;
          ctx.globalAlpha = f * f * 0.5;
          ctx.beginPath();
          ctx.moveTo(n.x, n.y);
          ctx.lineTo(p.x, p.y);
          ctx.stroke();
        }

        ctx.globalAlpha = 0.34;
        ctx.beginPath();
        ctx.arc(p.x, p.y, 5.5, 0, Math.PI * 2);
        ctx.stroke();
      }

      /* --- click ripples */
      ctx.strokeStyle = CURSOR_COLOR;
      ctx.lineWidth = 1;
      for (let i = 0; i < ripples.length; i += 1) {
        const rp = ripples[i];
        const age = rp.age / RIPPLE_LIFE;
        ctx.globalAlpha = (1 - age) * (1 - age) * 0.42;
        ctx.beginPath();
        ctx.arc(rp.x, rp.y, rp.radius, 0, Math.PI * 2);
        ctx.stroke();
      }

      /* --- nodes last, so they sit on top of their own links */
      for (let i = 0; i < nodes.length; i += 1) {
        const n = nodes[i];
        const alpha = 0.34 + n.glow * 0.52;
        ctx.globalAlpha = alpha > 1 ? 1 : alpha;
        ctx.fillStyle = n.glow > 0.18 ? BRONZE_DOT : INK_DOT;
        ctx.beginPath();
        ctx.arc(n.x, n.y, n.r * (1 + n.glow * 0.55), 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.globalAlpha = 1;
    };

    const tick = (now) => {
      // Clamped so a background tab or a long task does not integrate one
      // enormous step and fling every node off screen.
      const dt = Math.min((now - last) / 1000, 0.05);
      last = now;
      step(dt, now / 1000);
      draw();
      raf = requestAnimationFrame(tick);
    };

    const start = () => {
      if (running) return;
      running = true;
      last = performance.now();
      raf = requestAnimationFrame(tick);
    };
    const stop = () => {
      running = false;
      cancelAnimationFrame(raf);
    };

    resize();

    if (prefersReduced) {
      // One static frame: the texture is still there, nothing moves. It still
      // needs the resize observer — the backing store is sized in device
      // pixels, so without a redraw a resized window stretches the last frame.
      draw();
      const staticRo = new ResizeObserver(() => {
        resize();
        draw();
      });
      staticRo.observe(wrap);
      return () => staticRo.disconnect();
    }

    const ro = new ResizeObserver(() => {
      resize();
      if (!running && visible) start();
    });
    ro.observe(wrap);

    // Off-screen the hero is pure cost — stop the loop entirely rather than
    // rendering frames nobody sees.
    const io = new IntersectionObserver(
      ([entry]) => {
        visible = entry.isIntersecting;
        if (visible) start();
        else stop();
      },
      { threshold: 0 }
    );
    io.observe(wrap);

    const onVisibility = () => {
      if (document.hidden) stop();
      else if (visible) start();
    };
    document.addEventListener("visibilitychange", onVisibility);

    start();

    return () => {
      stop();
      ro.disconnect();
      io.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [prefersReduced]);

  // Pointer is tracked in canvas-local CSS pixels. Listening on window rather
  // than on the canvas is deliberate — the wrapper is pointer-events:none so
  // the headline and CTAs underneath stay clickable.
  useEffect(() => {
    if (!isPointerFine || prefersReduced) return undefined;

    const onMove = (e) => {
      const wrap = wrapRef.current;
      if (!wrap) return;
      const rect = wrap.getBoundingClientRect();
      const p = pointerRef.current;
      p.x = e.clientX - rect.left;
      p.y = e.clientY - rect.top;
      // Active only while the pointer is within reach of the hero band, so the
      // field lets go the moment you scroll past it.
      p.active =
        p.x > -CURSOR_WELL &&
        p.y > -CURSOR_WELL &&
        p.x < rect.width + CURSOR_WELL &&
        p.y < rect.height + CURSOR_WELL;
    };

    const onDown = (e) => {
      const wrap = wrapRef.current;
      if (!wrap) return;
      const rect = wrap.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      if (x < 0 || y < 0 || x > rect.width || y > rect.height) return;
      const ripples = ripplesRef.current;
      if (ripples.length > 3) ripples.shift();
      ripples.push({ x, y, age: 0, radius: 0 });
    };

    const onLeave = () => {
      pointerRef.current.active = false;
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerdown", onDown, { passive: true });
    document.addEventListener("pointerleave", onLeave);
    window.addEventListener("blur", onLeave);
    return () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerdown", onDown);
      document.removeEventListener("pointerleave", onLeave);
      window.removeEventListener("blur", onLeave);
    };
  }, [isPointerFine, prefersReduced]);

  return (
    <Wrap ref={wrapRef} aria-hidden="true">
      <Canvas ref={canvasRef} />
    </Wrap>
  );
};

export default AgentFlow;
