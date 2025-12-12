import styled, { ThemeProvider } from "styled-components";
import { darkTheme } from "./utils/Themes";
import Navbar from "./components/Navbar";
import { BrowserRouter } from "react-router-dom";
import Hero from "./components/sections/Hero";
import { useEffect, Suspense, lazy } from "react";

// Lazy load components below the fold to reduce initial bundle size
const Skills = lazy(() => import("./components/sections/Skills"));
const GitHubDashboard = lazy(() => import("./components/sections/GitHubDashboard"));
const Experience = lazy(() => import("./components/sections/Experience"));
const Education = lazy(() => import("./components/sections/Education"));
const Projects = lazy(() => import("./components/sections/Projects"));
const Footer = lazy(() => import("./components/sections/Footer"));
const Coding = lazy(() => import("./components/sections/Coding"));

const Body = styled.div`
  background: linear-gradient(to right, #006663, #111111);
  
  width: 100%;
  overflow-x: hidden;
  position: relative;
`;

const Wrapper = styled.div`
  padding-bottom: 100px;
  background: linear-gradient(
      38.73deg,
      rgba(204, 0, 187, 0.15) 0%,
      rgba(201, 32, 184, 0) 50%
    ),
    linear-gradient(
      141.27deg,
      rgba(0, 70, 209, 0) 50%,
      rgba(0, 70, 209, 0.15) 100%
    );
  width: 100%;
  clip-path: polygon(0 0, 100% 0, 100% 100%, 30% 98%, 0 100%);
`;

// Loading fallback component
const LoadingFallback = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 200px;
  color: ${({ theme }) => theme.text_primary};
  font-size: 18px;
  opacity: 0.7;
`;

function App() {
  useEffect(() => {
    // Smooth scrolling for anchor links
    const handleSmoothScroll = (e) => {
      const href = e.target.getAttribute('href');
      if (href && href.startsWith('#')) {
        e.preventDefault();
        const element = document.querySelector(href);
        if (element) {
          element.scrollIntoView({
            behavior: 'smooth',
            block: 'start',
          });
        }
      }
    };

    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', handleSmoothScroll);
    });

    return () => {
      document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.removeEventListener('click', handleSmoothScroll);
      });
    };
  }, []);

  return (
    <ThemeProvider theme={darkTheme}>
      <BrowserRouter>
        <Navbar />
        <Body>
          <div>
            <Hero />
            <Suspense fallback={<LoadingFallback>Loading...</LoadingFallback>}>
              <Wrapper>
                <Skills />
                <GitHubDashboard />
                <Experience />
              </Wrapper>
              <Projects />
              <Wrapper>
                <Coding />
                <Education />
              </Wrapper>
              <Footer />
            </Suspense>
          </div>
        </Body>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;