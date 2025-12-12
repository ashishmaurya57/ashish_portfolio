import React from "react";
import styled from "styled-components";
import { motion } from "framer-motion";
import { codings } from "../../data/constants";
import CodingCard from "../cards/CodingCard";
import { containerVariants, fadeInUp } from "../../utils/motion";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  position: relative;
  z-index: 1;
  align-items: center;
  padding: 50px 0 100px 0;
`;

const Wrapper = styled.div`
  position: relative;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-direction: column;
  width: 100%;
  max-width: 1250px;
  gap: 12px;
  padding: 0 20px;
  @media (max-width: 960px) {
    flex-direction: column;
  }
`;

const Title = styled.div`
  font-size: 52px;
  text-align: center;
  font-weight: 800;
  margin-top: 20px;
  color: #FFFFFF;
  filter: drop-shadow(0px 0px 10px rgba(0, 0, 0, 0.5));
  
  @media (max-width: 768px) {
    margin-top: 12px;
    font-size: 32px;
  }
`;

const Desc = styled.div`
  font-size: 18px;
  text-align: center;
  max-width: 600px;
  color: ${({ theme }) => theme.text_secondary};
  margin-bottom: 40px;
  line-height: 1.5;
  
  @media (max-width: 768px) {
    font-size: 16px;
  }
`;

const CardContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: stretch;
  gap: 24px;
  width: 100%;
  
  flex-wrap: nowrap; 
  overflow-x: auto; 
  
  /* CRITICAL FIX: Add Padding Top so hover animation doesn't get clipped */
  padding: 30px 10px;

  /* Hide Scrollbar (The "Horizontal Line") */
  &::-webkit-scrollbar {
    display: none; /* Chrome, Safari, Opera */
  }
  -ms-overflow-style: none;  /* IE and Edge */
  scrollbar-width: none;  /* Firefox */

  @media (max-width: 1100px) {
     justify-content: flex-start;
  }
`;

const Coding = () => {
  return (
    <Container id="Coding">
      <Wrapper>
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={fadeInUp}
        >
          <Title>Coding Achievements</Title>
          <Desc>
            As an enthusiastic and dedicated coder, I bring a strong foundation in programming languages such as JavaScript and C++. 
            With a passion for problem-solving, I excel in crafting efficient algorithms and robust software solutions.
          </Desc>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          style={{ width: '100%', display: 'flex', justifyContent: 'center' }}
        >
          <CardContainer>
            {codings.map((project, index) => (
              <motion.div key={project.id || index} variants={fadeInUp}>
                <CodingCard project={project} />
              </motion.div>
            ))}
          </CardContainer>
        </motion.div>
      </Wrapper>
    </Container>
  );
};

export default Coding;