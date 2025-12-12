import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { motion, AnimatePresence } from "framer-motion";
import { projects } from "../../data/constants";
import ProjectCard from "../cards/ProjectCard"; 

// --- Styled Components ---

const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  position: relative;
  z-index: 1;
  align-items: center;
  padding: 50px 0 100px 0;
  overflow: hidden; 
`;

const Wrapper = styled.div`
  position: relative;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-direction: column;
  width: 100%;
  max-width: 1350px;
  padding: 0 10px;
  gap: 12px;
`;

// 1. Heading Changed to White
const Title = styled.div`
  font-size: 52px;
  text-align: center;
  font-weight: 800;
  margin-top: 20px;
  color: #FFFFFF; /* Pure White */
  filter: drop-shadow(0px 0px 10px rgba(0, 0, 0, 0.5)); /* Adds readability if background is light */
  
  @media (max-width: 768px) {
    margin-top: 12px;
    font-size: 34px;
  }
`;

const Desc = styled.div`
  font-size: 18px;
  text-align: center;
  max-width: 600px;
  color: ${({ theme }) => theme.text_secondary};
  margin-bottom: 40px;
  @media (max-width: 768px) {
    font-size: 16px;
    margin-bottom: 30px;
  }
`;

const ToggleButtonGroup = styled.div`
  display: flex;
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 50px;
  padding: 6px;
  margin: 0 auto 40px auto;
  gap: 8px;
  flex-wrap: wrap;
  justify-content: center;
  z-index: 2;
  box-shadow: 0 4px 20px rgba(0,0,0,0.2);

  @media (max-width: 768px) {
    border-radius: 12px;
    padding: 8px;
  }
`;

const ToggleButton = styled(motion.button)`
  padding: 10px 24px;
  border-radius: 50px;
  cursor: pointer;
  background: transparent;
  border: none;
  font-size: 15px;
  font-weight: 600;
  color: ${({ active, theme }) => active ? "#fff" : theme.text_primary + "99"};
  transition: all 0.3s ease;
  outline: none;

  &:hover {
    background: rgba(255,255,255,0.08);
  }

  ${({ active }) => active && `
    background: linear-gradient(225deg, #854CE6 0%, #a46dff 100%);
    box-shadow: 0 0 15px rgba(133, 76, 230, 0.4);
    color: #fff !important;
  `}
`;

// --- MARQUEE STYLES ---
const MarqueeContainer = styled.div`
  width: 100%;
  display: flex;
  overflow: hidden; 
  /* Fades the edges so projects don't pop in/out abruptly */
  mask-image: linear-gradient(to right, transparent, black 5%, black 95%, transparent); 
`;

const MarqueeContent = styled(motion.div)`
  display: flex;
  gap: 30px;
  padding: 20px 0;
  width: max-content;
`;

// --- GRID STYLES ---
const GridContainer = styled(motion.div)`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 30px;
  width: 100%;
  max-width: 1200px;

  @media (max-width: 1100px) {
    grid-template-columns: repeat(2, 1fr);
  }
  @media (max-width: 650px) {
    grid-template-columns: repeat(1, 1fr);
  }
`;

const PaginationContainer = styled.div`
  display: flex;
  gap: 12px;
  margin-top: 40px;
  justify-content: center;
`;

const PageButton = styled.button`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: ${({ active }) => active ? "linear-gradient(225deg, #854CE6 0%, #a46dff 100%)" : "rgba(255,255,255,0.05)"};
  border: 1px solid ${({ active }) => active ? "transparent" : "rgba(255,255,255,0.1)"};
  color: ${({ active }) => active ? "#fff" : "rgba(255,255,255,0.6)"};
  cursor: pointer;
  font-weight: 600;
  transition: all 0.3s ease;

  &:hover {
    border-color: #854CE6;
    color: #fff;
    transform: translateY(-2px);
  }
`;

const Projects = () => {
  const [toggle, setToggle] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  
  const projectsPerPage = 6; 
  const filteredProjects = projects.filter((item) => item.category === toggle);
  const totalPages = Math.ceil(filteredProjects.length / projectsPerPage);
  
  const currentProjects = filteredProjects.slice(
    (currentPage - 1) * projectsPerPage,
    currentPage * projectsPerPage
  );

  useEffect(() => {
    setCurrentPage(1); 
  }, [toggle]);

  // 2. Updated Tabs Order (Removed Android, AI first)
  const tabOrder = [
      { key: 'all', label: 'All Projects' },
      { key: 'AI/ML', label: 'AI/ML & GenAI' },
      { key: 'web app', label: 'Web Apps' }
  ];

  return (
    <Container id="Projects">
      <Wrapper>
        <motion.div
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
        >
          <Title>Projects</Title>
          <Desc>
            I have worked on a wide range of projects. From web apps to AI experiments. Here are some of my projects.
          </Desc>
        </motion.div>

        <ToggleButtonGroup>
          {tabOrder.map((tab) => (
            <ToggleButton
              key={tab.key}
              active={toggle === tab.key}
              onClick={() => setToggle(tab.key)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {tab.label.toUpperCase()}
            </ToggleButton>
          ))}
        </ToggleButtonGroup>

        {toggle === "all" ? (
          <MarqueeContainer>
            <MarqueeContent
              animate={{ x: "-50%" }}
              transition={{ 
                ease: "linear", 
                duration: 100, // 3. SLOWED DOWN (was 30, now 100)
                repeat: Infinity 
              }}
              whileHover={{ animationPlayState: "paused" }} 
            >
              {[...projects, ...projects].map((project, index) => (
                 <div key={index} style={{ minWidth: "330px" }}> 
                    <ProjectCard project={project} />
                 </div>
              ))}
            </MarqueeContent>
          </MarqueeContainer>
        ) : (
          <>
            <AnimatePresence mode="wait">
              <GridContainer
                key={toggle + currentPage}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.4 }}
              >
                {currentProjects.map((project, index) => (
                  <motion.div
                    key={project.id || index}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                  >
                    <ProjectCard project={project} />
                  </motion.div>
                ))}
              </GridContainer>
            </AnimatePresence>

            {totalPages > 1 && (
              <PaginationContainer>
                {[...Array(totalPages)].map((_, i) => (
                  <PageButton
                    key={i}
                    active={currentPage === i + 1}
                    onClick={() => {
                        setCurrentPage(i + 1);
                        document.getElementById("Projects").scrollIntoView({ behavior: 'smooth' });
                    }}
                  >
                    {i + 1}
                  </PageButton>
                ))}
              </PaginationContainer>
            )}
          </>
        )}
      </Wrapper>
    </Container>
  );
};

export default Projects;