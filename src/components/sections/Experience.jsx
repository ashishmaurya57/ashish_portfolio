import React, { useRef } from "react";
import styled from "styled-components";
import { motion, useScroll, useSpring } from "framer-motion";
import { experiences, certifications } from "../../data/constants";
import ExperienceCard from "../cards/ExperienceCard";
import { SectionShell, SectionInner } from "../ui/Section";
import SectionHeading from "../ui/SectionHeading";
import { stagger, fadeInUp, viewportOnce } from "../../utils/motion";
import usePrefersReducedMotion from "../../hooks/usePrefersReducedMotion";

/*
 * Custom timeline replacing react-vertical-timeline-component.
 *
 * The old library forced a two-column layout that collapsed badly on mobile and
 * shipped its own stylesheet we had to fight. This is a single left rail whose
 * fill tracks scroll position, which reads as progress through the career.
 */

const Rail = styled.div`
  position: relative;
`;

const Track = styled.div`
  position: absolute;
  left: 21px;
  top: 6px;
  bottom: 6px;
  width: 2px;
  background: ${({ theme }) => theme.border};
  border-radius: 2px;

  @media (max-width: 640px) {
    left: 13px;
  }
`;

const Fill = styled(motion.div)`
  position: absolute;
  inset: 0;
  transform-origin: top;
  background: linear-gradient(
    180deg,
    ${({ theme }) => theme.primary},
    ${({ theme }) => theme.cyan}
  );
  border-radius: 2px;
`;

const List = styled(motion.ol)`
  position: relative;
  margin: 0;
  padding: 0;
`;

const CertBlock = styled.div`
  margin-top: 44px;
  padding-top: 32px;
  border-top: 1px solid ${({ theme }) => theme.border};
`;

const CertHead = styled.h4`
  font-family: ${({ theme }) => theme.font.mono};
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: ${({ theme }) => theme.text_muted};
  margin-bottom: 16px;
`;

const CertRow = styled.a`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  padding: 16px 20px;
  border-radius: ${({ theme }) => theme.radius.md};
  border: 1px solid ${({ theme }) => theme.border};
  background: rgba(36, 29, 19, 0.025);
  transition: all 0.28s ${({ theme }) => theme.ease.out};

  &:hover {
    border-color: ${({ theme }) => theme.border_accent};
    background: ${({ theme }) => theme.primary_dim};
  }

  div {
    display: flex;
    flex-direction: column;
    gap: 2px;
  }
  strong {
    font-size: 15px;
    font-weight: 600;
    color: ${({ theme }) => theme.text_primary};
  }
  span {
    font-size: 13px;
    color: ${({ theme }) => theme.text_muted};
  }
  em {
    flex-shrink: 0;
    font-family: ${({ theme }) => theme.font.mono};
    font-size: 11.5px;
    font-style: normal;
    color: ${({ theme }) => theme.primary};
  }
`;

const Experience = () => {
  const railRef = useRef(null);
  const prefersReduced = usePrefersReducedMotion();

  // Fill maps to the rail's own passage through the viewport, so it completes
  // exactly as the last card leaves rather than at an arbitrary page offset.
  const { scrollYProgress } = useScroll({
    target: railRef,
    offset: ["start 75%", "end 55%"],
  });
  const scaleY = useSpring(scrollYProgress, { stiffness: 120, damping: 28, restDelta: 0.001 });

  return (
    <SectionShell id="experience" $tone="deep" $pattern="rules">
      <SectionInner>
        <SectionHeading
          eyebrow="Experience"
          title="Where I have"
          highlight="shipped"
          description="Roles where I owned systems end to end — from the API contract down to the retrieval layer and the deploy pipeline."
        />

        <Rail ref={railRef}>
          <Track aria-hidden="true">
            <Fill style={{ scaleY: prefersReduced ? 1 : scaleY }} />
          </Track>

          <List
            variants={stagger(0.12)}
            initial="hidden"
            whileInView="visible"
            viewport={viewportOnce}
          >
            {experiences.map((experience, i) => (
              <ExperienceCard
                key={experience.id ?? i}
                experience={experience}
                variants={fadeInUp}
                current={i === 0}
              />
            ))}
          </List>
        </Rail>

        {certifications.length > 0 && (
          <CertBlock>
            <CertHead>Certifications</CertHead>
            {certifications.map((c) => (
              <CertRow key={c.id} href={c.link} target="_blank" rel="noreferrer">
                <div>
                  <strong>{c.title}</strong>
                  <span>
                    {c.issuer} · {c.desc}
                  </span>
                </div>
                <em>{c.date}</em>
              </CertRow>
            ))}
          </CertBlock>
        )}
      </SectionInner>
    </SectionShell>
  );
};

export default Experience;
