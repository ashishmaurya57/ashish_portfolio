import React from "react";
import styled from "styled-components";
import { motion } from "framer-motion";
import { ArrowOutward } from "@mui/icons-material";
import { getIcon } from "../ui/icons";
import TiltCard from "../ui/TiltCard";

/*
 * Platform logo, drawn as a vector icon rather than a remote PNG.
 *
 * The previous version pointed at raw.githubusercontent.com images that
 * either 404'd or were blocked by the browser — an icon that silently fails
 * to load just leaves a blank white plate, which is worse than no logo at
 * all. react-icons ships the exact brand mark as an inline SVG bundled into
 * the app, so it always renders and always matches the theme.
 */

const Shell = styled(motion.a)`
  display: block;
  height: 100%;
`;

const Card = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  height: 100%;
  padding: 26px 24px;
  border-radius: ${({ theme }) => theme.radius.lg};
  background: ${({ theme }) => theme.gradient.surface};
  border: 1px solid ${({ theme }) => theme.border};
  transition: border-color 0.35s ${({ theme }) => theme.ease.out},
    box-shadow 0.35s ${({ theme }) => theme.ease.out};

  &:hover {
    border-color: ${({ theme }) => theme.border_accent};
    box-shadow: ${({ theme }) => theme.shadow.lg};
  }
`;

const Head = styled.div`
  display: flex;
  align-items: center;
  gap: 13px;
`;

const Logo = styled.div`
  display: grid;
  place-items: center;
  flex-shrink: 0;
  width: 44px;
  height: 44px;
  border-radius: 12px;
  background: ${({ theme }) => theme.primary_dim};
  border: 1px solid ${({ theme }) => theme.border_accent};
  color: ${({ theme }) => theme.bronze};

  svg {
    width: 22px;
    height: 22px;
  }
`;

const Name = styled.h3`
  font-size: 16.5px;
  font-weight: 600;
  color: ${({ theme }) => theme.text_primary};
`;

const Rating = styled.div`
  display: flex;
  align-items: baseline;
  gap: 8px;

  strong {
    font-family: ${({ theme }) => theme.font.display};
    font-size: 30px;
    font-weight: 700;
    letter-spacing: -0.03em;
    color: ${({ theme }) => theme.text_primary};
  }
  span {
    font-family: ${({ theme }) => theme.font.mono};
    font-size: 11px;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    color: ${({ theme }) => theme.text_muted};
  }
`;

const Achievements = styled.ul`
  display: flex;
  flex-direction: column;
  gap: 9px;
  margin: 0;
  padding: 16px 0 0;
  list-style: none;
  border-top: 1px solid ${({ theme }) => theme.border};
`;

const Achievement = styled.li`
  position: relative;
  padding-left: 18px;
  font-size: 13.5px;
  line-height: 1.6;
  color: ${({ theme }) => theme.text_secondary};

  &::before {
    content: "";
    position: absolute;
    left: 1px;
    top: 8px;
    width: 5px;
    height: 5px;
    border-radius: 999px;
    background: ${({ theme }) => theme.bronze};
  }
`;

const Visit = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  margin-top: auto;
  padding-top: 16px;
  font-family: ${({ theme }) => theme.font.mono};
  font-size: 11.5px;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: ${({ theme }) => theme.text_muted};
  transition: color 0.25s ${({ theme }) => theme.ease.out};

  svg {
    font-size: 14px;
  }

  ${Card}:hover & {
    color: ${({ theme }) => theme.bronze};
  }
`;

const CodingCard = ({ project, variants }) => {
  const Icon = getIcon(project.icon);

  return (
    <Shell
      href={project.link}
      target="_blank"
      rel="noreferrer"
      variants={variants}
      aria-label={`${project.platform} profile`}
    >
      <TiltCard max={7} glare={false} style={{ height: "100%" }}>
        <Card>
          <Head>
            <Logo>
              <Icon aria-hidden="true" />
            </Logo>
            <Name>{project.platform}</Name>
          </Head>

          {project.rating ? (
            <Rating>
              <strong>{project.rating}</strong>
              <span>peak rating</span>
            </Rating>
          ) : (
            <Rating>
              <strong>—</strong>
              <span>practice</span>
            </Rating>
          )}

          <Achievements>
            {project?.acheive?.map((a, i) => (
              <Achievement key={i}>{a}</Achievement>
            ))}
          </Achievements>

          <Visit>
            View profile <ArrowOutward />
          </Visit>
        </Card>
      </TiltCard>
    </Shell>
  );
};

export default CodingCard;
