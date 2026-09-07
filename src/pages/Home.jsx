import React, { Suspense, lazy, useEffect } from "react";
import styled from "styled-components";
import { useLocation } from "react-router-dom";
import Hero from "../components/sections/Hero";

// Everything below the fold is split out — the hero and its background
// animation are the only things needed for first paint.
const Focus = lazy(() => import("../components/sections/Focus"));
const Skills = lazy(() => import("../components/sections/Skills"));
const Experience = lazy(() => import("../components/sections/Experience"));
const Projects = lazy(() => import("../components/sections/Projects"));
const Coding = lazy(() => import("../components/sections/Coding"));
const Education = lazy(() => import("../components/sections/Education"));
const Contact = lazy(() => import("../components/sections/Contact"));

// NOTE: GitHubDashboard is intentionally not mounted. It talks to the GitHub
// GraphQL API, which has no unauthenticated mode, and the token has expired.
// Re-enable once a token is served from a backend rather than the bundle.

const Fallback = styled.div`
  min-height: 60vh;
  display: grid;
  place-items: center;
  color: ${({ theme }) => theme.text_muted};
  font-family: ${({ theme }) => theme.font.mono};
  font-size: 12px;
  letter-spacing: 0.12em;
  text-transform: uppercase;
`;

/**
 * Scrolls to the section named by the URL hash after a cross-page navigation
 * (e.g. a "Blog" reader clicking "Experience" in the nav, which lands here
 * as "/#experience"). The target section is lazy-loaded, so it may not exist
 * in the DOM on the first paint — this polls briefly rather than assuming it
 * is already mounted.
 */
function useScrollToHash() {
  const { hash } = useLocation();

  useEffect(() => {
    if (!hash) return undefined;
    const id = hash.slice(1);
    let raf;
    let attempts = 0;

    const tryScroll = () => {
      const el = document.getElementById(id);
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "start" });
        return;
      }
      attempts += 1;
      if (attempts < 90) raf = requestAnimationFrame(tryScroll); // ~1.5s at 60fps
    };

    raf = requestAnimationFrame(tryScroll);
    return () => cancelAnimationFrame(raf);
  }, [hash]);
}

const Home = () => {
  useScrollToHash();

  return (
    <main id="main">
      <Hero />
      <Suspense fallback={<Fallback>Loading…</Fallback>}>
        <Focus />
        <Skills />
        <Experience />
        <Projects />
        <Coding />
        <Education />
        <Contact />
      </Suspense>
    </main>
  );
};

export default Home;
