import React from "react";
import { motion } from "framer-motion";
import { fadeInUp, viewportOnce } from "../../utils/motion";
import usePrefersReducedMotion from "../../hooks/usePrefersReducedMotion";

/**
 * Scroll-reveal wrapper. Under reduced motion it renders the child plainly —
 * the content must never depend on an animation having run to become visible.
 */
const Reveal = ({
  children,
  variants = fadeInUp,
  delay = 0,
  as = "div",
  className,
  style,
  ...rest
}) => {
  const prefersReduced = usePrefersReducedMotion();
  const Tag = motion[as] || motion.div;

  if (prefersReduced) {
    const Plain = as;
    return (
      <Plain className={className} style={style}>
        {children}
      </Plain>
    );
  }

  return (
    <Tag
      className={className}
      style={style}
      variants={variants}
      initial="hidden"
      whileInView="visible"
      viewport={viewportOnce}
      transition={{ delay }}
      {...rest}
    >
      {children}
    </Tag>
  );
};

export default Reveal;
