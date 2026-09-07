import React, { forwardRef } from "react";
import styled, { css, keyframes } from "styled-components";
import useInView from "../../hooks/useInView";

/*
 * Section bands.
 *
 * Every band paints its own background so consecutive sections read as
 * separate pieces of stock rather than one endless scroll. Three cues do the
 * work together:
 *
 *   $tone     alternates the paper between plain parchment and a slightly
 *             darker press. It is a translucent ink wash, not a solid colour,
 *             so the fixed halftone grain on <body> still reads through
 *             instead of being covered up — 4% ink over #F2EBDD lands almost
 *             exactly on the --parchment-deep token.
 *
 *   $pattern  gives each band its own print texture: dot screen, engraving
 *             hatch, ruled paper, graph paper, plotted ticks, crosshatch,
 *             concentric rings. All are CSS gradients bar one inline SVG tile,
 *             so there is nothing to download.
 *
 *   motion    each texture then moves in the way that texture would: hatch
 *             slides across its own stripes, ruled paper crawls, the dot
 *             screen breathes as it drifts, the rings pulse outward like
 *             sonar. The graph paper and the plotted ticks also get a slow
 *             light pass over the top.
 *
 * Two rules keep the motion cheap enough to run on a scrolling page:
 *
 *   1. Every drift is a `transform` on an oversized layer, translated by
 *      exactly one whole tile so it loops with no visible seam. Transforms
 *      composite; animating `background-position` would repaint a
 *      full-viewport gradient every frame instead.
 *
 *   2. A band only animates while it is on screen (IntersectionObserver, with
 *      a 200px margin so it is already running before you see it). Otherwise
 *      seven bands would be painting at once to show you one.
 *
 * The pattern is masked to fade out at the top and bottom edges so a hairline
 * never collides with the seam, while the tone stays hard-edged — that crisp
 * seam is what actually separates one band from the next. Only the darker
 * bands carry a top hairline, which gives every seam exactly one rule instead
 * of doubling them up.
 */

const INK = "36, 29, 19";
const BRONZE = "107, 81, 44";

/* ------------------------------------------------------------------ *
 * Textures
 * ------------------------------------------------------------------ */

const patterns = {
  /* Letterpress dot screen — coarser than the body grain, so it reads as a
     deliberate second layer rather than a moiré against it. */
  dots: css`
    background-image: radial-gradient(rgba(${INK}, 0.11) 1.1px, transparent 1.1px);
    background-size: 22px 22px;
  `,

  /* Single-direction engraving hatch */
  hatch: css`
    background-image: repeating-linear-gradient(
      45deg,
      rgba(${INK}, 0.06) 0 1px,
      transparent 1px 12px
    );
  `,

  /* Ruled paper — horizontal rules, which suits a dated timeline */
  rules: css`
    background-image: repeating-linear-gradient(
      to bottom,
      rgba(${INK}, 0.07) 0 1px,
      transparent 1px 30px
    );
  `,

  /* Graph paper */
  grid: css`
    background-image: repeating-linear-gradient(
        to right,
        rgba(${INK}, 0.055) 0 1px,
        transparent 1px 34px
      ),
      repeating-linear-gradient(to bottom, rgba(${INK}, 0.055) 0 1px, transparent 1px 34px);
  `,

  /* Plotted tick marks. A cross needs ink in both axes of one tile, which
     gradients cannot express on their own — hence the inline SVG tile. It is
     still just CSS: no request, no decode of any consequence. */
  ticks: css`
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='34' height='34'%3E%3Cpath d='M17 12.5v9M12.5 17h9' stroke='%23241D13' stroke-opacity='.22' stroke-width='1'/%3E%3C/svg%3E");
    background-size: 34px 34px;
  `,

  /* Crosshatch weave */
  weave: css`
    background-image: repeating-linear-gradient(
        45deg,
        rgba(${INK}, 0.05) 0 1px,
        transparent 1px 14px
      ),
      repeating-linear-gradient(-45deg, rgba(${INK}, 0.05) 0 1px, transparent 1px 14px);
  `,

  /* Concentric rings radiating from the top edge. Lighter than the rest
     because two of these layers overlap to make the sonar pulse continuous. */
  rings: css`
    background-image: repeating-radial-gradient(
      circle at 50% 0%,
      rgba(${INK}, 0.05) 0 1px,
      transparent 1px 48px
    );
    transform-origin: 50% 0%;
  `,
};

/* ------------------------------------------------------------------ *
 * Motion
 *
 * Every translate below shifts its texture by a whole number of periods,
 * measured along the axis that texture actually repeats on — that is what
 * makes each loop seamless rather than jumping at the restart.
 *
 * For the two 45° gradients the repeat axis is diagonal, so the offset is not
 * the tile size. What matters is the translation's projection onto that axis:
 * a diagonal shift (a, -a) projects to a·√2, while a pure-X shift (a, 0)
 * projects to a/√2 onto both diagonals at once. Hence 16.97px = two 12px
 * periods for the hatch, and 19.8px = one 14px period on each of the weave's
 * two directions — one forward, one back, which is what makes them
 * counter-slide.
 * ------------------------------------------------------------------ */

const driftDots = keyframes`
  from { transform: translate3d(0, 0, 0); }
  to   { transform: translate3d(22px, 22px, 0); }
`;

/* Dot screens read as static ink unless the density itself shifts. */
const breathe = keyframes`
  from { opacity: 0.72; }
  to   { opacity: 1; }
`;

/* Perpendicular to the stripes, so the hatch appears to slide across itself
   rather than travel along its own lines (which would look like nothing). */
const driftHatch = keyframes`
  from { transform: translate3d(0, 0, 0); }
  to   { transform: translate3d(16.97px, -16.97px, 0); }
`;

const driftRules = keyframes`
  from { transform: translate3d(0, 0, 0); }
  to   { transform: translate3d(0, 30px, 0); }
`;

const driftGrid = keyframes`
  from { transform: translate3d(0, 0, 0); }
  to   { transform: translate3d(34px, 34px, 0); }
`;

const driftTicks = keyframes`
  from { transform: translate3d(0, 0, 0); }
  to   { transform: translate3d(34px, -34px, 0); }
`;

/* A pure X shift moves both diagonals of the weave by exactly one period —
   one forward, one back — so the two hatches counter-slide against each
   other and the crossings travel. */
const driftWeave = keyframes`
  from { transform: translate3d(0, 0, 0); }
  to   { transform: translate3d(19.8px, 0, 0); }
`;

/* Scale never drops below 1, so the layer always covers the band it is
   painting no matter where in the cycle it is caught. */
const sonar = keyframes`
  0%   { transform: scale(1) translateZ(0); opacity: 0; }
  14%  { opacity: 1; }
  100% { transform: scale(2.2) translateZ(0); opacity: 0; }
`;

/*
 * Durations are set from the speed, not picked by eye: each is its own
 * translate distance divided by ~2.3px per second. Below about 1.5px/s a
 * repeating texture reads as static no matter how long you watch it; above
 * about 4px/s it starts pulling the eye off body copy set on top of it. So
 * they all run at the same rate even though the tiles are different sizes,
 * which is also what stops the seven bands from looking like seven unrelated
 * effects when you scroll through them.
 */
const motions = {
  dots: css`
    animation: ${driftDots} 13s linear infinite, ${breathe} 7s ease-in-out infinite alternate;
  `,
  hatch: css`
    animation: ${driftHatch} 10s linear infinite;
  `,
  rules: css`
    animation: ${driftRules} 13s linear infinite;
  `,
  grid: css`
    animation: ${driftGrid} 21s linear infinite;
  `,
  ticks: css`
    animation: ${driftTicks} 21s linear infinite;
  `,
  weave: css`
    animation: ${driftWeave} 9s linear infinite;
  `,
  rings: css`
    animation: ${sonar} 11s cubic-bezier(0.25, 0.6, 0.35, 1) infinite;
  `,
};

const sweepX = keyframes`
  0%   { transform: translate3d(-120%, 0, 0); opacity: 0; }
  12%  { opacity: 1; }
  84%  { opacity: 1; }
  100% { transform: translate3d(320%, 0, 0); opacity: 0; }
`;

const sweepY = keyframes`
  0%   { transform: translate3d(0, -140%, 0); opacity: 0; }
  10%  { opacity: 1; }
  86%  { opacity: 1; }
  100% { transform: translate3d(0, 460%, 0); opacity: 0; }
`;

/* ------------------------------------------------------------------ *
 * Layers
 * ------------------------------------------------------------------ */

const bandMask = css`
  mask-image: linear-gradient(to bottom, transparent, #000 9%, #000 91%, transparent);
  -webkit-mask-image: linear-gradient(to bottom, transparent, #000 9%, #000 91%, transparent);
`;

/** Holds the mask and the clip. The moving layers live inside it so their
    transforms cannot drag the edge fade around with them. */
const PatternMask = styled.div`
  position: absolute;
  inset: 0;
  z-index: 0;
  overflow: hidden;
  pointer-events: none;
  ${bandMask}
`;

const PatternLayer = styled.div`
  position: absolute;
  /* Oversized by more than the longest translate, so the drift never exposes
     an untextured edge. */
  inset: -60px;
  ${({ $pattern }) => patterns[$pattern] || ""}
  ${({ $pattern }) => motions[$pattern] || ""}
  animation-play-state: ${({ $on }) => ($on ? "running" : "paused")};
  ${({ $delay }) => $delay && `animation-delay: ${$delay};`}
  ${({ $on }) => $on && "will-change: transform, opacity;"}

  /* The rings pulse out from the band's own top edge, so this one layer is
     pinned to the box rather than oversized. */
  ${({ $pattern }) =>
    $pattern === "rings" &&
    css`
      inset: 0;
    `}

  @media (prefers-reduced-motion: reduce) {
    animation: none;
    transform: none;
    opacity: 1;
    will-change: auto;
  }
`;

/** Slow light pass over the technical patterns — the plotter arm going by. */
const Sweep = styled.div`
  position: absolute;
  pointer-events: none;
  background: linear-gradient(
    ${({ $axis }) => ($axis === "y" ? "180deg" : "90deg")},
    transparent,
    rgba(${BRONZE}, 0.09),
    transparent
  );
  animation: ${({ $axis }) => ($axis === "y" ? sweepY : sweepX)}
    ${({ $axis }) => ($axis === "y" ? "17s" : "15s")} ease-in-out infinite;
  animation-play-state: ${({ $on }) => ($on ? "running" : "paused")};
  ${({ $on }) => $on && "will-change: transform, opacity;"}

  ${({ $axis }) =>
    $axis === "y"
      ? css`
          left: -5%;
          right: -5%;
          top: 0;
          height: 18%;
        `
      : css`
          top: -5%;
          bottom: -5%;
          left: 0;
          width: 32%;
        `}

  @media (prefers-reduced-motion: reduce) {
    display: none;
  }
`;

/** Full-bleed section band. Sits above the fixed body grid texture. */
const Band = styled.section`
  position: relative;
  z-index: 1;
  width: 100%;
  display: flex;
  justify-content: center;
  padding: ${({ theme }) => theme.space.section} 24px;
  scroll-margin-top: 96px;
  background: ${({ $tone }) => ($tone === "deep" ? `rgba(${INK}, 0.042)` : "transparent")};
  ${({ $tone }) =>
    $tone === "deep" &&
    css`
      border-top: 1px solid rgba(${INK}, 0.08);
      border-bottom: 1px solid rgba(${INK}, 0.08);
    `}

  @media (max-width: 640px) {
    padding-left: 18px;
    padding-right: 18px;
  }
`;

/** Which patterns earn a light pass, and along which axis. */
const SWEEP_AXIS = { grid: "x", ticks: "y" };

export const SectionShell = forwardRef(
  ({ children, $tone, $pattern, ...rest }, forwardedRef) => {
    const [viewRef, inView] = useInView();
    const sweepAxis = SWEEP_AXIS[$pattern];

    // One ref has to serve both the observer and any caller that wants the
    // node; assigning through keeps both live.
    const setRef = (node) => {
      viewRef.current = node;
      if (typeof forwardedRef === "function") forwardedRef(node);
      else if (forwardedRef) forwardedRef.current = node;
    };

    return (
      <Band ref={setRef} $tone={$tone} {...rest}>
        <PatternMask aria-hidden="true">
          <PatternLayer $pattern={$pattern} $on={inView} />
          {/* A second ring layer half a cycle behind turns one expanding pulse
              into a continuous train of them. */}
          {$pattern === "rings" && (
            <PatternLayer $pattern="rings" $on={inView} $delay="-5.5s" />
          )}
          {sweepAxis && <Sweep $axis={sweepAxis} $on={inView} />}
        </PatternMask>
        {children}
      </Band>
    );
  }
);

SectionShell.displayName = "SectionShell";

/** Centred content column shared by every section. */
export const SectionInner = styled.div`
  /* Above the band pattern painted by PatternMask */
  position: relative;
  z-index: 1;
  width: 100%;
  max-width: ${({ theme }) => theme.maxWidth};
  display: flex;
  flex-direction: column;
  align-items: ${({ $center }) => ($center ? "center" : "stretch")};
`;

/** Hairline divider used between bands instead of the old clip-path wedges. */
export const Divider = styled.div`
  width: 100%;
  height: 1px;
  background: linear-gradient(
    90deg,
    transparent,
    ${({ theme }) => theme.border_strong} 20%,
    ${({ theme }) => theme.border_strong} 80%,
    transparent
  );
  opacity: 0.6;
`;
