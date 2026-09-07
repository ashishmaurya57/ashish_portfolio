import React, { useState } from "react";
import styled from "styled-components";
import { motion } from "framer-motion";
import { GitHub, ArrowOutward, ImageNotSupportedOutlined } from "@mui/icons-material";
import { Chip } from "../ui/Primitives";

/*
 * A flagship project rendered as a full-width editorial entry rather than a card.
 *
 * The previous uniform grid gave Druidix exactly as much visual weight as a
 * browser memory game, which is the wrong signal to send a hiring manager. Here
 * the three flagship projects get real space and everything else drops to a
 * compact index below.
 *
 * Entries alternate which side the image sits on, so a run of three does not
 * read as a repeating template.
 */

const Entry = styled(motion.article)`
  display: grid;
  grid-template-columns: 1.05fr 1fr;
  gap: 48px;
  align-items: center;
  padding: 52px 0;
  border-top: 1px solid ${({ theme }) => theme.border};

  /* Flip the image to the other side on alternating entries */
  ${({ $flip }) =>
    $flip &&
    `
    direction: rtl;
    > * { direction: ltr; }
  `}

  @media (max-width: 900px) {
    grid-template-columns: 1fr;
    gap: 26px;
    padding: 38px 0;
    direction: ltr;
  }
`;

const Media = styled.a`
  position: relative;
  display: block;
  aspect-ratio: 16 / 10;
  border-radius: ${({ theme }) => theme.radius.lg};
  overflow: hidden;
  background: ${({ theme }) => theme.parchment_deep};
  border: 1px solid ${({ theme }) => theme.border};
  box-shadow: ${({ theme }) => theme.shadow.md};
  transition: box-shadow 0.45s ${({ theme }) => theme.ease.out},
    border-color 0.45s ${({ theme }) => theme.ease.out};

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    object-position: top center;
    display: block;
    transition: transform 0.7s ${({ theme }) => theme.ease.out};
  }

  &:hover {
    box-shadow: ${({ theme }) => theme.shadow.lg};
    border-color: ${({ theme }) => theme.border_accent};
  }
  &:hover img {
    transform: scale(1.035);
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
    font-size: 32px;
    opacity: 0.45;
  }
`;

const Body = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const Kicker = styled.div`
  display: flex;
  align-items: center;
  gap: 14px;
  font-family: ${({ theme }) => theme.font.mono};
  font-size: 11.5px;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: ${({ theme }) => theme.text_muted};

  b {
    font-weight: 600;
    color: ${({ theme }) => theme.bronze};
  }

  /* Rule that fills the space between the index and the year */
  hr {
    flex: 1;
    border: none;
    height: 1px;
    background: ${({ theme }) => theme.border};
  }
`;

const Title = styled.h3`
  font-size: clamp(26px, 3.4vw, 36px);
  font-weight: 600;
  line-height: 1.18;
  color: ${({ theme }) => theme.text_primary};
`;

const Desc = styled.p`
  font-size: 16.5px;
  line-height: 1.72;
  color: ${({ theme }) => theme.text_secondary};

  ${({ $expanded }) =>
    !$expanded &&
    `
    display: -webkit-box;
    -webkit-line-clamp: 5;
    -webkit-box-orient: vertical;
    overflow: hidden;
  `}
`;

const MoreBtn = styled.button`
  align-self: flex-start;
  padding: 0;
  background: none;
  border: none;
  cursor: pointer;
  font-family: ${({ theme }) => theme.font.mono};
  font-size: 11.5px;
  font-weight: 600;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: ${({ theme }) => theme.bronze};

  &:hover {
    text-decoration: underline;
    text-underline-offset: 4px;
  }
`;

const Tags = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 2px;
`;

const Links = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  margin-top: 8px;
  flex-wrap: wrap;
`;

const Action = styled.a`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  min-height: 46px;
  padding: 0 20px;
  border-radius: ${({ theme }) => theme.radius.pill};
  border: 1px solid ${({ theme }) => theme.border_strong};
  font-family: ${({ theme }) => theme.font.mono};
  font-size: 12px;
  font-weight: 500;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: ${({ theme }) => theme.text_primary};
  transition: all 0.25s ${({ theme }) => theme.ease.out};

  svg {
    font-size: 16px;
  }

  &:hover {
    background: ${({ theme }) => theme.candle};
    border-color: ${({ theme }) => theme.bronze};
  }

  ${({ $solid, theme }) =>
    $solid &&
    `
    background: ${theme.ink};
    border-color: ${theme.ink};
    color: ${theme.parchment};
    &:hover {
      background: ${theme.bronze};
      border-color: ${theme.bronze};
      color: ${theme.parchment};
    }
  `}
`;

const NoLink = styled.span`
  font-family: ${({ theme }) => theme.font.mono};
  font-size: 11.5px;
  letter-spacing: 0.06em;
  color: ${({ theme }) => theme.text_muted};
`;

const FeaturedProject = ({ project, index, variants }) => {
  const [expanded, setExpanded] = useState(false);
  const [imgFailed, setImgFailed] = useState(false);

  const isLong = (project.description || "").length > 300;
  const href = project.webapp || project.github;

  const media = (
    <>
      {imgFailed || !project.image ? (
        <Placeholder>
          <ImageNotSupportedOutlined />
        </Placeholder>
      ) : (
        <img
          src={project.image}
          alt={`${project.title} interface`}
          loading="lazy"
          referrerPolicy="no-referrer"
          onError={() => setImgFailed(true)}
        />
      )}
    </>
  );

  return (
    <Entry variants={variants} $flip={index % 2 === 1}>
      {/* Only wrap the image in an anchor when there is somewhere to go */}
      {href ? (
        <Media as="a" href={href} target="_blank" rel="noreferrer" aria-label={`Open ${project.title}`}>
          {media}
        </Media>
      ) : (
        <Media as="div">{media}</Media>
      )}

      <Body>
        <Kicker>
          <b>{String(index + 1).padStart(2, "0")}</b>
          <hr />
          <span>{project.date}</span>
        </Kicker>

        <Title>{project.title}</Title>

        <Desc $expanded={expanded}>{project.description}</Desc>
        {isLong && (
          <MoreBtn onClick={() => setExpanded((v) => !v)}>
            {expanded ? "Show less" : "Read more"}
          </MoreBtn>
        )}

        {project.tags?.length > 0 && (
          <Tags>
            {project.tags.map((t) => (
              <Chip key={t}>{t}</Chip>
            ))}
          </Tags>
        )}

        <Links>
          {project.webapp && (
            <Action href={project.webapp} target="_blank" rel="noreferrer" $solid>
              Live demo <ArrowOutward />
            </Action>
          )}
          {project.github && (
            <Action href={project.github} target="_blank" rel="noreferrer">
              <GitHub /> Code
            </Action>
          )}
          {/* Client work is usually closed — say so rather than showing a dead button */}
          {!project.webapp && !project.github && <NoLink>Private client work</NoLink>}
        </Links>
      </Body>
    </Entry>
  );
};

export default FeaturedProject;
