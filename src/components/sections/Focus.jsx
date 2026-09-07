import React from "react";
import styled from "styled-components";
import { motion } from "framer-motion";
import { getIcon } from "../ui/icons";
import { focusAreas } from "../../data/constants";
import { SectionShell, SectionInner } from "../ui/Section";
import SectionHeading from "../ui/SectionHeading";
import { Chip } from "../ui/Primitives";
import { stagger, fadeInUp, viewportOnce } from "../../utils/motion";

/*
 * Bento grid of capability pillars. This is the section that answers
 * "what would you hire him to do" before a recruiter reaches the timeline.
 * The first card is deliberately wider — it carries the strongest story.
 */

const Grid = styled(motion.div)`
  display: grid;
  grid-template-columns: repeat(6, minmax(0, 1fr));
  gap: 20px;

  /* Wide lead card, then three equal ones. */
  > *:nth-child(1) {
    grid-column: span 4;
  }
  > *:nth-child(2) {
    grid-column: span 2;
  }
  > *:nth-child(3) {
    grid-column: span 3;
  }
  > *:nth-child(4) {
    grid-column: span 3;
  }

  @media (max-width: 900px) {
    grid-template-columns: minmax(0, 1fr);
    > * {
      grid-column: span 1 !important;
    }
  }
`;

const Card = styled(motion.article)`
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 14px;
  padding: 30px;
  border-radius: ${({ theme }) => theme.radius.lg};
  background: ${({ theme }) => theme.gradient.surface};
  border: 1px solid ${({ theme }) => theme.border};
  overflow: hidden;
  transition: border-color 0.35s ${({ theme }) => theme.ease.out},
    transform 0.35s ${({ theme }) => theme.ease.out};

  /* Accent wash that only appears on hover, kept behind the content. */
  &::before {
    content: "";
    position: absolute;
    inset: 0;
    background: ${({ theme }) => theme.gradient.accent_soft};
    opacity: 0;
    transition: opacity 0.35s ${({ theme }) => theme.ease.out};
    pointer-events: none;
  }

  &:hover {
    border-color: ${({ theme }) => theme.border_accent};
    transform: translateY(-4px);
  }
  &:hover::before {
    opacity: 1;
  }

  > * {
    position: relative;
    z-index: 1;
  }

  @media (max-width: 640px) {
    padding: 24px 22px;
  }
`;

const IconBox = styled.div`
  display: grid;
  place-items: center;
  width: 46px;
  height: 46px;
  border-radius: 13px;
  background: ${({ theme }) => theme.primary_dim};
  border: 1px solid ${({ theme }) => theme.border_accent};
  color: ${({ theme }) => theme.primary};

  svg {
    width: 22px;
    height: 22px;
  }
`;

const Title = styled.h3`
  font-size: 20px;
  font-weight: 600;
  color: ${({ theme }) => theme.text_primary};
`;

const Body = styled.p`
  font-size: 15px;
  line-height: 1.7;
  color: ${({ theme }) => theme.text_secondary};
`;

const Stack = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: auto;
  padding-top: 6px;
`;

const Index = styled.span`
  position: absolute;
  top: 24px;
  right: 26px;
  font-family: ${({ theme }) => theme.font.mono};
  font-size: 12px;
  color: ${({ theme }) => theme.text_muted};
  opacity: 0.6;
`;

const Focus = () => (
  <SectionShell id="focus" $tone="deep" $pattern="dots">
    <SectionInner>
      <SectionHeading
        eyebrow="What I do"
        title="Four things I build"
        highlight="end to end"
        description="I sit between the model and the infrastructure: designing the agent logic, the retrieval that grounds it, and the backend that serves it at a cost that survives contact with production."
      />

      <Grid
        variants={stagger(0.09)}
        initial="hidden"
        whileInView="visible"
        viewport={viewportOnce}
      >
        {focusAreas.map((area, i) => {
          const Icon = getIcon(area.icon);
          return (
            <Card key={area.id} variants={fadeInUp}>
              <Index>{String(i + 1).padStart(2, "0")}</Index>
              <IconBox>
                <Icon />
              </IconBox>
              <Title>{area.title}</Title>
              <Body>{area.description}</Body>
              <Stack>
                {area.stack.map((s) => (
                  <Chip key={s}>{s}</Chip>
                ))}
              </Stack>
            </Card>
          );
        })}
      </Grid>
    </SectionInner>
  </SectionShell>
);

export default Focus;
