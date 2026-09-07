/**
 * Motion vocabulary.
 *
 * Timings follow the motion reference tiers: hover 200-300ms, reveals 500-700ms,
 * exits faster than entrances. Everything here is transform/opacity only so the
 * compositor handles it — no width/height/top/left animation.
 */

export const EASE_OUT = [0.22, 1, 0.36, 1];
export const EASE_IN_OUT = [0.65, 0, 0.35, 1];

/** Standard scroll-reveal viewport config: fire once, slightly before fully in view. */
export const viewportOnce = { once: true, amount: 0.2, margin: "0px 0px -80px 0px" };

export const fadeInUp = {
  hidden: { opacity: 0, y: 28 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: EASE_OUT },
  },
};

export const fadeIn = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.6, ease: EASE_OUT } },
};

export const fadeInDown = {
  hidden: { opacity: 0, y: -28 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: EASE_OUT } },
};

export const scaleIn = {
  hidden: { opacity: 0, scale: 0.96 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.5, ease: EASE_OUT },
  },
};

export const slideInLeft = {
  hidden: { opacity: 0, x: -40 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.6, ease: EASE_OUT } },
};

export const slideInRight = {
  hidden: { opacity: 0, x: 40 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.6, ease: EASE_OUT } },
};

/** Parent for staggered lists/grids. Pass a custom delay via `stagger(0.08)`. */
export const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.07, delayChildren: 0.08 },
  },
};

export const stagger = (staggerChildren = 0.07, delayChildren = 0.08) => ({
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren, delayChildren } },
});

export const itemVariants = fadeInUp;

/** Small chips/tags: scale only, so long lists don't feel like they're marching. */
export const popIn = {
  hidden: { opacity: 0, scale: 0.85 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.35, ease: EASE_OUT } },
};

/** Per-character/word reveal for headline text. */
export const textReveal = {
  hidden: { opacity: 0, y: "0.5em" },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, ease: EASE_OUT, delay: i * 0.045 },
  }),
};

export const cardHover = {
  rest: { y: 0 },
  hover: { y: -6, transition: { duration: 0.3, ease: EASE_OUT } },
};

/** Spring used by the custom cursor and magnetic elements. */
export const cursorSpring = { type: "spring", stiffness: 400, damping: 32, mass: 0.6 };
