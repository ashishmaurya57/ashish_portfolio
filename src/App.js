import React, { Suspense, lazy } from "react";
import styled, { ThemeProvider } from "styled-components";
import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { darkTheme } from "./utils/Themes";

import Navbar from "./components/Navbar";
import ScrollProgress from "./components/ui/ScrollProgress";
import Home from "./pages/Home";

const ProjectsPage = lazy(() => import("./pages/ProjectsPage"));
const BlogPage = lazy(() => import("./pages/BlogPage"));
const BlogPostHarness = lazy(() => import("./pages/BlogPostHarness"));
const Footer = lazy(() => import("./components/sections/Footer"));

const Page = styled.div`
  position: relative;
  width: 100%;
  overflow-x: hidden;
  /* Deliberately transparent. index.css paints the parchment on <body> and
     then lays a fixed halftone grain and a warm vignette over it — an opaque
     background here is painted later in tree order and was covering both, so
     the page was rendering as flat cream instead of printed stock. */
  background: transparent;
  color: ${({ theme }) => theme.text_primary};
`;

/* Reserves height while a lazy route/chunk loads so the page does not jump (CLS). */
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

const SkipLink = styled.a`
  position: absolute;
  left: -9999px;
  top: 12px;
  z-index: 2000;
  padding: 12px 20px;
  border-radius: ${({ theme }) => theme.radius.md};
  background: ${({ theme }) => theme.primary};
  color: ${({ theme }) => theme.parchment};
  font-weight: 600;

  /* Only surfaces for keyboard users, which is exactly who needs it */
  &:focus {
    left: 16px;
  }
`;

/** Every route change should land at the top of the new page, not wherever
    the previous page happened to be scrolled to. A hash link (e.g. Home's
    "/#experience") is the one case that should NOT jump to top — Home's own
    scroll-to-hash effect handles that instead. */
function ScrollToTop() {
  const { pathname, hash } = useLocation();
  React.useEffect(() => {
    if (hash) return;
    // "auto" here means "jump immediately" per the spec — "instant" is not a
    // valid value for the Window.scrollTo options and silently no-ops.
    window.scrollTo({ top: 0, behavior: "auto" });
  }, [pathname, hash]);
  return null;
}

function App() {
  return (
    <ThemeProvider theme={darkTheme}>
      <BrowserRouter>
        <ScrollToTop />
        <SkipLink href="#main">Skip to content</SkipLink>
        <ScrollProgress />
        <Navbar />

        <Page>
          <Suspense fallback={<Fallback>Loading…</Fallback>}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/projects" element={<ProjectsPage />} />
              <Route path="/blog" element={<BlogPage />} />
              <Route path="/blog/engineering-the-agent-harness" element={<BlogPostHarness />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </Suspense>

          <Suspense fallback={null}>
            <Footer />
          </Suspense>
        </Page>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
