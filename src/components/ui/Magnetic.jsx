import React, { useRef } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";
import usePrefersReducedMotion from "../../hooks/usePrefersReducedMotion";
import useIsPointerFine from "../../hooks/useIsPointerFine";

/**
 * Pulls its child toward the pointer while hovered, then springs back.
 *
 * `strength` is the fraction of the distance from element centre to pointer that
 * the child travels — 0.3 is a nudge, 0.6 is obviously playful. Keep it low on
 * anything the user has to click accurately.
 */
const Magnetic = ({ children, strength = 0.32, className, style }) => {
  const ref = useRef(null);
  const prefersReduced = usePrefersReducedMotion();
  const isPointerFine = useIsPointerFine();
  const enabled = isPointerFine && !prefersReduced;

  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 260, damping: 20, mass: 0.5 });
  const springY = useSpring(y, { stiffness: 260, damping: 20, mass: 0.5 });

  const handleMove = (e) => {
    if (!enabled || !ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    x.set((e.clientX - centerX) * strength);
    y.set((e.clientY - centerY) * strength);
  };

  const reset = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      ref={ref}
      className={className}
      style={{ x: enabled ? springX : 0, y: enabled ? springY : 0, display: "inline-flex", ...style }}
      onMouseMove={handleMove}
      onMouseLeave={reset}
      // Focus travels by keyboard, where there is no pointer to be magnetic to.
      onBlur={reset}
    >
      {children}
    </motion.div>
  );
};

export default Magnetic;
