import React from "react";
import styled from "styled-components";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowBackRounded } from "@mui/icons-material";
import { getIcon } from "../components/ui/icons";
import { harness } from "../data/constants";
import { stagger, fadeInUp, popIn, viewportOnce } from "../utils/motion";

/*
 * Full-page write-up. This is what the home page's "Harness" band used to be,
 * moved off the home page entirely and given the room a real article needs —
 * a dek, read time, and space for five points instead of three plus the log.
 *
 * Contrast on #211A10: candle #E8D9B5 = 12.3:1, candle-faint #B3A179 = 6.8:1.
 */

const Page = styled.main`
  position: relative;
  min-height: 100vh;
  width: 100%;
  display: flex;
  justify-content: center;
  padding: 148px 24px 120px;
  background: ${({ theme }) => theme.gradient.night};
  color: ${({ theme }) => theme.candle};
  overflow: hidden;

  &::before {
    content: "";
    position: absolute;
    inset: 0;
    pointer-events: none;
    background-image: radial-gradient(rgba(232, 217, 181, 0.09) 0.5px, transparent 0.5px);
    background-size: 4px 4px;
  }

  @media (max-width: 640px) {
    padding-left: 18px;
    padding-right: 18px;
  }
`;

const Inner = styled.div`
  position: relative;
  z-index: 1;
  width: 100%;
  max-width: ${({ theme }) => theme.maxWidth};
`;

const Back = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: 7px;
  margin-bottom: 32px;
  font-family: ${({ theme }) => theme.font.mono};
  font-size: 12.5px;
  color: ${({ theme }) => theme.candle_faint};
  transition: color 0.25s ${({ theme }) => theme.ease.out};

  svg {
    font-size: 15px;
  }

  &:hover {
    color: ${({ theme }) => theme.candle};
  }
`;

const Head = styled.header`
  display: flex;
  flex-direction: column;
  gap: 18px;
  max-width: 760px;
  margin-bottom: 64px;
`;

const Eyebrow = styled(motion.span)`
  display: inline-flex;
  align-items: center;
  gap: 10px;
  font-family: ${({ theme }) => theme.font.mono};
  font-size: 12px;
  font-weight: 500;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: ${({ theme }) => theme.candle_faint};

  &::before {
    content: "";
    width: 28px;
    height: 1px;
    background: ${({ theme }) => theme.candle_faint};
  }
`;

const Title = styled(motion.h1)`
  font-size: clamp(34px, 5.4vw, 58px);
  font-weight: 600;
  letter-spacing: -0.01em;
  color: ${({ theme }) => theme.candle};
`;

const Intro = styled(motion.p)`
  font-size: clamp(16px, 1.8vw, 19px);
  line-height: 1.7;
  color: ${({ theme }) => theme.candle_faint};
`;

const MetaRow = styled(motion.div)`
  display: flex;
  align-items: center;
  gap: 14px;
  flex-wrap: wrap;
  font-family: ${({ theme }) => theme.font.mono};
  font-size: 12px;
  color: ${({ theme }) => theme.candle_faint};

  span {
    display: inline-flex;
    align-items: center;
    gap: 14px;

    &:not(:last-child)::after {
      content: "·";
      margin-left: 14px;
      opacity: 0.5;
    }
  }
`;

const Steps = styled(motion.ol)`
  display: flex;
  flex-direction: column;
  margin: 0;
  padding: 0;
  list-style: none;
`;

const Step = styled(motion.li)`
  position: relative;
  display: grid;
  grid-template-columns: 84px minmax(0, 1fr);
  gap: 28px;
  padding: 40px 0;
  border-top: 1px solid rgba(232, 217, 181, 0.18);

  &:last-child {
    border-bottom: 1px solid rgba(232, 217, 181, 0.18);
  }

  @media (max-width: 760px) {
    grid-template-columns: minmax(0, 1fr);
    gap: 16px;
    padding: 28px 0;
  }
`;

const Marker = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 14px;

  span {
    font-family: ${({ theme }) => theme.font.mono};
    font-size: 12px;
    letter-spacing: 0.14em;
    color: ${({ theme }) => theme.candle_faint};
  }

  svg {
    width: 30px;
    height: 30px;
    color: ${({ theme }) => theme.candle};
    opacity: 0.9;
  }

  @media (max-width: 760px) {
    flex-direction: row;
    align-items: center;
    gap: 12px;
  }
`;

const StepBody = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;

  h2 {
    font-size: clamp(21px, 2.6vw, 28px);
    font-weight: 600;
    color: ${({ theme }) => theme.candle};
  }

  p {
    font-size: 16px;
    line-height: 1.72;
    color: ${({ theme }) => theme.candle_faint};
    max-width: 68ch;
  }
`;

const Value = styled.p`
  margin-top: 4px;
  padding: 12px 0 12px 18px;
  border-left: 2px solid rgba(232, 217, 181, 0.45);
  font-size: 16px;
  font-style: italic;
  line-height: 1.65;
  color: ${({ theme }) => theme.candle};
  max-width: 64ch;

  strong {
    display: block;
    margin-bottom: 4px;
    font-family: ${({ theme }) => theme.font.mono};
    font-size: 10.5px;
    font-style: normal;
    font-weight: 600;
    letter-spacing: 0.16em;
    text-transform: uppercase;
    color: ${({ theme }) => theme.candle_faint};
  }
`;

const Guardrails = styled.div`
  margin-top: 6px;

  h3 {
    margin-bottom: 10px;
    font-family: ${({ theme }) => theme.font.mono};
    font-size: 10.5px;
    font-weight: 600;
    letter-spacing: 0.16em;
    text-transform: uppercase;
    color: ${({ theme }) => theme.candle_faint};
  }

  ul {
    display: flex;
    flex-wrap: wrap;
    gap: 8px 22px;
    margin: 0;
    padding: 0;
    list-style: none;
  }

  li {
    position: relative;
    padding-left: 18px;
    font-size: 14px;
    line-height: 1.5;
    color: ${({ theme }) => theme.candle_faint};
  }

  li::before {
    content: "";
    position: absolute;
    left: 2px;
    top: 8px;
    width: 6px;
    height: 6px;
    border: 1px solid rgba(232, 217, 181, 0.7);
  }
`;

const Tags = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 6px;
`;

const Tag = styled(motion.span)`
  padding: 5px 11px;
  border-radius: ${({ theme }) => theme.radius.sm};
  border: 1px solid rgba(232, 217, 181, 0.26);
  font-family: ${({ theme }) => theme.font.mono};
  font-size: 11.5px;
  letter-spacing: 0.03em;
  color: ${({ theme }) => theme.candle_faint};
  transition: all 0.25s ${({ theme }) => theme.ease.out};

  &:hover {
    color: ${({ theme }) => theme.candle};
    border-color: rgba(232, 217, 181, 0.55);
    background: rgba(232, 217, 181, 0.07);
  }
`;

const LogBlock = styled(motion.figure)`
  margin: 56px 0 0;
  border: 1px solid rgba(232, 217, 181, 0.22);
  border-radius: ${({ theme }) => theme.radius.lg};
  background: rgba(12, 9, 5, 0.5);
  overflow: hidden;
`;

const LogHead = styled.figcaption`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 18px;
  flex-wrap: wrap;
  padding: 16px 22px;
  border-bottom: 1px solid rgba(232, 217, 181, 0.16);
  background: rgba(232, 217, 181, 0.04);

  strong {
    font-family: ${({ theme }) => theme.font.mono};
    font-size: 11.5px;
    font-weight: 600;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    color: ${({ theme }) => theme.candle};
  }
`;

const LogMeta = styled.div`
  display: flex;
  gap: 18px;
  flex-wrap: wrap;
  font-family: ${({ theme }) => theme.font.mono};
  font-size: 11px;
  color: ${({ theme }) => theme.candle_faint};

  span b {
    font-weight: 400;
    opacity: 0.62;
  }
`;

const LogScroll = styled.div`
  width: 100%;
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
`;

const LogRows = styled.div`
  min-width: 560px;
  padding: 8px 0;
`;

const STATUS_COLOR = {
  ok: "#A8B98A",
  fail: "#D48C74",
  warn: "#DBB265",
  wait: "#B3A179",
  guard: "#DBB265",
};

const Row = styled.div`
  display: grid;
  grid-template-columns: 76px 92px 1fr 74px;
  gap: 14px;
  align-items: baseline;
  padding: 7px 22px;
  font-family: ${({ theme }) => theme.font.mono};
  font-size: 12.5px;
  line-height: 1.5;
  transition: background 0.2s ${({ theme }) => theme.ease.out};

  &:hover {
    background: rgba(232, 217, 181, 0.05);
  }

  .t {
    color: rgba(179, 161, 121, 0.62);
  }
  .node {
    color: ${({ theme }) => theme.candle};
    letter-spacing: 0.06em;
    text-transform: uppercase;
    font-size: 11px;
  }
  .detail {
    color: ${({ theme }) => theme.candle_faint};
    overflow-wrap: anywhere;
  }
  .status {
    justify-self: end;
    font-size: 10.5px;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    color: ${({ $status }) => STATUS_COLOR[$status] || "#B3A179"};
  }
`;

const BlogPostHarness = () => (
  <Page id="main">
    <Inner>
      <Back to="/blog">
        <ArrowBackRounded /> All posts
      </Back>

      <Head>
        <Eyebrow
          variants={fadeInUp}
          initial="hidden"
          animate="visible"
        >
          {harness.dek}
        </Eyebrow>
        <Title variants={fadeInUp} initial="hidden" animate="visible">
          {harness.title}
        </Title>
        <MetaRow variants={fadeInUp} initial="hidden" animate="visible">
          <span>{harness.readTime}</span>
          <span>Updated {harness.updated}</span>
        </MetaRow>
        <Intro variants={fadeInUp} initial="hidden" animate="visible">
          {harness.intro}
        </Intro>
      </Head>

      <Steps
        variants={stagger(0.1)}
        initial="hidden"
        whileInView="visible"
        viewport={viewportOnce}
      >
        {harness.points.map((point, i) => {
          const Icon = getIcon(point.icon);
          return (
            <Step key={point.id} variants={fadeInUp}>
              <Marker>
                <span>{String(i + 1).padStart(2, "0")}</span>
                <Icon aria-hidden="true" />
              </Marker>
              <StepBody>
                <h2>{point.title}</h2>
                <p>{point.body}</p>

                {point.value && (
                  <Value>
                    <strong>Why it matters</strong>
                    {point.value}
                  </Value>
                )}

                {point.guardrails?.length > 0 && (
                  <Guardrails>
                    <h3>Guardrails</h3>
                    <ul>
                      {point.guardrails.map((g) => (
                        <li key={g}>{g}</li>
                      ))}
                    </ul>
                  </Guardrails>
                )}

                <Tags>
                  {point.tags.map((t) => (
                    <Tag key={t} variants={popIn}>
                      {t}
                    </Tag>
                  ))}
                </Tags>
              </StepBody>
            </Step>
          );
        })}
      </Steps>

      <LogBlock
        variants={fadeInUp}
        initial="hidden"
        whileInView="visible"
        viewport={viewportOnce}
      >
        <LogHead>
          <strong>{harness.log.caption}</strong>
          <LogMeta>
            {harness.log.meta.map(([k, v]) => (
              <span key={k}>
                <b>{k}</b> {v}
              </span>
            ))}
          </LogMeta>
        </LogHead>

        <LogScroll>
          <LogRows>
            {harness.log.rows.map((row, i) => (
              <Row key={`${row.t}-${i}`} $status={row.status}>
                <span className="t">{row.t}</span>
                <span className="node">{row.node}</span>
                <span className="detail">{row.detail}</span>
                <span className="status">{row.status}</span>
              </Row>
            ))}
          </LogRows>
        </LogScroll>
      </LogBlock>
    </Inner>
  </Page>
);

export default BlogPostHarness;
