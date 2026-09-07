import React, { useRef, useState } from "react";
import styled from "styled-components";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import usePrefersReducedMotion from "../../hooks/usePrefersReducedMotion";
import useIsPointerFine from "../../hooks/useIsPointerFine";

/*
 * 3D hover tilt plus a specular highlight that tracks the pointer.
 *
 * The rotation is driven off normalised (-0.5..0.5) pointer coordinates rather
 * than raw pixels, so the effect feels identical on a small card and a wide one.
 */

const Shell = styled(motion.div)`
  position: relative;
  transform-style: preserve-3d;
  will-change: transform;
`;

const Glare = styled(motion.div)`
  position: absolute;
  inset: 0;
  border-radius: inherit;
  pointer-events: none;
  z-index: 3;
  mix-blend-mode: soft-light;
`;

const TiltCard = ({ children, max = 9, glare = true, className, style, ...rest }) => {
  const ref = useRef(null);
  const prefersReduced = usePrefersReducedMotion();
  const isPointerFine = useIsPointerFine();
  const enabled = isPointerFine && !prefersReduced;

  const [hovered, setHovered] = useState(false);
  const px = useMotionValue(0); // -0.5 .. 0.5
  const py = useMotionValue(0);

  const spring = { stiffness: 220, damping: 22, mass: 0.5 };
  const rotateX = useSpring(useTransform(py, [-0.5, 0.5], [max, -max]), spring);
  const rotateY = useSpring(useTransform(px, [-0.5, 0.5], [-max, max]), spring);

  const glareX = useTransform(px, [-0.5, 0.5], ["0%", "100%"]);
  const glareY = useTransform(py, [-0.5, 0.5], ["0%", "100%"]);
  const glareBg = useTransform(
    [glareX, glareY],
    ([gx, gy]) =>
      `radial-gradient(circle at ${gx} ${gy}, rgba(255,255,255,0.30), rgba(255,255,255,0) 55%)`
  );

  const handleMove = (e) => {
    if (!enabled || !ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    px.set((e.clientX - rect.left) / rect.width - 0.5);
    py.set((e.clientY - rect.top) / rect.height - 0.5);
  };

  const handleLeave = () => {
    setHovered(false);
    px.set(0);
    py.set(0);
  };

  return (
    <Shell
      ref={ref}
      className={className}
      onMouseMove={handleMove}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={handleLeave}
      style={{
        rotateX: enabled ? rotateX : 0,
        rotateY: enabled ? rotateY : 0,
        perspective: 1000,
        ...style,
      }}
      animate={enabled && hovered ? { scale: 1.02 } : { scale: 1 }}
      transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
      {...rest}
    >
      {children}
      {enabled && glare && (
        <Glare style={{ background: glareBg }} animate={{ opacity: hovered ? 1 : 0 }} />
      )}
    </Shell>
  );
};

export default TiltCard;
