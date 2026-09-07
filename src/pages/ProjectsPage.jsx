import React, { useMemo } from "react";
import styled from "styled-components";
import { motion } from "framer-motion";
import { projects } from "../data/constants";
import FeaturedProject from "../components/cards/FeaturedProject";
import ProjectGridCard from "../components/cards/ProjectGridCard";
import { SectionShell, SectionInner } from "../components/ui/Section";
import PageHeader from "../components/ui/PageHeader";
import { stagger, fadeInUp, viewportOnce } from "../utils/motion";

const FeaturedList = styled(motion.div)`
  display: flex;
  flex-direction: column;
  margin-bottom: 72px;

  > *:first-child {
    border-top: none;
    padding-top: 0;
  }
`;

const IndexHead = styled.div`
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 16px;
  padding-bottom: 20px;
  margin-bottom: 28px;
  border-bottom: 1px solid ${({ theme }) => theme.border_strong};

  h2 {
    font-family: ${({ theme }) => theme.font.mono};
    font-size: 12px;
    font-weight: 600;
    letter-spacing: 0.16em;
    text-transform: uppercase;
    color: ${({ theme }) => theme.text_muted};
  }

  span {
    font-family: ${({ theme }) => theme.font.mono};
    font-size: 12px;
    color: ${({ theme }) => theme.text_muted};
  }
`;

const Grid = styled(motion.div)`
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 22px;

  @media (max-width: 1040px) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
  @media (max-width: 680px) {
    grid-template-columns: minmax(0, 1fr);
  }
`;

const ProjectsPage = () => {
  const { featured, rest } = useMemo(() => {
    const f = projects.filter((p) => p.featured);
    return { featured: f, rest: projects.filter((p) => !p.featured) };
  }, []);

  return (
    <SectionShell as="main" id="main" $pattern="grid" style={{ paddingTop: "clamp(118px, 17vw, 148px)" }}>
      <SectionInner>
        <PageHeader
          eyebrow="Everything I've shipped"
          title="All"
          highlight="projects"
          description="The three platforms I own end to end at Cognio Labs, plus the AI experiments and full-stack apps built along the way."
        />

        <FeaturedList
          variants={stagger(0.1)}
          initial="hidden"
          animate="visible"
        >
          {featured.map((project, i) => (
            <FeaturedProject key={project.id} project={project} index={i} variants={fadeInUp} />
          ))}
        </FeaturedList>

        <IndexHead>
          <h2>More work</h2>
          <span>{rest.length} projects</span>
        </IndexHead>

        <Grid
          variants={stagger(0.06)}
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
        >
          {rest.map((project) => (
            <ProjectGridCard key={project.id} project={project} variants={fadeInUp} />
          ))}
        </Grid>
      </SectionInner>
    </SectionShell>
  );
};

export default ProjectsPage;
