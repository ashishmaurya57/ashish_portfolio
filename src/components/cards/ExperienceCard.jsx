import React from "react";
import { VerticalTimelineElement } from "react-vertical-timeline-component";
import styled from "styled-components";
const Top = styled.div`
  width: 100%;
  display: flex;
  max-width: 100%;
  gap: 12px;
`;

const Image = styled.div`
  height: 50px;
  width: 50px;
  border-radius: 10px;
  margin-top: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  font-weight: 600;
  font-size: 18px;
  @media only screen and (max-width: 768px) {
    height: 40px;
    width: 40px;
    font-size: 14px;
  }
`;

const CompanyImg = styled.img`
  height: 50px;
  width: 50px;
  border-radius: 10px;
  margin-top: 4px;
  object-fit: cover;
  @media only screen and (max-width: 768px) {
    height: 40px;
    width: 40px;
  }
`;

const IconContainer = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  font-weight: 600;
  font-size: 16px;
  border-radius: 50%;
`;

const Body = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
`;

const Role = styled.div`
  font-size: 18px;
  font-weight: 600;
  color: ${({ theme }) => theme.text_primary};
  @media only screen and (max-width: 768px) {
    font-size: 14px;
  }
`;

const Company = styled.div`
  font-size: 14px;
  font-weight: 500;
  color: ${({ theme }) => theme.text_secondary};
  @media only screen and (max-width: 768px) {
    font-size: 12px;
  }
`;

const Date = styled.div`
  font-size: 12px;
  font-weight: 400;
  color: ${({ theme }) => theme.text_secondary};
  @media only screen and (max-width: 768px) {
    font-size: 10px;
  }
`;

const Description = styled.div`
  width: 100%;
  font-size: 15px;
  font-weight: 400;
  color: ${({ theme }) => theme.text_primary};
  margin-bottom: 10px;
  line-height: 1.6;
  word-wrap: break-word;
  overflow-wrap: break-word;
  @media only screen and (max-width: 768px) {
    font-size: 12px;
  }
`;

const Skills = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-top: 15px;
  padding-top: 15px;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
`;

const SkillsLabel = styled.div`
  font-weight: 600;
  font-size: 15px;
  color: ${({ theme }) => theme.text_primary};
  margin-bottom: 4px;
  @media only screen and (max-width: 768px) {
    font-size: 13px;
  }
`;

const Cert = styled.div`
  font-size: 15px;
  font-weight: 600;
  color: ${({ theme }) => theme.button};
  text-align: center;
  margin-top: 10px;

  a {
    display: inline-block;
    padding: 8px 16px;
    background-color: ${({ theme }) => theme.button};
    color: #fff;
    cursor: pointer; 
    text-decoration: none;
    border-radius: 4px;
    transition: background-color 0.3s ease;

    &:hover {
      background-color: ${({ theme }) => theme.button_hover};
    }
  }
`;
const Span = styled.div`
  width: 100%;
  line-height: 1.6;
`;

const BulletPoint = styled.div`
  margin-bottom: 10px;
  line-height: 1.6;
  color: ${({ theme }) => theme.text_primary};
`;

const Skill = styled.div`
  font-size: 15px;
  font-weight: 400;
  color: ${({ theme }) => theme.text_primary};
  @media only screen and (max-width: 768px) {
    font-size: 12px;
  }
`;

const ItemWrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
`;

const ExperienceCard = ({ experience }) => {
  // Get company initials
  const getInitials = (company) => {
    if (!company) return "?";
    const words = company.split(" ");
    if (words.length === 1) {
      return words[0].substring(0, 2).toUpperCase();
    }
    return words.map(word => word[0]).join("").substring(0, 2).toUpperCase();
  };

  return (
    <VerticalTimelineElement
      icon={
        <IconContainer>
          {experience?.img ? (
            <img 
              src={experience.img} 
              alt={experience.company}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                borderRadius: "50%"
              }}
            />
          ) : (
            getInitials(experience?.company)
          )}
        </IconContainer>
      }
      contentStyle={{
        display: "flex",
        flexDirection: "column",
        gap: "12px",
        background: "#1d1836",
        color: "#fff",
        boxShadow: "rgba(23, 92, 230, 0.15) 0px 4px 24px",
        backgroundColor: "rgba(17, 25, 40, 0.83)",
        border: "1px solid rgba(255, 255, 255, 0.125)",
        borderRadius: "6px",
        padding: "20px",
        maxWidth: "100%",
        wordWrap: "break-word",
        overflowWrap: "break-word",
      }}
      contentArrowStyle={{
        borderRight: "7px solid rgba(255, 255, 255, 0.3)",
      }}
      date={experience?.date}
    >
      <Top>
        {experience?.img ? (
          <CompanyImg src={experience.img} alt={experience.company} />
        ) : (
          <Image>
            {getInitials(experience?.company)}
          </Image>
        )}
        <Body>
          <Role>{experience?.role}</Role>
          <Company>{experience?.company}</Company>
          <Date>{experience?.date}</Date>
        </Body>
      </Top>
      <Description>
        {experience?.desc && (
          <Span>
            {experience.desc.split('\n').map((line, index) => (
              line.trim() && (
                <BulletPoint key={index}>
                  {line.trim()}
                </BulletPoint>
              )
            ))}
          </Span>
        )}
        {experience?.skills && (
          <Skills>
            <SkillsLabel>Skills</SkillsLabel>
            <ItemWrapper>
              {experience?.skills?.map((skill, index) => (
                <Skill key={index}>• {skill}</Skill>
              ))}
            </ItemWrapper>
            {experience?.doc && (
              <Cert>
                <a href={experience.doc} target="_blank" rel="noopener noreferrer">
                  Certificate
                </a>
              </Cert>
            )}
          </Skills>
        )}
      </Description>
    </VerticalTimelineElement>
  );
};

export default ExperienceCard;
