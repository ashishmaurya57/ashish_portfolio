import React, { useState } from "react";
import styled from "styled-components";
import { motion } from "framer-motion";
import { GitHub, ArrowOutward, ImageNotSupportedOutlined } from "@mui/icons-material";
import TiltCard from "../ui/TiltCard";
import { Chip } from "../ui/Primitives";

/*
 * Compact visual card for the "rest" of the projects on the dedicated /projects
 * gallery — more presence than a text row, lighter than the full editorial
 * FeaturedProject treatment used for the three flagship builds.
 */

const Shell = styled(motion.article)`
  height: 100%;
`;

const Card = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  border-radius: ${({ theme }) => theme.radius.lg};
  background: ${({ theme }) => theme.gradient.surface};
  border: 1px solid ${({ theme }) => theme.border};
  overflow: hidden;
  transition: border-color 0.35s ${({ theme }) => theme.ease.out},
    box-shadow 0.35s ${({ theme }) => theme.ease.out};

  &:hover {
    border-color: ${({ theme }) => theme.border_accent};
    box-shadow: ${({ theme }) => theme.shadow.lg};
  }
`;

const Media = styled.div`
  position: relative;
  aspect-ratio: 16 / 10;
  overflow: hidden;
  background: ${({ theme }) => theme.parchment_deep};
  border-bottom: 1px solid ${({ theme }) => theme.border};

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
    transition: transform 0.6s ${({ theme }) => theme.ease.out};
  }

  ${Card}:hover & img {
    transform: scale(1.06);
  }
`;

const Placeholder = styled.div`
  display: grid;
  place-items: center;
  width: 100%;
  height: 100%;
  color: ${({ theme }) => theme.text_muted};
  background: repeating-linear-gradient(
    45deg,
    rgba(36, 29, 19, 0.05),
    rgba(36, 29, 19, 0.05) 10px,
    transparent 10px,
    transparent 20px
  );

  svg {
    font-size: 28px;
    opacity: 0.45;
  }
`;

const Badge = styled.span`
  position: absolute;
  top: 12px;
  left: 12px;
  padding: 4px 10px;
  border-radius: ${({ theme }) => theme.radius.pill};
  background: rgba(247, 241, 228, 0.92);
  border: 1px solid ${({ theme }) => theme.border_accent};
  font-family: ${({ theme }) => theme.font.mono};
  font-size: 10px;
  font-weight: 600;
  letter-spacing: 0.07em;
  text-transform: uppercase;
  color: ${({ theme }) => theme.bronze};
`;

const Body = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 20px;
  flex: 1;
`;

const TopRow = styled.div`
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 10px;
`;

const Title = styled.h3`
  font-size: 17px;
  font-weight: 600;
  line-height: 1.32;
  color: ${({ theme }) => theme.text_primary};
`;

const DateTag = styled.span`
  flex-shrink: 0;
  font-family: ${({ theme }) => theme.font.mono};
  font-size: 10.5px;
  color: ${({ theme }) => theme.text_muted};
  white-space: nowrap;
`;

const Desc = styled.p`
  font-size: 13.5px;
  line-height: 1.62;
  color: ${({ theme }) => theme.text_secondary};
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
`;

const Tags = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-top: 2px;
`;

const Footer = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: auto;
  padding-top: 14px;
  border-top: 1px solid ${({ theme }) => theme.border};
`;

const Action = styled.a`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  min-height: 38px;
  padding: 0 13px;
  border-radius: ${({ theme }) => theme.radius.md};
  border: 1px solid ${({ theme }) => theme.border};
  font-size: 12px;
  font-weight: 600;
  color: ${({ theme }) => theme.text_secondary};
  transition: all 0.25s ${({ theme }) => theme.ease.out};

  svg {
    font-size: 15px;
  }

  &:hover {
    color: ${({ theme }) => theme.ink};
    border-color: ${({ theme }) => theme.bronze};
    background: ${({ theme }) => theme.candle};
  }

  ${({ $primary, theme }) =>
    $primary &&
    `
    background: ${theme.primary_dim};
    border-color: ${theme.border_accent};
    color: ${theme.bronze};
  `}
`;

const CATEGORY_LABEL = { "AI/ML": "AI · GenAI", "web app": "Web app" };
const MAX_TAGS = 3;

const ProjectGridCard = ({ project, variants }) => {
  const [imgFailed, setImgFailed] = useState(false);
  const tags = project.tags || [];
  const shown = tags.slice(0, MAX_TAGS);
  const overflow = tags.length - shown.length;

  return (
    <Shell variants={variants}>
      <TiltCard max={5} glare={false} style={{ height: "100%" }}>
        <Card>
          <Media>
            {project.category && <Badge>{CATEGORY_LABEL[project.category] || project.category}</Badge>}
            {imgFailed || !project.image ? (
              <Placeholder>
                <ImageNotSupportedOutlined />
              </Placeholder>
            ) : (
              <img
                src={project.image}
                alt={`${project.title} preview`}
                loading="lazy"
                referrerPolicy="no-referrer"
                onError={() => setImgFailed(true)}
              />
            )}
          </Media>

          <Body>
            <TopRow>
              <Title>{project.title}</Title>
              {project.date && <DateTag>{project.date}</DateTag>}
            </TopRow>

            <Desc>{project.description}</Desc>

            {shown.length > 0 && (
              <Tags>
                {shown.map((t) => (
                  <Chip key={t}>{t}</Chip>
                ))}
                {overflow > 0 && <Chip>+{overflow}</Chip>}
              </Tags>
            )}

            <Footer>
              {project.webapp && (
                <Action href={project.webapp} target="_blank" rel="noreferrer" $primary>
                  Live <ArrowOutward />
                </Action>
              )}
              {project.github && (
                <Action href={project.github} target="_blank" rel="noreferrer">
                  <GitHub /> Code
                </Action>
              )}
            </Footer>
          </Body>
        </Card>
      </TiltCard>
    </Shell>
  );
};

export default ProjectGridCard;
