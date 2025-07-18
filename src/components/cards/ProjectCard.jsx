import React, { useState } from "react";
import styled from "styled-components";

const Card = styled.div`
  width: 330px;
  height: auto;
  background-color: ${({ theme }) => theme.card};
  cursor: pointer;
  border-radius: 10px;
  box-shadow: 0 0 12px 4px rgba(0, 0, 0, 0.4);
  overflow: hidden;
  padding: 26px 20px;
  display: flex;
  flex-direction: column;
  gap: 14px;
  transition: all 0.5s ease-in-out;

  &:hover {
    transform: translateY(-10px);
    box-shadow: 0 0 50px 4px rgba(0, 0, 0, 0.6);
    filter: brightness(1.1);
  }
`;

const Image = styled.img`
  width: 100%;
  height: 180px;
  background-color: ${({ theme }) => theme.white};
  border-radius: 10px;
  box-shadow: 0 0 16px 2px rgba(0, 0, 0, 0.3);
`;

const Tags = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 4px;
`;

const Details = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding: 0px 2px;
`;

const Title = styled.div`
  font-size: 20px;
  font-weight: 600;
  color: ${({ theme }) => theme.text_secondary};
`;

const Date = styled.div`
  font-size: 12px;
  font-weight: 400;
  color: ${({ theme }) => theme.text_secondary + 80};

  @media only screen and (max-width: 768px) {
    font-size: 10px;
  }
`;

const Description = styled.div`
  font-weight: 400;
  color: ${({ theme }) => theme.text_secondary + 99};
  overflow: hidden;
`;

const ToggleButton = styled.button`
  background: none;
  color: ${({ theme }) => theme.primary};
  border: none;
  font-weight: 600;
  margin-top: 6px;
  cursor: pointer;
  padding: 0;
`;

const Members = styled.div`
  display: flex;
  align-items: center;
  padding-left: 10px;
`;

const Avatar = styled.img`
  width: 38px;
  height: 38px;
  border-radius: 50%;
  margin-left: -10px;
  background-color: ${({ theme }) => theme.white};
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
  border: 3px solid ${({ theme }) => theme.card};
`;

const ButtonRow = styled.div`
  display: flex;
  justify-content: center;
  gap: 16px;
  margin-top: auto;
`;

const IconLink = styled.a`
  color: ${({ theme }) => theme.primary};
  text-decoration: none;
  font-weight: 600;
`;

const Icon = styled.img`
  width: 32px;
  height: 32px;
`;

const ProjectCard = ({ project }) => {
  const [readMore, setReadMore] = useState(false);

  const toggleRead = () => setReadMore((prev) => !prev);

  return (
    <Card>
      {project.webapp ? (
  <IconLink href={project.webapp} target="_blank">
    <Image src={project.image} alt={project.title} />
  </IconLink>
) : (
  <Image src={project.image} alt={project.title} />
)}

      <Tags>{/* Optional tag UI here */}</Tags>
      <Details>
        <Title>{project.title}</Title>
        <Date>{project.date}</Date>
        <Description>
          {readMore ? project.description : `${project.description.slice(0, 100)}...`}
          {project.description.length > 100 && (
            <ToggleButton onClick={toggleRead}>
              {readMore ? "Read Less" : "Read More"}
            </ToggleButton>
          )}
        </Description>
      </Details>
      <Members>
        {project.member?.map((member) => (
          <Avatar key={member.id} src={member.img} alt={member.name} />
        ))}
      </Members>
      <ButtonRow>
        {project.webapp && (
          <IconLink href={project.webapp} target="_blank">
            <Icon
              src="https://img.icons8.com/?size=160&id=A1sOKWfoV74i&format=png"
              alt="Web App"
            />
          </IconLink>
        )}
        {project.github && (
          <IconLink href={project.github} target="_blank">
            <Icon
              src="https://img.icons8.com/?size=64&id=48250&format=png"
              alt="GitHub"
            />
          </IconLink>
        )}
      </ButtonRow>
    </Card>
  );
};

export default ProjectCard;
