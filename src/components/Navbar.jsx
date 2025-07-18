import React, { useState } from "react";
import { Link as LinkR } from "react-router-dom";
import styled, { useTheme } from "styled-components";
import { Bio } from "../data/constants";
import { MenuRounded } from "@mui/icons-material";

const Nav = styled.div`
  background: linear-gradient(to right, #006663, #111111);
  height: 80px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1rem;
  position: sticky;
  top: 0;
  z-index: 10;
  color: white;
`;

const NavbarContainer = styled.div`
  width: 100%;
  max-width: 1200px;
  padding: 0 24px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 1rem;
`;
const NavLogo = styled(LinkR)`
  width: 80%;
  padding: 0 6px;
  font-weight: 500;
  font-size: 18px;
  text-decoration: none;
  color: inherit;
`;

const NavItems = styled.ul`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 32px;
  padding: 0 6px;
  list-style: none;

  @media screen and (max-width: 768px) {
    display: none;
  }
`;

const NavLink = styled.a`
  color: ${({ theme }) => theme.text_primary};
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease-in-out;
  text-decoration: none;
  &:hover {
    color: ${({ theme }) => theme.primary};
  }
`;

const ButtonContainer = styled.div`
  width: 80%;
  height: 100%;
  display: flex;
  gap:15px;
  justify-content: end;
  align-items: center;
  padding: 0 6px;
  @media screen and (max-width: 768px) {
    display: none;
  }
`;

const GithubButton = styled.a`
  border: 1px solid ${({ theme }) => theme.primary};
  color: ${({ theme }) => theme.primary};
  justify-content: center;
  display: flex;
  gap:10px;
  align-items: center;
  border-radius: 20px;
  cursor: pointer;
  padding: 10px 20px;
  font-size: 16px;
  font-weight: 500;
  transition: all 0.6s ease-in-out;
  text-decoration: none;
  &:hover {
    background: ${({ theme }) => theme.primary};
    color: ${({ theme }) => theme.text_primary};
  }
`;

const ContactInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
  margin-left: 20px;
  
  @media screen and (max-width: 768px) {
    display: none;
  }
`;

const ContactItem = styled.div`
  color: ${({ theme }) => theme.text_primary || '#ffffff'};
  font-size: 12px;
  font-weight: 400;
  display: flex;
  align-items: center;
  gap: 6px;
  opacity: 0.9;
  transition: opacity 0.3s ease;
  
  &:hover {
    opacity: 1;
  }
`;

const ContactText = styled.span`
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 150px;
`;

const MobileIcon = styled.div`
  height: 100%;
  display: flex;
  align-items: center;
  color: ${({ theme }) => theme.text_primary};
  display: none;
  @media screen and (max-width: 768px) {
    display: block;
  }
`;

const MobileMenu = styled.ul`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: start;
  gap: 16px;
  padding: 0 6px;
  list-style: none;
  width: 100%;
  padding: 12px 40px 24px 40px;
  background: ${({ theme }) => theme.card_light + 99};
  position: absolute;
  top: 80px;
  right: 0;

  transition: all 0.6s ease-in-out;
  transform: ${({ isOpen }) =>
    isOpen ? "translateY(0)" : "translateY(-100%)"};
  border-radius: 0 0 20px 20px;
  box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.2);
  opacity: ${({ isOpen }) => (isOpen ? "100%" : "0")};
  z-index: ${({ isOpen }) => (isOpen ? "1000" : "-1000")};
`;

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const theme = useTheme();
  return (
    <Nav>
      <NavbarContainer>
        <NavLogo to="/">Ashish Maurya</NavLogo>

        <MobileIcon onClick={() => setIsOpen(!isOpen)}>
          <MenuRounded style={{ color: "inherit" }} />
        </MobileIcon>

        <NavItems>
          <NavLink href="#About">About</NavLink>
          <NavLink href="#Skills">Skills</NavLink>
          <NavLink href="#Experience">Experience</NavLink>
          <NavLink href="#Projects">Projects</NavLink>
          <NavLink href="#Education">Education</NavLink>
          <NavLink href="#Coding">Coding Profile</NavLink>
        </NavItems>

        {isOpen && (
          <MobileMenu isOpen={isOpen}>
            <NavLink onClick={() => setIsOpen(!isOpen)} href="#About">
              About
            </NavLink>
            <NavLink onClick={() => setIsOpen(!isOpen)} href="#Skills">
              Skills
            </NavLink>
            <NavLink onClick={() => setIsOpen(!isOpen)} href="#Experience">
              Experience
            </NavLink>
            <NavLink onClick={() => setIsOpen(!isOpen)} href="#Projects">
              Projects
            </NavLink>
            <NavLink onClick={() => setIsOpen(!isOpen)} href="#Coding">
            Coding Profile
          </NavLink>
            <NavLink onClick={() => setIsOpen(!isOpen)} href="#Education">
              Education
            </NavLink>
            <GithubButton
              href={Bio.github}
              target="_Blank"
              style={{
                background: theme.primary,
                color: theme.text_primary,
              }}
            >
            <img src="https://cdn-icons-png.flaticon.com/128/10090/10090320.png" style={{height:"30px"}}/>
            </GithubButton>
          </MobileMenu>
        )}

        <ButtonContainer>
          <GithubButton href={Bio.linkedin} target="_Blank">
           
             <img src="data:image/png;base64,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" style={{height:"30px", width:"30px"}}/>
          </GithubButton>
          <GithubButton href={Bio.github} target="_Blank">
            <img src="https://cdn-icons-png.flaticon.com/128/10090/10090320.png" style={{height:"30px", width:"30px"}}/>
            
          </GithubButton>

        </ButtonContainer>
        
        <ContactInfo>
          <ContactItem>
            <span style={{ fontSize: '10px' }}>📞</span>
            <ContactText>{Bio.Contact}</ContactText>
          </ContactItem>
          <ContactItem>
            <span style={{ fontSize: '10px' }}>✉️</span>
            <ContactText>{Bio.email}</ContactText>
          </ContactItem>
        </ContactInfo>
      </NavbarContainer>
    </Nav>
  );
};

export default Navbar;