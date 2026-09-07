/**
 * Design tokens — warm parchment & ink.
 *
 * Palette taken from ashu.ai's own CSS custom properties, so the portfolio
 * reads in the same editorial register: aged paper ground, warm near-black
 * ink, bronze/sepia accents. No blues, no greens.
 *
 * Contrast notes (measured against --parchment #F2EBDD):
 *   ink        #241D13  ~15.1:1  body + headings
 *   ink_soft   #52452F   7.87:1  secondary body copy
 *   ink_muted  #6F6146   5.10:1  small labels — AA safe
 *   bronze     #6B512C   6.24:1  links, accents, accent text
 *   sepia      #8A6F4D   3.97:1  large text and UI edges only
 *   ink_faint  #8A7A5E   3.52:1  NON-TEXT only (rules, dividers, icons)
 */

const palette = {
  // Ground
  parchment: "#F2EBDD",
  parchment_card: "#F7F1E4",
  parchment_deep: "#EAE1CD",

  // Ink scale
  ink: "#241D13",
  ink_soft: "#52452F",
  ink_muted: "#6F6146",
  ink_faint: "#8A7A5E",

  // Accents
  bronze: "#6B512C",
  sepia: "#8A6F4D",
  candle: "#E8D9B5",
  candle_faint: "#B3A179",

  // Dark counterpart surfaces
  night: "#211A10",
  night_soft: "#2D2416",

  // Lines are ink at low alpha, which keeps them warm instead of grey
  line: "rgba(36, 29, 19, 0.16)",
  line_soft: "rgba(36, 29, 19, 0.09)",
  line_strong: "rgba(36, 29, 19, 0.28)",

  // Semantic — warm-compatible, never the stock green/red
  success: "#4F6B3F",
  danger: "#8F3B2A",

  white: "#FFFFFF",
  black: "#000000",
};

export const darkTheme = {
  ...palette,

  // Semantic aliases used throughout the components
  bg: palette.parchment,
  bg_soft: palette.parchment_deep,
  surface: palette.parchment_card,
  card: palette.parchment_card,
  card_hover: palette.parchment_deep,
  elevated: palette.white,

  border: palette.line,
  border_soft: palette.line_soft,
  border_strong: palette.line_strong,
  border_accent: "rgba(107, 81, 44, 0.42)",

  text_primary: palette.ink,
  text_secondary: palette.ink_soft,
  text_muted: palette.ink_muted,

  primary: palette.bronze,
  primary_soft: palette.sepia,
  primary_dim: "rgba(107, 81, 44, 0.10)",
  accent: palette.candle,

  // Back-compat aliases so nothing resolves to undefined mid-refactor
  bgLight: palette.parchment_deep,
  card_light: palette.parchment_deep,
  button: palette.bronze,
  emerald: palette.success,
  rose: palette.danger,
  amber: palette.bronze,
  cyan: palette.sepia,

  gradient: {
    accent: `linear-gradient(135deg, ${palette.bronze} 0%, ${palette.sepia} 100%)`,
    accent_soft: `linear-gradient(135deg, rgba(107,81,44,0.09) 0%, rgba(232,217,181,0.35) 100%)`,
    surface: `linear-gradient(165deg, ${palette.parchment_card} 0%, ${palette.parchment} 100%)`,
    night: `linear-gradient(165deg, ${palette.night_soft} 0%, ${palette.night} 100%)`,
    text: `linear-gradient(135deg, ${palette.ink} 25%, ${palette.bronze} 100%)`,
  },

  // Shadows are warm and low — paper does not cast a blue glow
  shadow: {
    sm: "0 1px 2px rgba(36, 29, 19, 0.07)",
    md: "0 10px 26px -14px rgba(36, 29, 19, 0.35)",
    lg: "0 26px 60px -28px rgba(36, 29, 19, 0.45)",
    accent: "0 14px 34px -16px rgba(107, 81, 44, 0.55)",
  },

  radius: {
    sm: "4px",
    md: "8px",
    lg: "12px",
    xl: "18px",
    pill: "999px",
  },

  space: {
    xs: "8px",
    sm: "12px",
    md: "20px",
    lg: "32px",
    xl: "56px",
    // Applied to BOTH top and bottom of every section, so two consecutive
    // sections stack it (top of B adds to bottom of A) — this is the actual
    // gap you see at a section boundary, not just one side of it. Sized for
    // a ~90-160px total boundary, not the ~150-270px the old clamp produced.
    section: "clamp(44px, 5.5vw, 84px)",
  },

  font: {
    display: "'Cormorant Garamond', 'EB Garamond', Georgia, serif",
    body: "'EB Garamond', Georgia, serif",
    mono: "'IBM Plex Mono', ui-monospace, monospace",
  },

  ease: {
    out: "cubic-bezier(0.22, 1, 0.36, 1)",
    inOut: "cubic-bezier(0.65, 0, 0.35, 1)",
  },

  maxWidth: "1140px",
};

export const lightTheme = darkTheme; // single-mode product; kept for import safety
