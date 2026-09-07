import React from "react";
import styled from "styled-components";
import { Link } from "react-router-dom";
import { ArrowBackRounded } from "@mui/icons-material";
import Reveal from "./Reveal";
import { Eyebrow, GradientText } from "./Primitives";
import { fadeInUp } from "../../utils/motion";

/*
 * Shared header for standalone pages (Projects, Blog). Keeps the "back to
 * home" affordance, eyebrow/title/description rhythm and top spacing
 * identical across every non-home page instead of each one improvising its
 * own header block.
 */

const Wrap = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  max-width: 760px;
  margin-bottom: 56px;
`;

const Back = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: 7px;
  align-self: flex-start;
  font-family: ${({ theme }) => theme.font.mono};
  font-size: 12.5px;
  font-weight: 500;
  letter-spacing: 0.04em;
  color: ${({ theme }) => theme.text_muted};
  transition: color 0.25s ${({ theme }) => theme.ease.out};

  svg {
    font-size: 15px;
  }

  &:hover {
    color: ${({ theme }) => theme.bronze};
  }
`;

const Title = styled.h1`
  font-size: clamp(32px, 5.4vw, 50px);
  font-weight: 600;
  color: ${({ theme }) => theme.text_primary};
`;

const Desc = styled.p`
  font-size: clamp(15px, 1.6vw, 17px);
  line-height: 1.72;
  color: ${({ theme }) => theme.text_secondary};
`;

const PageHeader = ({ eyebrow, title, highlight, description, backLabel = "Back home" }) => (
  <Wrap>
    <Back to="/">
      <ArrowBackRounded /> {backLabel}
    </Back>
    {eyebrow && (
      <Reveal variants={fadeInUp}>
        <Eyebrow>{eyebrow}</Eyebrow>
      </Reveal>
    )}
    <Reveal variants={fadeInUp} delay={0.05}>
      <Title>
        {title} {highlight && <GradientText>{highlight}</GradientText>}
      </Title>
    </Reveal>
    {description && (
      <Reveal variants={fadeInUp} delay={0.1}>
        <Desc>{description}</Desc>
      </Reveal>
    )}
  </Wrap>
);

export default PageHeader;
