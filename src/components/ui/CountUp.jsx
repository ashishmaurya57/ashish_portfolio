import React, { useEffect, useState } from "react";
import useInView from "../../hooks/useInView";
import usePrefersReducedMotion from "../../hooks/usePrefersReducedMotion";

/**
 * Counts a number up once, when it first scrolls into view.
 *
 * Two things it deliberately does not do. It never animates a value it cannot
 * parse — anything non-numeric is rendered straight through, so a future
 * "1.8k" or "peak 1869" in the same slot degrades to plain text instead of
 * NaN. And it holds the final value under reduced motion from the first
 * paint, because a statistic that only becomes readable after an animation is
 * a statistic some people never read.
 *
 * The digits are tabular so the strip does not reflow on every frame as the
 * glyph widths change.
 */
const CountUp = ({ value, duration = 1500, delay = 0, className }) => {
  const target = typeof value === "number" ? value : Number(String(value).trim());
  const numeric = Number.isFinite(target);
  const prefersReduced = usePrefersReducedMotion();
  const [ref, inView] = useInView({ once: true, rootMargin: "0px 0px -10% 0px" });

  const [display, setDisplay] = useState(() =>
    !numeric || prefersReduced ? target : 0
  );

  useEffect(() => {
    // Covers the switch being flipped mid-session: whatever the count was
    // partway through, it lands on the real number immediately.
    if (numeric && prefersReduced) setDisplay(target);
  }, [numeric, prefersReduced, target]);

  useEffect(() => {
    if (!numeric || prefersReduced || !inView) return undefined;

    let raf = 0;
    let startedAt = 0;
    const delayMs = delay * 1000;

    const frame = (now) => {
      if (!startedAt) startedAt = now;
      const elapsed = now - startedAt - delayMs;
      if (elapsed < 0) {
        raf = requestAnimationFrame(frame);
        return;
      }
      const t = Math.min(elapsed / duration, 1);
      // easeOutExpo: most of the count happens up front, then it settles —
      // a linear ramp reads like a loading spinner rather than a result.
      const eased = t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
      setDisplay(Math.round(target * eased));
      if (t < 1) raf = requestAnimationFrame(frame);
    };

    raf = requestAnimationFrame(frame);
    return () => cancelAnimationFrame(raf);
  }, [numeric, prefersReduced, inView, target, duration, delay]);

  if (!numeric) {
    return <span className={className}>{value}</span>;
  }

  return (
    <span ref={ref} className={className} style={{ fontVariantNumeric: "tabular-nums" }}>
      {display}
    </span>
  );
};

export default CountUp;
