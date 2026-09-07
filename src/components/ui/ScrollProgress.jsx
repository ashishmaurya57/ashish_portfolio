import React from "react";
import styled from "styled-components";
import { motion, useScroll, useSpring } from "framer-motion";

const Bar = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: 2px;
  transform-origin: 0%;
  background: ${({ theme }) => theme.gradient.accent};
  z-index: 1200;
`;

/** Reading-position indicator across the whole page. */
const ScrollProgress = () => {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 140, damping: 26, restDelta: 0.001 });
  return <Bar aria-hidden="true" style={{ scaleX }} />;
};

export default ScrollProgress;
