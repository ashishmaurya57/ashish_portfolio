import React, { Suspense, lazy } from "react";
import styled from "styled-components";
import { motion } from "framer-motion";
import Typewriter from "typewriter-effect";
import { ArrowOutward, ArrowDownward, MailOutline, PlaceOutlined } from "@mui/icons-material";
import { Bio, metrics } from "../../data/constants";
import Magnetic from "../ui/Magnetic";
import TiltCard from "../ui/TiltCard";
import { StatusBadge, PrimaryButton, GhostButton, GradientText } from "../ui/Primitives";
import CountUp from "../ui/CountUp";
import { textReveal, fadeInUp, EASE_OUT } from "../../utils/motion";
import usePrefersReducedMotion from "../../hooks/usePrefersReducedMotion";

// Split out so the headline and CTAs paint without waiting on the graph.
// It is decorative — the page reads fine before it arrives.
const AgentFlow = lazy(() => import("../canvas/AgentFlow"));

const Section = styled.section`
  position: relative;
  z-index: 1;
  width: 100%;
  min-height: 100svh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 128px 24px 72px;
  overflow: hidden;
  scroll-margin-top: 96px;

  @media (max-width: 640px) {
    padding: 112px 18px 56px;
  }
`;

/* Soft accent bloom behind the headline; gives the dark page a light source
   without washing out any text. */
const Bloom = styled.div`
  position: absolute;
  top: -14%;
  left: 50%;
  transform: translateX(-50%);
  width: min(1100px, 130%);
  height: 620px;
  pointer-events: none;
  z-index: 0;
  background: radial-gradient(
      ellipse at 30% 40%,
      rgba(107, 81, 44, 0.11),
      transparent 62%
    ),
    radial-gradient(ellipse at 72% 30%, rgba(232, 217, 181, 0.6), transparent 62%);
  filter: blur(20px);
`;

const Inner = styled.div`
  position: relative;
  z-index: 2;
  width: 100%;
  max-width: 1180px;
  display: grid;
  grid-template-columns: 1.15fr 0.85fr;
  align-items: center;
  gap: 64px;

  @media (max-width: 980px) {
    grid-template-columns: 1fr;
    gap: 48px;
  }
`;

const Left = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 24px;

  @media (max-width: 980px) {
    order: 2;
    align-items: center;
    text-align: center;
  }
`;

const Title = styled.h1`
  /* Clamp keeps this one line on desktop and readable at 360px without a
     separate mobile font-size. */
  font-size: clamp(42px, 7vw, 76px);
  font-weight: 700;
  letter-spacing: -0.035em;
  line-height: 1.02;
  color: ${({ theme }) => theme.text_primary};
`;

const Line = styled.span`
  display: block;
  overflow: hidden;
`;

const RoleRow = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
  font-family: ${({ theme }) => theme.font.mono};
  font-size: clamp(16px, 2.3vw, 22px);
  font-weight: 500;
  color: ${({ theme }) => theme.text_secondary};

  .tw {
    color: ${({ theme }) => theme.primary};
  }

  @media (max-width: 980px) {
    justify-content: center;
  }
`;

const Prompt = styled.span`
  color: ${({ theme }) => theme.emerald};
`;

const Desc = styled.p`
  max-width: 560px;
  font-size: clamp(15px, 1.7vw, 17.5px);
  line-height: 1.75;
  color: ${({ theme }) => theme.text_secondary};
`;

const Meta = styled.div`
  display: flex;
  align-items: center;
  gap: 20px;
  flex-wrap: wrap;
  font-family: ${({ theme }) => theme.font.mono};
  font-size: 13px;
  color: ${({ theme }) => theme.text_muted};

  span {
    display: inline-flex;
    align-items: center;
    gap: 7px;
  }
  svg {
    font-size: 16px;
    color: ${({ theme }) => theme.primary};
  }

  @media (max-width: 980px) {
    justify-content: center;
  }
`;

const Ctas = styled.div`
  display: flex;
  gap: 14px;
  flex-wrap: wrap;
  margin-top: 4px;

  @media (max-width: 980px) {
    justify-content: center;
  }
  @media (max-width: 420px) {
    width: 100%;
    a {
      flex: 1;
    }
  }
`;

const Right = styled.div`
  display: flex;
  justify-content: center;

  @media (max-width: 980px) {
    order: 1;
  }
`;

/*
 * No card, no border, no drop shadow — the photo sits directly on the paper.
 * "Merged into the background" is done with a soft radial mask that feathers
 * the image's own edges to transparent, so it fades into the parchment ground
 * instead of ending at a hard rectangle.
 */
const PortraitFrame = styled.div`
  position: relative;
  width: min(480px, 88vw);
  aspect-ratio: 1 / 1;
  transform-style: preserve-3d;

  @media (max-width: 640px) {
    width: min(360px, 82vw);
  }
`;

const Portrait = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
  mask-image: radial-gradient(ellipse 74% 74% at 50% 46%, #000 58%, transparent 100%);
  -webkit-mask-image: radial-gradient(ellipse 74% 74% at 50% 46%, #000 58%, transparent 100%);
`;

/* Floating chip that reads as depth against the tilting portrait. Sits well
   inside the feathered edge, not anchored to a card corner that no longer
   exists. */
const FloatCard = styled(motion.div)`
  position: absolute;
  bottom: 6%;
  left: 2%;
  display: flex;
  flex-direction: column;
  gap: 3px;
  padding: 13px 17px;
  border-radius: 14px;
  background: rgba(247, 241, 228, 0.96);
  border: 1px solid ${({ theme }) => theme.border_strong};
  box-shadow: ${({ theme }) => theme.shadow.lg};
  backdrop-filter: blur(10px);
  transform: translateZ(50px);

  strong {
    font-family: ${({ theme }) => theme.font.display};
    font-size: 13.5px;
    color: ${({ theme }) => theme.text_primary};
  }
  small {
    font-family: ${({ theme }) => theme.font.mono};
    font-size: 10.5px;
    letter-spacing: 0.05em;
    text-transform: uppercase;
    color: ${({ theme }) => theme.text_muted};
  }

  @media (max-width: 520px) {
    left: 0;
    bottom: 4%;
    padding: 11px 14px;
  }
`;

const StatsStrip = styled(motion.dl)`
  position: relative;
  z-index: 2;
  grid-column: 1 / -1;
  margin-top: 24px;
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1px;
  background: ${({ theme }) => theme.border};
  border: 1px solid ${({ theme }) => theme.border};
  border-radius: ${({ theme }) => theme.radius.lg};
  overflow: hidden;

  @media (max-width: 780px) {
    grid-template-columns: repeat(2, 1fr);
  }
`;

const Stat = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding: 22px 24px;
  background: ${({ theme }) => theme.surface};
  transition: background 0.3s ${({ theme }) => theme.ease.out};

  &:hover {
    background: ${({ theme }) => theme.card_hover};
  }

  dd {
    font-family: ${({ theme }) => theme.font.display};
    font-size: clamp(26px, 3.4vw, 34px);
    font-weight: 700;
    letter-spacing: -0.03em;
    color: ${({ theme }) => theme.text_primary};
    margin: 0;

    i {
      font-style: normal;
      color: ${({ theme }) => theme.emerald};
    }
  }
  dt {
    font-size: 13.5px;
    font-weight: 500;
    color: ${({ theme }) => theme.text_secondary};
  }
  p {
    font-family: ${({ theme }) => theme.font.mono};
    font-size: 11px;
    color: ${({ theme }) => theme.text_muted};
  }

  @media (max-width: 640px) {
    padding: 18px 16px;
  }
`;

const ScrollHint = styled(motion.a)`
  position: absolute;
  bottom: 26px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 2;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  font-family: ${({ theme }) => theme.font.mono};
  font-size: 11px;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: ${({ theme }) => theme.text_muted};

  &:hover {
    color: ${({ theme }) => theme.primary};
  }

  @media (max-width: 980px) {
    display: none;
  }
`;

const PORTRAIT_PRIMARY =
  "https://lh3.googleusercontent.com/d/160jm_gqePkhj7eOe0lMsN1iMhbSueQot";
const PORTRAIT_FALLBACK =
  "https://drive.google.com/uc?export=download&id=160jm_gqePkhj7eOe0lMsN1iMhbSueQot";

const Hero = () => {
  const prefersReduced = usePrefersReducedMotion();
  const nameWords = Bio.name.split(" ");

  return (
    <Section id="about">
      <Bloom aria-hidden="true" />
      <Suspense fallback={null}>
        <AgentFlow />
      </Suspense>

      <Inner>
        <Left>
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: EASE_OUT }}
          >
            <StatusBadge>{Bio.availability}</StatusBadge>
          </motion.div>

          <Title>
            <Line>
              <motion.span
                style={{ display: "inline-block" }}
                variants={textReveal}
                custom={0}
                initial="hidden"
                animate="visible"
              >
                {nameWords[0]}
              </motion.span>
            </Line>
            <Line>
              <motion.span
                style={{ display: "inline-block" }}
                variants={textReveal}
                custom={1}
                initial="hidden"
                animate="visible"
              >
                <GradientText>{nameWords.slice(1).join(" ")}</GradientText>
              </motion.span>
            </Line>
          </Title>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.35, duration: 0.5 }}
            style={{ width: "100%" }}
          >
            <RoleRow>
              <Prompt>&gt;</Prompt>
              <span className="tw">
                {prefersReduced ? (
                  Bio.roles[0]
                ) : (
                  <Typewriter
                    options={{
                      strings: Bio.roles,
                      autoStart: true,
                      loop: true,
                      delay: 55,
                      deleteSpeed: 28,
                    }}
                  />
                )}
              </span>
            </RoleRow>
          </motion.div>

          <motion.div
            variants={fadeInUp}
            initial="hidden"
            animate="visible"
            transition={{ delay: 0.45 }}
          >
            <Desc>{Bio.description}</Desc>
          </motion.div>

          <motion.div
            variants={fadeInUp}
            initial="hidden"
            animate="visible"
            transition={{ delay: 0.55 }}
          >
            <Meta>
              <span>
                <PlaceOutlined /> {Bio.location}
              </span>
              <span>
                <MailOutline /> {Bio.email}
              </span>
            </Meta>
          </motion.div>

          <motion.div
            variants={fadeInUp}
            initial="hidden"
            animate="visible"
            transition={{ delay: 0.62 }}
            style={{ width: "100%" }}
          >
            <Ctas>
              <Magnetic strength={0.22}>
                <PrimaryButton href={Bio.resume} target="_blank" rel="noreferrer">
                  View Resume <ArrowOutward />
                </PrimaryButton>
              </Magnetic>
              <Magnetic strength={0.22}>
                <GhostButton href="#projects">See Projects</GhostButton>
              </Magnetic>
            </Ctas>
          </motion.div>
        </Left>

        <Right>
          <motion.div
            initial={{ opacity: 0, scale: 0.94 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, ease: EASE_OUT, delay: 0.2 }}
          >
            <TiltCard max={10} glare>
              <PortraitFrame>
                <Portrait
                  src={PORTRAIT_PRIMARY}
                  alt={`${Bio.name}, ${Bio.title}`}
                  loading="eager"
                  referrerPolicy="no-referrer"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = PORTRAIT_FALLBACK;
                  }}
                />
                <FloatCard
                  animate={prefersReduced ? undefined : { y: [0, -8, 0] }}
                  transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                >
                  <small>Currently building</small>
                  <strong>Vertical-agent provisioning</strong>
                </FloatCard>
              </PortraitFrame>
            </TiltCard>
          </motion.div>
        </Right>

        <StatsStrip
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: EASE_OUT, delay: 0.75 }}
        >
          {metrics.map((m, i) => (
            <Stat key={m.label}>
              <dd>
                {/* Staggered off the strip's own 0.75s entrance, so the numbers
                    start climbing just after it has landed rather than during. */}
                <CountUp value={m.value} delay={0.85 + i * 0.09} />
                <i>{m.suffix}</i>
              </dd>
              <dt>{m.label}</dt>
              <p>{m.detail}</p>
            </Stat>
          ))}
        </StatsStrip>
      </Inner>

      <ScrollHint
        href="#focus"
        animate={prefersReduced ? undefined : { y: [0, 6, 0] }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
      >
        Scroll <ArrowDownward style={{ fontSize: 14 }} />
      </ScrollHint>
    </Section>
  );
};

export default Hero;
