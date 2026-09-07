import styled, { css, keyframes } from "styled-components";
import { motion } from "framer-motion";

/* Shared atoms. Everything reads from the theme so a token change propagates
   instead of needing a hex hunt across components. */

/** Mono kicker above a heading. */
export const Eyebrow = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 10px;
  font-family: ${({ theme }) => theme.font.mono};
  font-size: 12px;
  font-weight: 500;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: ${({ theme }) => theme.bronze};

  &::before {
    content: "";
    width: 28px;
    height: 1px;
    background: ${({ theme }) => theme.sepia};
  }
`;

/** Accent word inside a heading. Italic serif rather than a gradient fill —
    gradient text on warm paper reads as a printing fault. */
export const GradientText = styled.span`
  font-style: italic;
  color: ${({ theme }) => theme.bronze};
`;

/** Paper card surface used across every section. */
export const Surface = styled.div`
  background: ${({ theme }) => theme.gradient.surface};
  border: 1px solid ${({ theme }) => theme.border};
  border-radius: ${({ theme }) => theme.radius.lg};
  box-shadow: ${({ theme }) => theme.shadow.sm};
  transition: border-color 0.3s ${({ theme }) => theme.ease.out},
    box-shadow 0.3s ${({ theme }) => theme.ease.out};

  &:hover {
    border-color: ${({ theme }) => theme.border_accent};
    box-shadow: ${({ theme }) => theme.shadow.md};
  }
`;

/** Technology / skill pill. */
export const Chip = styled(motion.span)`
  display: inline-flex;
  align-items: center;
  gap: 7px;
  padding: 6px 12px;
  border-radius: ${({ theme }) => theme.radius.sm};
  border: 1px solid ${({ theme }) => theme.border};
  background: rgba(36, 29, 19, 0.03);
  color: ${({ theme }) => theme.text_secondary};
  font-family: ${({ theme }) => theme.font.mono};
  font-size: 12px;
  font-weight: 500;
  line-height: 1.3;
  white-space: nowrap;
  transition: all 0.25s ${({ theme }) => theme.ease.out};

  svg {
    width: 14px;
    height: 14px;
    color: ${({ theme }) => theme.sepia};
  }

  &:hover {
    color: ${({ theme }) => theme.ink};
    border-color: ${({ theme }) => theme.border_accent};
    background: ${({ theme }) => theme.candle};
  }
`;

const buttonBase = css`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  /* 48px tall: comfortably above the 44px minimum touch target */
  min-height: 48px;
  padding: 0 26px;
  border-radius: ${({ theme }) => theme.radius.pill};
  font-family: ${({ theme }) => theme.font.mono};
  font-size: 13px;
  font-weight: 500;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  cursor: pointer;
  border: 1px solid transparent;
  transition: transform 0.25s ${({ theme }) => theme.ease.out},
    box-shadow 0.25s ${({ theme }) => theme.ease.out},
    background 0.25s ${({ theme }) => theme.ease.out},
    color 0.25s ${({ theme }) => theme.ease.out},
    border-color 0.25s ${({ theme }) => theme.ease.out};

  svg {
    width: 17px;
    height: 17px;
  }

  &:active {
    transform: scale(0.97);
  }
`;

export const PrimaryButton = styled.a`
  ${buttonBase};
  background: ${({ theme }) => theme.ink};
  color: ${({ theme }) => theme.parchment};
  box-shadow: ${({ theme }) => theme.shadow.md};

  &:hover {
    background: ${({ theme }) => theme.bronze};
    box-shadow: ${({ theme }) => theme.shadow.accent};
  }
`;

export const GhostButton = styled.a`
  ${buttonBase};
  background: transparent;
  border-color: ${({ theme }) => theme.border_strong};
  color: ${({ theme }) => theme.text_primary};

  &:hover {
    border-color: ${({ theme }) => theme.bronze};
    background: ${({ theme }) => theme.candle};
    color: ${({ theme }) => theme.ink};
  }
`;

const pulse = keyframes`
  0%   { box-shadow: 0 0 0 0 rgba(79, 107, 63, 0.45); }
  70%  { box-shadow: 0 0 0 7px rgba(79, 107, 63, 0); }
  100% { box-shadow: 0 0 0 0 rgba(79, 107, 63, 0); }
`;

/** "Open to roles" availability badge. */
export const StatusBadge = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 9px;
  padding: 6px 15px 6px 12px;
  border-radius: ${({ theme }) => theme.radius.pill};
  border: 1px solid rgba(79, 107, 63, 0.32);
  background: rgba(79, 107, 63, 0.08);
  color: ${({ theme }) => theme.success};
  font-family: ${({ theme }) => theme.font.mono};
  font-size: 11.5px;
  font-weight: 500;
  letter-spacing: 0.06em;

  &::before {
    content: "";
    width: 7px;
    height: 7px;
    border-radius: 999px;
    background: ${({ theme }) => theme.success};
    animation: ${pulse} 2.4s ease-out infinite;
  }

  @media (prefers-reduced-motion: reduce) {
    &::before {
      animation: none;
    }
  }
`;
