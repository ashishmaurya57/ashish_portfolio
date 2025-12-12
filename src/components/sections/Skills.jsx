import React from "react";
import styled from "styled-components";
import { skills } from "../../data/constants";
import { motion } from "framer-motion";
import * as SiIcons from "react-icons/si";
import * as TbIcons from "react-icons/tb";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-contnet: center;
  position: rlative;
  z-index: 1;
  align-items: center;
`;

const Wrapper = styled.div`
  position: relative;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-direction: column;
  width: 100%;
  max-width: 1100px;
  gap: 12px;
  @media (max-width: 960px) {
    flex-direction: column;
  }
`;
const Title = styled.div`
  font-size: 52px;
  text-align: center;
  font-weight: 600;
  margin-top: 20px;
  color: ${({ theme }) => theme.text_primary};
  @media (max-width: 768px) {
    margin-top: 12px;
    font-size: 32px;
  }
`;
const Desc = styled.div`
  font-size: 18px;
  text-align: center;
  font-weight: 600;
  color: ${({ theme }) => theme.text_secondary};
  @media (max-width: 768px) {
    font-size: 16px;
  }
`;

const SkillsContainer = styled.div`
  width: 100%;
  display: grid;
  grid-template-columns: 1fr 1fr;
  margin-top: 30px;
  gap: 35px;
  justify-content: center;

  @media (max-width: 960px) {
    gap: 30px;
  }

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 25px;
    padding: 0 10px;
  }

  @media (max-width: 500px) {
    gap: 20px;
    padding: 0 5px;
  }
`;

const Skill = styled(motion.div)`
  width: 100%;
  max-width: 500px;
  background: linear-gradient(135deg, rgba(17, 25, 40, 0.9) 0%, rgba(30, 41, 59, 0.8) 100%);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  box-shadow: 
    rgba(23, 92, 230, 0.3) 0px 8px 32px,
    inset rgba(255, 255, 255, 0.1) 0px 1px 0px;
  border-radius: 20px;
  padding: 24px 28px;
  position: relative;
  overflow: hidden;
  cursor: pointer;
  transition: all 0.3s ease;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.1), transparent);
    transition: left 0.5s;
  }

  &:hover::before {
    left: 100%;
  }

  &:hover {
    transform: translateY(-5px);
    box-shadow: 
      rgba(23, 92, 230, 0.4) 0px 12px 40px,
      inset rgba(255, 255, 255, 0.15) 0px 1px 0px;
    border-color: rgba(255, 255, 255, 0.3);
  }

  @media (max-width: 768px) {
    max-width: 400px;
    padding: 20px 24px;
  }

  @media (max-width: 500px) {
    max-width: 330px;
    padding: 16px 20px;
  }
`;

const SkillTitle = styled.div`
  font-size: 26px;
  font-weight: 700;
  margin-bottom: 24px;
  text-align: center;
  color: ${({ theme }) => theme.text_primary};
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  position: relative;

  &::after {
    content: '';
    position: absolute;
    bottom: -8px;
    left: 50%;
    transform: translateX(-50%);
    width: 50px;
    height: 3px;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    border-radius: 2px;
  }

  @media (max-width: 768px) {
    font-size: 22px;
    margin-bottom: 20px;
  }
`;

const SkillList = styled.div`
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  gap: 12px;
  margin-bottom: 20px;
`;
const SkillItem = styled(motion.div)`
  font-size: 15px;
  font-weight: 500;
  color: ${({ theme }) => theme.text_primary};
  background: rgba(255, 255, 255, 0.05);
  border: 1.5px solid rgba(255, 255, 255, 0.1);
  border-radius: 50px;
  padding: 10px 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(135deg, rgba(103, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%);
    opacity: 0;
    transition: opacity 0.3s ease;
  }

  &:hover {
    transform: translateY(-3px) scale(1.02);
    border-color: rgba(103, 126, 234, 0.5);
    box-shadow: 
      0 8px 25px rgba(103, 126, 234, 0.2),
      0 0 0 1px rgba(103, 126, 234, 0.1);
    color: #fff;
  }

  &:hover::before {
    opacity: 1;
  }

  &:active {
    transform: translateY(-1px) scale(0.98);
  }

  @media (max-width: 768px) {
    font-size: 13px;
    padding: 8px 14px;
    gap: 8px;
  }
  @media (max-width: 500px) {
    font-size: 12px;
    padding: 6px 12px;
    gap: 6px;
  }
`;
const SkillIconWrapper = styled.div`
  width: 22px;
  height: 22px;
  transition: transform 0.3s ease;
  z-index: 1;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  
  svg {
    width: 100%;
    height: 100%;
  }

  ${SkillItem}:hover & {
    transform: scale(1.1) rotate(5deg);
  }

  @media (max-width: 768px) {
    width: 20px;
    height: 20px;
  }
  @media (max-width: 500px) {
    width: 18px;
    height: 18px;
  }
`;

const Skills = () => {
  const renderIcon = (iconName) => {
    // Check if icon exists in Simple Icons (Si)
    if (SiIcons[iconName]) {
      const IconComponent = SiIcons[iconName];
      return <IconComponent />;
    }
    
    // Check if icon exists in Tabler Icons (Tb)
    if (TbIcons[iconName]) {
      const IconComponent = TbIcons[iconName];
      return <IconComponent />;
    }
    
    // Fallback to a default icon if not found
    return <TbIcons.TbCode />;
  };
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  const skillCardVariants = {
    hidden: { 
      opacity: 0, 
      y: 50,
      scale: 0.9 
    },
    visible: { 
      opacity: 1, 
      y: 0,
      scale: 1,
      transition: {
        duration: 0.6,
        ease: "easeOut"
      }
    }
  };

  const skillItemVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { 
      opacity: 1, 
      scale: 1,
      transition: {
        duration: 0.3,
        ease: "easeOut"
      }
    }
  };

  return (
    <Container id="Skills">
      <Wrapper>
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <Title>Skills & Technologies</Title>
          <Desc style={{ marginBottom: "40px" }}>
            Here's my comprehensive skillset developed through years of hands-on experience and continuous learning
          </Desc>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
        >
          <SkillsContainer>
            {skills.map((skill, index) => (
              <Skill
                key={`skill-${index}`}
                variants={skillCardVariants}
                whileHover={{ 
                  y: -8,
                  transition: { duration: 0.3 }
                }}
                whileTap={{ scale: 0.98 }}
              >
                <SkillTitle>{skill.title}</SkillTitle>
                <SkillList>
                  {skill.skills.map((item, index_x) => (
                    <SkillItem
                      key={`skill-x-${index_x}`}
                      variants={skillItemVariants}
                      whileHover={{ 
                        scale: 1.05,
                        transition: { duration: 0.2 }
                      }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <SkillIconWrapper>
                        {renderIcon(item.icon)}
                      </SkillIconWrapper>
                      <span style={{ position: 'relative', zIndex: 1 }}>
                        {item.name}
                      </span>
                    </SkillItem>
                  ))}
                </SkillList>
              </Skill>
            ))}
          </SkillsContainer>
        </motion.div>
      </Wrapper>
    </Container>
  );
};

export default Skills;
