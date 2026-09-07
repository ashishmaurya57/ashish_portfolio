import React from "react";
import styled from "styled-components";
import { motion } from "framer-motion";
import { codings } from "../../data/constants";
import CodingCard from "../cards/CodingCard";
import { SectionShell, SectionInner } from "../ui/Section";
import SectionHeading from "../ui/SectionHeading";
import { stagger, fadeInUp, viewportOnce } from "../../utils/motion";

/* The old version was a horizontally scrolling row with a hidden scrollbar —
   on desktop there was no affordance that more cards existed off-screen.
   A responsive grid shows everything at once instead. */
const Grid = styled(motion.div)`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
  align-items: stretch;

  @media (max-width: 1040px) {
    grid-template-columns: repeat(2, 1fr);
  }
  @media (max-width: 600px) {
    grid-template-columns: 1fr;
  }
`;

const Coding = () => (
  <SectionShell id="coding" $tone="deep" $pattern="ticks">
    <SectionInner>
      <SectionHeading
        eyebrow="Problem solving"
        title="Competitive"
        highlight="programming"
        description="1000+ problems across four platforms. This is where the instinct for complexity, edge cases and clean data structures comes from."
      />

      <Grid
        variants={stagger(0.08)}
        initial="hidden"
        whileInView="visible"
        viewport={viewportOnce}
      >
        {codings.map((platform, i) => (
          <CodingCard key={platform.id ?? i} project={platform} variants={fadeInUp} />
        ))}
      </Grid>
    </SectionInner>
  </SectionShell>
);

export default Coding;
