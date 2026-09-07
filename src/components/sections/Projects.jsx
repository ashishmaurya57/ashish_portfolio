import React, { useMemo } from "react";
import styled from "styled-components";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowOutward } from "@mui/icons-material";
import { projects } from "../../data/constants";
import FeaturedProject from "../cards/FeaturedProject";
import { SectionShell, SectionInner } from "../ui/Section";
import SectionHeading from "../ui/SectionHeading";
import { GhostButton } from "../ui/Primitives";
import { stagger, fadeInUp, viewportOnce } from "../../utils/motion";

/*
 * Home shows only the flagship work — full editorial treatment for the three
 * platforms owned end to end at Cognio Labs. Everything else (the personal
 * side-projects) moved to its own /projects gallery rather than a long index
 * list bolted onto the bottom of the home page.
 */

const FeaturedList = styled(motion.div)`
  display: flex;
  flex-direction: column;

  /* The first entry's top rule would double up with the heading's spacing */
  > *:first-child {
    border-top: none;
    padding-top: 0;
  }
`;

const MoreRow = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 56px;
`;

const Projects = () => {
  const featured = useMemo(() => projects.filter((p) => p.featured), []);

  return (
    <SectionShell id="projects" $pattern="grid">
      <SectionInner>
        <SectionHeading
          eyebrow="Selected work"
          title="Things I have"
          highlight="built"
          description="Three platforms I own end to end at Cognio Labs."
        />

        <FeaturedList
          variants={stagger(0.1)}
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
        >
          {featured.map((project, i) => (
            <FeaturedProject
              key={project.id}
              project={project}
              index={i}
              variants={fadeInUp}
            />
          ))}
        </FeaturedList>

        <MoreRow>
          <GhostButton as={Link} to="/projects">
            All projects <ArrowOutward />
          </GhostButton>
        </MoreRow>
      </SectionInner>
    </SectionShell>
  );
};

export default Projects;
