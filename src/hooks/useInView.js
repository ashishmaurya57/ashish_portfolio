import { useEffect, useRef, useState } from "react";

/**
 * Reports whether the returned ref's element is on screen.
 *
 * Used to gate decorative animation: a page with seven animated bands is
 * seven repainting layers whether or not you can see them, and only one or
 * two are ever in view. Everything else stays parked.
 *
 * `rootMargin` defaults to a generous band above and below the viewport so an
 * animation is already running by the time it scrolls into sight, rather than
 * visibly kicking off mid-frame.
 */
export default function useInView({
  rootMargin = "200px 0px",
  threshold = 0,
  once = false,
} = {}) {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return undefined;

    // No IntersectionObserver (very old Safari): fail open, so the animation
    // runs everywhere rather than never.
    if (typeof IntersectionObserver === "undefined") {
      setInView(true);
      return undefined;
    }

    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          if (once) io.disconnect();
        } else if (!once) {
          setInView(false);
        }
      },
      { rootMargin, threshold }
    );

    io.observe(el);
    return () => io.disconnect();
  }, [rootMargin, threshold, once]);

  return [ref, inView];
}
