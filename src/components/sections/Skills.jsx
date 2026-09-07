import React, { useRef } from "react";
import styled from "styled-components";
import { motion, useScroll, useTransform } from "framer-motion";
import { getIcon } from "../ui/icons";
import { skills } from "../../data/constants";
import { SectionShell, SectionInner } from "../ui/Section";
import SectionHeading from "../ui/SectionHeading";
import { Chip } from "../ui/Primitives";
import TiltCard from "../ui/TiltCard";
import { stagger, fadeInUp, popIn, viewportOnce } from "../../utils/motion";
import usePrefersReducedMotion from "../../hooks/usePrefersReducedMotion";
import useIsPointerFine from "../../hooks/useIsPointerFine";

/* Longest group sets the full-width mark on every meter, so the bars read as a
   comparison across the section rather than eight unrelated progress bars. */
const MAX_GROUP = Math.max(...skills.map((g) => g.skills.length));

const Grid = styled(motion.div)`
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  /* Cards size to their own content. Stretching a four-chip card to match a
     ten-chip one is what left all that dead space in the short cards. */
  align-items: start;
  gap: 20px;

  @media (max-width: 1080px) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  @media (max-width: 700px) {
    grid-template-columns: 1fr;
  }
`;

const Card = styled.div`
  position: relative;
  isolation: isolate;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 24px 24px 26px;
  border-radius: ${({ theme }) => theme.radius.lg};
  background: ${({ theme }) => theme.gradient.surface};
  border: 1px solid ${({ theme }) => theme.border};
  box-shadow: ${({ theme }) => theme.shadow.sm};
  transition: border-color 0.35s ${({ theme }) => theme.ease.out},
    box-shadow 0.35s ${({ theme }) => theme.ease.out};

  /* Warm spotlight that follows the pointer across the card. --mx/--my are
     written by the pointer handler below; the 200% fallback parks it off-card
     so nothing glows before the first move event (or on touch, ever). */
  &::before {
    content: "";
    position: absolute;
    inset: 0;
    z-index: 0;
    opacity: 0;
    background: radial-gradient(
      240px circle at var(--mx, 200%) var(--my, 200%),
      rgba(107, 81, 44, 0.14),
      transparent 68%
    );
    transition: opacity 0.4s ${({ theme }) => theme.ease.out};
  }

  /* Accent rule that draws itself across the top edge on hover. */
  &::after {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    z-index: 2;
    height: 2px;
    width: 100%;
    transform: scaleX(0);
    transform-origin: left;
    background: linear-gradient(
      90deg,
      ${({ theme }) => theme.bronze},
      ${({ theme }) => theme.sepia} 60%,
      transparent
    );
    transition: transform 0.55s ${({ theme }) => theme.ease.out};
  }

  &:hover {
    border-color: ${({ theme }) => theme.border_accent};
    box-shadow: ${({ theme }) => theme.shadow.md};
  }

  &:hover::before {
    opacity: 1;
  }

  &:hover::after {
    transform: scaleX(1);
  }

  /* Content sits above the spotlight layer */
  > * {
    position: relative;
    z-index: 1;
  }

  @media (max-width: 640px) {
    padding: 22px 20px;
  }

  @media (prefers-reduced-motion: reduce) {
    &::after {
      transition: none;
    }
  }
`;

const Head = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 13px;
`;

const IconTile = styled.span`
  flex: 0 0 auto;
  display: grid;
  place-items: center;
  width: 38px;
  height: 38px;
  border-radius: ${({ theme }) => theme.radius.md};
  border: 1px solid ${({ theme }) => theme.border};
  background: rgba(107, 81, 44, 0.06);
  color: ${({ theme }) => theme.bronze};
  transition: transform 0.5s ${({ theme }) => theme.ease.out},
    background 0.35s ${({ theme }) => theme.ease.out},
    border-color 0.35s ${({ theme }) => theme.ease.out};

  svg {
    width: 18px;
    height: 18px;
  }

  ${Card}:hover & {
    transform: translateY(-2px) rotate(-8deg);
    background: ${({ theme }) => theme.candle};
    border-color: ${({ theme }) => theme.border_accent};
  }

  @media (prefers-reduced-motion: reduce) {
    ${Card}:hover & {
      transform: none;
    }
  }
`;

const Titles = styled.div`
  flex: 1 1 auto;
  min-width: 0;

  h3 {
    font-size: 16.5px;
    font-weight: 600;
    line-height: 1.25;
    color: ${({ theme }) => theme.text_primary};
  }

  p {
    margin-top: 4px;
    font-family: ${({ theme }) => theme.font.mono};
    font-size: 10.5px;
    letter-spacing: 0.09em;
    text-transform: uppercase;
    color: ${({ theme }) => theme.text_muted};
  }
`;

const Index = styled.span`
  flex: 0 0 auto;
  padding-top: 2px;
  font-family: ${({ theme }) => theme.font.mono};
  font-size: 11.5px;
  color: ${({ theme }) => theme.primary};
`;

const MeterRow = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

const Meter = styled.div`
  position: relative;
  flex: 1 1 auto;
  height: 2px;
  border-radius: 999px;
  background: ${({ theme }) => theme.border_soft};
  overflow: hidden;
`;

const MeterFill = styled(motion.span)`
  position: absolute;
  inset: 0 auto 0 0;
  border-radius: inherit;
  background: linear-gradient(
    90deg,
    ${({ theme }) => theme.bronze},
    ${({ theme }) => theme.sepia}
  );
`;

const Count = styled.span`
  flex: 0 0 auto;
  font-family: ${({ theme }) => theme.font.mono};
  font-size: 11px;
  color: ${({ theme }) => theme.text_muted};
`;

/* Deliberately NOT a motion component. Making this a variant node of its own
   put a second orchestration layer between the card and the chips, and the
   chips stopped resolving to "visible" — they rendered at opacity 0, taking up
   layout space in an otherwise empty card. The chips inherit the card's
   variant state directly instead. */
const List = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
`;

/*
 * Each card drifts vertically against the page as you scroll past the grid —
 * alternating direction by index so neighbouring cards visibly separate and
 * re-converge rather than the whole grid moving as one flat block. Distance is
 * tracked per-card via its own useScroll target, not the grid's, so the effect
 * stays correct regardless of how many columns actually render at this width.
 */
const ParallaxItem = ({ index, children }) => {
  const ref = useRef(null);
  const prefersReduced = usePrefersReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });

  const distance = 26 + (index % 3) * 8; // slight variety so rows don't lock-step
  const direction = index % 2 === 0 ? 1 : -1;
  const y = useTransform(scrollYProgress, [0, 1], [distance * direction, -distance * direction]);

  return (
    <motion.div ref={ref} style={{ y: prefersReduced ? 0 : y }}>
      {children}
    </motion.div>
  );
};

const SkillCard = ({ group, index }) => {
  const cardRef = useRef(null);
  const isPointerFine = useIsPointerFine();
  const Icon = getIcon(group.icon);
  const count = group.skills.length;

  // Spotlight position, written straight to CSS custom properties. Going
  // through React state here would re-render the whole card on every mouse
  // move; the browser already coalesces pointermove to the frame rate.
  const handleMove = (e) => {
    if (!isPointerFine || !cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    cardRef.current.style.setProperty("--mx", `${e.clientX - rect.left}px`);
    cardRef.current.style.setProperty("--my", `${e.clientY - rect.top}px`);
  };

  return (
    <Card ref={cardRef} onMouseMove={handleMove}>
      <Head>
        <IconTile>
          <Icon aria-hidden="true" />
        </IconTile>
        <Titles>
          <h3>{group.title}</h3>
          <p>{group.note}</p>
        </Titles>
        <Index>{String(index + 1).padStart(2, "0")}</Index>
      </Head>

      <MeterRow>
        <Meter>
          <MeterFill
            initial={{ width: 0 }}
            whileInView={{ width: `${(count / MAX_GROUP) * 100}%` }}
            viewport={viewportOnce}
            transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
          />
        </Meter>
        <Count>{String(count).padStart(2, "0")}</Count>
      </MeterRow>

      <List>
        {group.skills.map((item) => {
          const ChipIcon = getIcon(item.icon);
          return (
            <Chip
              key={`${group.title}-${item.name}`}
              variants={popIn}
              whileHover={{ y: -3 }}
              transition={{ duration: 0.2 }}
            >
              <ChipIcon aria-hidden="true" />
              {item.name}
            </Chip>
          );
        })}
      </List>
    </Card>
  );
};

const Skills = () => (
  <SectionShell id="skills" $pattern="hatch">
    <SectionInner>
      <SectionHeading
        eyebrow="Toolkit"
        title="Technologies I work"
        highlight="with"
        description="Grouped by what they are for rather than by how well I know them — the AI and backend rows are where I spend most of my time."
      />

      <Grid
        variants={stagger(0.08)}
        initial="hidden"
        whileInView="visible"
        viewport={viewportOnce}
      >
        {skills.map((group, i) => (
          <ParallaxItem key={group.title} index={i}>
            <motion.div variants={fadeInUp}>
              <TiltCard max={5} glare={false}>
                <SkillCard group={group} index={i} />
              </TiltCard>
            </motion.div>
          </ParallaxItem>
        ))}
      </Grid>
    </SectionInner>
  </SectionShell>
);

export default Skills;
