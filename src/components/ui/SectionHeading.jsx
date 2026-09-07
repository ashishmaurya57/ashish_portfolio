import React from "react";
import styled from "styled-components";
import Reveal from "./Reveal";
import { Eyebrow, GradientText } from "./Primitives";
import { fadeInUp } from "../../utils/motion";

const Head = styled.header`
  display: flex;
  flex-direction: column;
  gap: 16px;
  margin-bottom: 56px;
  max-width: 720px;
  align-items: ${({ $center }) => ($center ? "center" : "flex-start")};
  text-align: ${({ $center }) => ($center ? "center" : "left")};
  ${({ $center }) => $center && "margin-left: auto; margin-right: auto;"}

  @media (max-width: 768px) {
    margin-bottom: 40px;
  }
`;

const Title = styled.h2`
  /* Fluid so the headline never wraps awkwardly between 360px and 1440px */
  font-size: clamp(30px, 5vw, 46px);
  font-weight: 600;
  color: ${({ theme }) => theme.text_primary};
`;

const Desc = styled.p`
  font-size: clamp(15px, 1.6vw, 17px);
  line-height: 1.7;
  color: ${({ theme }) => theme.text_secondary};
`;

/** Shared heading block so every section shares one rhythm and type scale. */
const SectionHeading = ({ eyebrow, title, highlight, description, center = false }) => (
  <Head $center={center}>
    {eyebrow && (
      <Reveal variants={fadeInUp}>
        <Eyebrow>{eyebrow}</Eyebrow>
      </Reveal>
    )}
    <Reveal variants={fadeInUp} delay={0.06}>
      <Title>
        {title} {highlight && <GradientText>{highlight}</GradientText>}
      </Title>
    </Reveal>
    {description && (
      <Reveal variants={fadeInUp} delay={0.12}>
        <Desc>{description}</Desc>
      </Reveal>
    )}
  </Head>
);

export default SectionHeading;
