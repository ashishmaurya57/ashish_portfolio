import { useEffect, useState } from "react";

const QUERY = "(hover: hover) and (pointer: fine)";

/**
 * True only for real pointing devices (mouse/trackpad). Touch and stylus users
 * must never get the custom cursor or hover-only affordances — on those devices
 * the effects are invisible at best and block taps at worst.
 */
export default function useIsPointerFine() {
  const [isFine, setIsFine] = useState(
    () => typeof window !== "undefined" && window.matchMedia(QUERY).matches
  );

  useEffect(() => {
    const mql = window.matchMedia(QUERY);
    const onChange = (e) => setIsFine(e.matches);
    mql.addEventListener("change", onChange);
    return () => mql.removeEventListener("change", onChange);
  }, []);

  return isFine;
}
