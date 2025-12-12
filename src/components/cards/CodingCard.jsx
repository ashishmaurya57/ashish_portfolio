import React from "react";
import styled from "styled-components";
import { motion } from "framer-motion";
import { cardHover } from "../../utils/motion";

const Card = styled.div`
  width: 280px;
  height: auto;
  min-height: 280px;
  background-color: #171721;
  border-radius: 16px;
  box-shadow: 0 0 12px 4px rgba(0, 0, 0, 0.4);
  padding: 24px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
  transition: all 0.3s ease-in-out;
  position: relative;
  overflow: visible; /* Changed to visible to help with popping out */
  border: 1px solid rgba(255, 255, 255, 0.1);
  
  flex-shrink: 0;

  &:hover {
    transform: translateY(-10px);
    /* Removed blue border color */
    box-shadow: 0 0 50px 4px rgba(0, 0, 0, 0.6);
    filter: brightness(1.1);
  }
`;

const LogoWrapper = styled.div`
  width: 80px;
  height: 80px;
  background: white;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  box-shadow: 0 0 10px rgba(0,0,0,0.2);
  margin-bottom: 8px;
  border: 3px solid #171721;
`;

const Image = styled.img`
  width: 60%;
  height: 60%;
  object-fit: contain;
`;

const Details = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
`;

const Title = styled.div`
  font-size: 20px;
  font-weight: 700;
  color: #FFFFFF;
  text-align: center;
`;

const RatingContainer = styled.div`
  background: rgba(133, 76, 230, 0.1);
  padding: 6px 16px;
  border-radius: 20px;
  border: 1px solid rgba(133, 76, 230, 0.4);
  margin-bottom: 10px;
`;

const Rating = styled.div`
  font-size: 14px;
  font-weight: 600;
  color: #a46dff;
`;

const Description = styled.div`
  width: 100%;
`;

const SkillList = styled.ul`
  list-style: none;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const SkillItem = styled.li`
  font-size: 13px;
  font-weight: 400;
  color: rgba(255, 255, 255, 0.7);
  display: flex;
  align-items: flex-start;
  gap: 8px;
  text-align: left;
  
  &:before {
    content: "•";
    color: #854CE6;
    font-size: 18px;
    line-height: 14px;
    font-weight: bold;
  }
`;

const getPlatformLogo = (platform) => {
  const p = platform?.toLowerCase() || "";
  
  if (p.includes("leetcode")) {
    return "https://upload.wikimedia.org/wikipedia/commons/1/19/LeetCode_logo_black.png";
  } else if (p.includes("codechef")) {
    return "https://i.pinimg.com/originals/c5/d9/fc/c5d9fc1e18bcf039f464c2ab6cfb3eb6.jpg";
  } else if (p.includes("codeforces")) {
    return "https://cdn.iconscout.com/icon/free/png-256/free-codeforces-3628695-3029920.png";
  } else if (p.includes("hackerrank")) {
    return "https://upload.wikimedia.org/wikipedia/commons/4/40/HackerRank_Icon-1000px.png";
  } else if (p.includes("geeks") || p.includes("gfg")) { 
    return "https://upload.wikimedia.org/wikipedia/commons/thumb/4/43/GeeksforGeeks.svg/256px-GeeksforGeeks.svg.png";
  }
  
  return "https://cdn-icons-png.flaticon.com/512/1005/1005141.png"; 
};

const CodingCard = ({ project }) => {
  const logoUrl = getPlatformLogo(project.palteform); 

  return (
    <motion.div
      variants={cardHover}
      initial="rest"
      whileHover="hover"
      whileTap={{ scale: 0.98 }}
    >
      <a href={project.link} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none' }}>
        <Card>
          <LogoWrapper>
            <Image src={logoUrl} alt={project.palteform} />
          </LogoWrapper>
          
          <Details>
            <Title>{project.palteform}</Title>
            
            <RatingContainer>
                <Rating>Max Rating: {project.rating}</Rating>
            </RatingContainer>

            <Description>
              <SkillList>
                {project?.acheive?.map((skill, index) => (
                  <SkillItem key={index}>{skill}</SkillItem>
                ))}
              </SkillList>
            </Description>
          </Details>
        </Card>
      </a>
    </motion.div>
  );
};

export default CodingCard;