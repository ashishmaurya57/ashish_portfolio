import React from "react";
import styled from "styled-components";
import { motion } from "framer-motion";
import { fadeInUp, stagger } from "../../utils/motion";
import usePrefersReducedMotion from "../../hooks/usePrefersReducedMotion";

/*
 * Data-driven vertical flow diagram for the dark (night) article surface.
 *
 *   flow = {
 *     caption: string,
 *     steps: [{ label, note?, branch?, parallel?: [{ label, note? }] }],
 *     footer?: string,
 *   }
 *
 * Semantics: <figure> + <figcaption>, steps in an <ol> so the order is read
 * out. Arrows and the "↺" glyph are decorative and hidden from assistive tech.
 *
 * Colours are the page's own: candle / candle_faint text, night_soft cards,
 * and candle at low alpha for edges — the same rgba(232, 217, 181, x) the
 * article already uses for its rules, chips and log.
 */

const EDGE = "rgba(232, 217, 181, 0.22)";
const EDGE_STRONG = "rgba(232, 217, 181, 0.45)";

/* Left inset of the number badge's centre, shared by cards and the
   connector so every arrow drops straight out of the badge above it. */
const PAD_X = 14;
const BADGE = 22;
const AXIS = PAD_X + BADGE / 2;

const Figure = styled.figure`
  max-width: 620px;
  margin: 0;
`;

const Caption = styled.figcaption`
  margin-bottom: ${({ theme }) => theme.space.sm};
  font-family: ${({ theme }) => theme.font.mono};
  font-size: 11.5px;
  font-weight: 600;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: ${({ theme }) => theme.candle_faint};
`;

const List = styled(motion.ol)`
  margin: 0;
  padding: 0;
  list-style: none;
`;

const Step = styled(motion.li)`
  display: grid;
  grid-template-columns: minmax(0, 1fr);
  gap: 8px;

  /* Branch pill moves beside the card once there is room for both. */
  @media (min-width: 720px) {
    grid-template-columns: minmax(0, 320px) minmax(0, 1fr);
    column-gap: 16px;
    align-items: center;
  }
`;

const Connector = styled.span`
  grid-column: 1 / -1;
  position: relative;
  display: block;
  height: 20px;
  margin-left: ${AXIS}px;

  /* shaft */
  &::before {
    content: "";
    position: absolute;
    left: 0;
    top: 0;
    bottom: 5px;
    border-left: 1px solid ${EDGE_STRONG};
  }

  /* head */
  &::after {
    content: "";
    position: absolute;
    left: -4px;
    bottom: 0;
    border-left: 4.5px solid transparent;
    border-right: 4.5px solid transparent;
    border-top: 6px solid ${EDGE_STRONG};
  }
`;

const Card = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 12px;
  min-width: 0;
  padding: 11px ${PAD_X}px;
  border: 1px solid ${EDGE};
  border-radius: ${({ theme }) => theme.radius.md};
  background: ${({ theme }) => theme.night_soft};
`;

const Badge = styled.span`
  flex: none;
  display: inline-grid;
  place-items: center;
  width: ${BADGE}px;
  height: ${BADGE}px;
  margin-top: 1px;
  border: 1px solid ${EDGE_STRONG};
  border-radius: ${({ theme }) => theme.radius.pill};
  font-family: ${({ theme }) => theme.font.mono};
  font-size: 11px;
  line-height: 1;
  color: ${({ theme }) => theme.candle};
`;

const Text = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1px;
  min-width: 0;

  strong {
    font-size: 16px;
    font-weight: 600;
    line-height: 1.4;
    color: ${({ theme }) => theme.candle};
  }

  span {
    font-size: 14.5px;
    line-height: 1.45;
    color: ${({ theme }) => theme.candle_faint};
  }
`;

const Branch = styled.p`
  justify-self: start;
  max-width: 100%;
  margin-left: ${AXIS}px;
  padding: 6px 13px;
  border: 1px dashed ${EDGE_STRONG};
  border-radius: ${({ theme }) => theme.radius.xl};
  font-size: 14px;
  line-height: 1.45;
  color: ${({ theme }) => theme.candle_faint};

  @media (min-width: 720px) {
    margin-left: 0;
  }
`;

/* A parallel step spans the full figure width: one shared badge, then the
   items side by side (stacked on narrow phones). */
const Parallel = styled.div`
  grid-column: 1 / -1;
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 0 0 0 ${PAD_X}px;
`;

const ParallelBody = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  flex: 1;
  min-width: 0;

  > strong {
    margin-top: 1px;
    font-size: 16px;
    font-weight: 600;
    line-height: 1.4;
    color: ${({ theme }) => theme.candle};
  }
`;

const ParallelRow = styled.div`
  display: grid;
  grid-template-columns: repeat(${({ $count }) => $count}, minmax(0, 1fr));
  gap: 10px;

  @media (max-width: 479px) {
    grid-template-columns: minmax(0, 1fr);
  }
`;

const ParallelItem = styled(Card)`
  padding: 10px 12px;
`;

const Footer = styled.p`
  margin-top: ${({ theme }) => theme.space.sm};
  font-size: 14.5px;
  line-height: 1.5;
  color: ${({ theme }) => theme.candle_faint};
`;

const StepText = ({ label, note }) => (
  <Text>
    <strong>{label}</strong>
    {note && <span>{note}</span>}
  </Text>
);

const FlowDiagram = ({ flow, className }) => {
  const prefersReduced = usePrefersReducedMotion();
  if (!flow?.steps?.length) return null;

  // Under reduced motion nothing is hidden first, so the diagram never
  // depends on an animation having run to become visible.
  const listMotion = prefersReduced
    ? {}
    : {
        variants: stagger(0.08),
        initial: "hidden",
        whileInView: "visible",
        // "some", not a fraction: a tall diagram must still trigger.
        viewport: { once: true, amount: "some", margin: "0px 0px -60px 0px" },
      };
  const stepMotion = prefersReduced ? {} : { variants: fadeInUp };

  return (
    <Figure className={className}>
      {flow.caption && <Caption>{flow.caption}</Caption>}

      <List {...listMotion}>
        {flow.steps.map((step, i) => {
          const n = i + 1;
          return (
            <Step key={`${n}-${step.label}`} {...stepMotion}>
              {i > 0 && <Connector aria-hidden="true" />}

              {step.parallel?.length ? (
                <Parallel>
                  <Badge aria-hidden="true">{n}</Badge>
                  <ParallelBody>
                    <strong>{step.label}</strong>
                    <ParallelRow $count={step.parallel.length}>
                      {step.parallel.map((item) => (
                        <ParallelItem key={item.label}>
                          <StepText label={item.label} note={item.note} />
                        </ParallelItem>
                      ))}
                    </ParallelRow>
                  </ParallelBody>
                </Parallel>
              ) : (
                <Card>
                  <Badge aria-hidden="true">{n}</Badge>
                  <StepText label={step.label} note={step.note} />
                </Card>
              )}

              {step.branch && (
                <Branch>
                  <span aria-hidden="true">↺ </span>
                  {step.branch}
                </Branch>
              )}
            </Step>
          );
        })}
      </List>

      {flow.footer && <Footer>{flow.footer}</Footer>}
    </Figure>
  );
};

export default FlowDiagram;
