import React from "react";
import styled from "styled-components";
import { motion } from "framer-motion";
import { Bio } from "../../data/constants";
import {
  GitHub,
  Instagram,
  LinkedIn,
  Email,
} from "@mui/icons-material";
import { containerVariants, itemVariants } from "../../utils/motion";

const FooterContainer = styled.div`
  width: 100%;
  padding: 2rem 0;
  display: flex;
  justify-content: center;
  z-index: 10;
  position: relative;
`;
const FooterWrapper = styled.div`
  width: 100%;
  max-width: 1200px;
  display: flex;
  flex-direction: column;
  gap: 14px;
  align-items: center;
  padding: 1rem;
  color: ${({ theme }) => theme.text_primary};
`;
const Logo = styled.div`
  font-weight: 600;
  font-size: 20px;
  color: ${({ theme }) => theme.primary};
`;
const Nav = styled.ul`
  width: 100%;
  max-width: 800px;
  margin-top: 0.5rem;
  display: flex;
  flex-direction: row;
  gap: 2rem;
  justify-content: center;
  @media (max-width: 768px) {
    flex-wrap: wrap;
    gap: 1rem;
    justify-content: center;
    text-align: center;
    font-size: 12px;
  }
`;
const NavLink = styled.a`
  color: ${({ theme }) => theme.text_primary};
  text-decoration: none;
  font-size: 1.2rem;
  transition: color 0.2s ease-in-out;
  &:hover {
    color: ${({ theme }) => theme.primary};
  }
  @media (max-width: 768px) {
    font-size: 1rem;
  }
`;
const SocialMediaIcons = styled.div`
  display: flex;
  margin-top: 1rem;
`;
const SocialMediaIcon = styled.a`
  display: inline-block;
  margin: 0 1rem;
  font-size: 1.5rem;
  color: ${({ theme }) => theme.text_primary};
  transition: color 0.2s ease-in-out;
  &:hover {
    color: ${({ theme }) => theme.primary};
  }
`;

const Copyright = styled.p`
  margin-top: 1.5rem;
  font-size: 0.9rem;
  color: ${({ theme }) => theme.soft2};
  text-align: center;
`;

const Footer = () => {
  return (
    <FooterContainer>
      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
      >
        <FooterWrapper>
          <motion.div variants={itemVariants}>
            <Logo>Ashish Maurya</Logo>
          </motion.div>
          <motion.div variants={itemVariants}>
            <Nav>
              <NavLink href="#About">About</NavLink>
              <NavLink href="#Skills">Skills</NavLink>
              <NavLink href="#Experience">Experience</NavLink>
              <NavLink href="#Projects">Projects</NavLink>
              <NavLink href="#Coding">Coding</NavLink>
              <NavLink href="#Education">Education</NavLink>
            </Nav>
          </motion.div>
          <motion.div variants={itemVariants}>
            <SocialMediaIcons>
              <motion.div
                whileHover={{ scale: 1.2, y: -5 }}
                whileTap={{ scale: 0.9 }}
              >
                <SocialMediaIcon href={`mailto:${encodeURIComponent(Bio.email)}?subject=Subject&body=Body`} target="_blank">
                  <Email />
                </SocialMediaIcon>
              </motion.div>
              <motion.div
                whileHover={{ scale: 1.2, y: -5 }}
                whileTap={{ scale: 0.9 }}
              >
                <SocialMediaIcon href={Bio.github} target="_blank">
                  <GitHub />
                </SocialMediaIcon>
              </motion.div>
              <motion.div
                whileHover={{ scale: 1.2, y: -5 }}
                whileTap={{ scale: 0.9 }}
              >
                <SocialMediaIcon href={Bio.linkedin} target="_blank">
                  <LinkedIn />
                </SocialMediaIcon>
              </motion.div>
              <motion.div
                whileHover={{ scale: 1.2, y: -5 }}
                whileTap={{ scale: 0.9 }}
              >
                <SocialMediaIcon href={Bio.insta} target="_blank">
                  <Instagram />
                </SocialMediaIcon>
              </motion.div>
            </SocialMediaIcons>
          </motion.div>
          <motion.div variants={itemVariants}>
            <Copyright>&copy; 2024 Ashish Maurya, All rights reserved.</Copyright>
          </motion.div>
        </FooterWrapper>
      </motion.div>
    </FooterContainer>
  );
};

export default Footer;
