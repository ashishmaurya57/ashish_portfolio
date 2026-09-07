import React from "react";
import styled from "styled-components";
import { motion } from "framer-motion";
import { ArrowOutward, WorkspacePremiumOutlined } from "@mui/icons-material";
import { Chip } from "../ui/Primitives";

const Item = styled(motion.li)`
  position: relative;
  padding-left: 62px;
  padding-bottom: 52px;
  list-style: none;

  &:last-child {
    padding-bottom: 0;
  }

  @media (max-width: 640px) {
    padding-left: 42px;
    padding-bottom: 40px;
  }
`;

/* Node on the rail. The ring is a box-shadow so it can punch through the rail
   line without needing a wrapper element. */
const Node = styled.div`
  position: absolute;
  left: 14px;
  top: 8px;
  width: 13px;
  height: 13px;
  border-radius: 999px;
  background: ${({ theme, $current }) => ($current ? theme.bronze : theme.parchment)};
  border: 2px solid ${({ theme, $current }) => ($current ? theme.bronze : theme.candle_faint)};
  box-shadow: 0 0 0 5px ${({ theme }) => theme.bg};
  z-index: 2;

  @media (max-width: 640px) {
    left: 5px;
  }
`;

const Card = styled.div`
  position: relative;
  padding: 28px 30px;
  border-radius: ${({ theme }) => theme.radius.lg};
  background: ${({ theme }) => theme.gradient.surface};
  border: 1px solid ${({ theme }) => theme.border};
  transition: border-color 0.35s ${({ theme }) => theme.ease.out},
    transform 0.35s ${({ theme }) => theme.ease.out},
    box-shadow 0.35s ${({ theme }) => theme.ease.out};

  &:hover {
    border-color: ${({ theme }) => theme.border_accent};
    transform: translateY(-3px);
    box-shadow: ${({ theme }) => theme.shadow.lg};
  }

  @media (max-width: 640px) {
    padding: 22px 20px;
  }
`;

const Head = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 16px;
  padding-bottom: 18px;
  margin-bottom: 20px;
  border-bottom: 1px solid ${({ theme }) => theme.border_soft};
`;

const Logo = styled.div`
  flex-shrink: 0;
  display: grid;
  place-items: center;
  width: 48px;
  height: 48px;
  border-radius: ${({ theme }) => theme.radius.md};
  overflow: hidden;
  background: ${({ theme }) => theme.primary_dim};
  border: 1px solid ${({ theme }) => theme.border};
  color: ${({ theme }) => theme.bronze};
  font-family: ${({ theme }) => theme.font.mono};
  font-size: 15px;
  font-weight: 600;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

const HeadText = styled.div`
  display: flex;
  flex-direction: column;
  gap: 3px;
  min-width: 0;
`;

const Role = styled.h3`
  font-size: 24px;
  font-weight: 600;
  line-height: 1.25;
  color: ${({ theme }) => theme.text_primary};

  @media (max-width: 640px) {
    font-size: 21px;
  }
`;

const Company = styled.span`
  font-size: 16px;
  font-weight: 500;
  color: ${({ theme }) => theme.bronze};
`;

const DateTag = styled.span`
  margin-top: 5px;
  font-family: ${({ theme }) => theme.font.mono};
  font-size: 11.5px;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: ${({ theme }) => theme.text_muted};
`;

const Summary = styled.p`
  font-size: 16px;
  font-style: italic;
  line-height: 1.65;
  color: ${({ theme }) => theme.text_secondary};
  margin-bottom: 22px;
`;

const ProjectBlock = styled.div`
  & + & {
    margin-top: 24px;
    padding-top: 22px;
    border-top: 1px solid ${({ theme }) => theme.border_soft};
  }
`;

const ProjectName = styled.h4`
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 14px;
  font-family: ${({ theme }) => theme.font.mono};
  font-size: 12px;
  font-weight: 600;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: ${({ theme }) => theme.text_primary};

  &::after {
    content: "";
    flex: 1;
    height: 1px;
    background: ${({ theme }) => theme.border};
  }
`;

const Bullets = styled.ul`
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin: 0;
  padding: 0;
  list-style: none;
`;

const Bullet = styled.li`
  position: relative;
  padding-left: 22px;
  font-size: 15.5px;
  line-height: 1.7;
  color: ${({ theme }) => theme.text_secondary};

  /* Custom marker so the colour is a token, not a browser default */
  &::before {
    content: "";
    position: absolute;
    left: 3px;
    top: 11px;
    width: 5px;
    height: 5px;
    border-radius: 999px;
    background: ${({ theme }) => theme.sepia};
  }
`;

const Stack = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 24px;
  padding-top: 20px;
  border-top: 1px solid ${({ theme }) => theme.border_soft};
`;

const CertLink = styled.a`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  margin-top: 18px;
  font-family: ${({ theme }) => theme.font.mono};
  font-size: 12.5px;
  font-weight: 500;
  color: ${({ theme }) => theme.bronze};

  svg {
    font-size: 16px;
  }

  &:hover {
    text-decoration: underline;
    text-underline-offset: 3px;
  }
`;

/** One entry in the experience rail. `current` highlights the live role. */
const ExperienceCard = ({ experience, variants, current = false }) => {
  const initials = (experience?.company || "?")
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <Item variants={variants}>
      <Node $current={current} aria-hidden="true" />
      <Card>
        <Head>
          <Logo>{initials}</Logo>
          <HeadText>
            <Role>{experience?.role}</Role>
            <Company>{experience?.company}</Company>
            <DateTag>{experience?.date}</DateTag>
          </HeadText>
        </Head>

        {experience?.summary && <Summary>{experience.summary}</Summary>}

        {experience?.projects?.map((project, i) => (
          <ProjectBlock key={project.name || `block-${i}`}>
            {/* A single-product role has no sub-heading to show */}
            {project.name && <ProjectName>{project.name}</ProjectName>}
            <Bullets>
              {project.bullets.map((b, bi) => (
                <Bullet key={bi}>{b}</Bullet>
              ))}
            </Bullets>
          </ProjectBlock>
        ))}

        {experience?.skills?.length > 0 && (
          <Stack>
            {experience.skills.map((s) => (
              <Chip key={s}>{s}</Chip>
            ))}
          </Stack>
        )}

        {experience?.doc && (
          <CertLink href={experience.doc} target="_blank" rel="noreferrer">
            <WorkspacePremiumOutlined /> Certificate{" "}
            <ArrowOutward style={{ fontSize: 13 }} />
          </CertLink>
        )}
      </Card>
    </Item>
  );
};

export default ExperienceCard;
