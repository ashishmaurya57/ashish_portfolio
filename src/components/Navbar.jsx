import React, { useState, useEffect } from "react";
import { Link as LinkR } from "react-router-dom";
import styled from "styled-components"; // Removed useTheme since we are hardcoding dark mode
import { motion, AnimatePresence } from "framer-motion";
import { Bio } from "../data/constants";
import { 
  Person, 
  Code, 
  Work, 
  Folder, 
  School,
  MenuRounded,
  GitHub,
  LinkedIn,
  Email
} from "@mui/icons-material";

// --- Styled Components ---

const Nav = styled(motion.div)`
  /* Match the body gradient background */
  background: linear-gradient(to right, rgba(0, 102, 99, 0.95), rgba(17, 17, 17, 0.95));
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  height: 80px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1rem;
  position: sticky;
  top: 0;
  z-index: 1000;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
  box-shadow: 0 2px 20px rgba(0, 0, 0, 0.3);
  @media screen and (max-width: 960px) {
    transition: 0.8s all ease;
  }
`;

const NavbarContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 60px;
  z-index: 1;
  width: 100%;
  padding: 0 24px;
  max-width: 1200px;
  position: relative;
`;

const NavLogo = styled(LinkR)`
  display: flex;
  align-items: center;
  justify-self: flex-start;
  cursor: pointer;
  text-decoration: none;
  z-index: 2;
`;

const LogoText = styled.span`
  font-weight: 700;
  font-size: 24px;
  color: white; /* Fallback */
  background: linear-gradient(225deg, #854CE6 0%, #a46dff 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  filter: drop-shadow(0px 0px 5px rgba(133, 76, 230, 0.5));
`;

// --- The Center Menu (Dark Glass) ---
const NavMenu = styled(motion.div)`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 4px;
  
  /* Hardcoded Dark Background with blur */
  background: rgba(25, 25, 36, 0.85); 
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  
  padding: 6px 8px;
  border-radius: 50px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
  
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  
  @media screen and (max-width: 960px) {
    display: none;
  }
`;

const NavItem = styled.li`
  list-style: none;
  position: relative;
  cursor: pointer;
`;

const NavLink = styled.a`
  display: flex;
  align-items: center;
  gap: 8px;
  
  /* FORCE WHITE TEXT */
  color: rgba(255, 255, 255, 0.8); 
  
  font-weight: 500;
  text-decoration: none;
  padding: 10px 16px;
  border-radius: 50px;
  font-size: 14px;
  transition: all 0.2s ease-in-out;
  position: relative;
  z-index: 1;

  &:hover {
    color: #ffffff;
    text-shadow: 0 0 10px rgba(255, 255, 255, 0.5);
  }
`;

const ActivePill = styled(motion.div)`
  position: absolute;
  inset: 0;
  background: linear-gradient(90deg, rgba(133, 76, 230, 0.2) 0%, rgba(133, 76, 230, 0.1) 100%);
  border-radius: 50px;
  z-index: 0;
  border: 1px solid rgba(133, 76, 230, 0.3);
`;

// --- Right Side Buttons ---
const ButtonContainer = styled.div`
  width: auto;
  height: 100%;
  display: flex;
  justify-content: end;
  align-items: center;
  padding: 0 6px;
  gap: 12px;
  z-index: 2;
  
  /* Ensure they are visible on larger screens */
  @media screen and (max-width: 960px) {
    display: none;
  }
`;

const SocialButton = styled(motion.a)`
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.1); /* Slight white tint for visibility */
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 50%;
  width: 40px;
  height: 40px;
  
  /* FORCE ICON COLOR TO WHITE */
  color: #ffffff !important; 
  
  transition: all 0.2s ease-in-out;
  text-decoration: none;

  &:hover {
    background: ${({ color }) => color || "#854CE6"};
    transform: translateY(-2px);
    box-shadow: 0 0 10px ${({ color }) => color || "#854CE6"};
    border-color: transparent;
  }
`;

const MobileIcon = styled.div`
  display: none;
  @media screen and (max-width: 960px) {
    display: block;
    position: absolute;
    top: 0;
    right: 0;
    transform: translate(-100%, 60%);
    font-size: 1.5rem;
    cursor: pointer;
    color: #ffffff; /* Force white */
  }
`;

const MobileMenu = styled(motion.div)`
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 16px;
  position: absolute;
  top: 80px;
  right: 0;
  width: 100%;
  padding: 24px 40px 24px 40px;
  background: rgba(25, 25, 36, 0.95); /* Dark background */
  backdrop-filter: blur(10px);
  border-radius: 0 0 20px 20px;
  box-shadow: 0 10px 40px rgba(0,0,0,0.5);
  z-index: 999;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
`;

const MobileLink = styled(LinkR)`
  color: white;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease-in-out;
  text-decoration: none;
  font-size: 18px;

  &:hover {
    color: #854CE6;
  }
`;

const navItems = [
  { href: '#About', label: 'About', icon: Person, name: 'About' },
  { href: '#Skills', label: 'Skills', icon: Code, name: 'Skills' },
  { href: '#Experience', label: 'Experience', icon: Work, name: 'Experience' },
  { href: '#Projects', label: 'Projects', icon: Folder, name: 'Projects' },
  { href: '#Education', label: 'Education', icon: School, name: 'Education' },
];

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('About');

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 200;
      for (const item of navItems) {
        const element = document.getElementById(item.name);
        if (element) {
          const offsetTop = element.offsetTop;
          const offsetHeight = element.offsetHeight;
          if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
            setActiveSection(item.name);
          }
        }
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <Nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5 }}
    >
      <NavbarContainer>
        <NavLogo to="/">
          <LogoText>Ashish Maurya</LogoText>
        </NavLogo>

        <MobileIcon onClick={() => setIsOpen(!isOpen)}>
          <MenuRounded sx={{ color: 'white', fontSize: '2rem' }} />
        </MobileIcon>

        <NavMenu>
          {navItems.map((item) => {
            const isActive = activeSection === item.name;
            const Icon = item.icon;
            return (
              <NavItem key={item.name}>
                <NavLink 
                    href={item.href}
                    onClick={() => setActiveSection(item.name)}
                >
                  {isActive && (
                    <ActivePill
                      layoutId="activePill"
                      transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    />
                  )}
                  <span style={{ 
                      position: 'relative', 
                      display: 'flex', 
                      alignItems:'center', 
                      gap:'6px', 
                      zIndex: 1, 
                      color: isActive ? '#FFFFFF' : 'rgba(255,255,255,0.7)' 
                  }}>
                    <Icon sx={{ fontSize: 18 }} />
                    {item.label}
                  </span>
                </NavLink>
              </NavItem>
            );
          })}
        </NavMenu>

        <ButtonContainer>
          <SocialButton 
            href={Bio.github} 
            target="_blank" 
            color="#000000" // Hover color black for Github
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            <GitHub sx={{ fontSize: 22 }} />
          </SocialButton>
          
          <SocialButton 
            href={Bio.linkedin} 
            target="_blank" 
            color="#0077b5" // Hover color blue for LinkedIn
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            <LinkedIn sx={{ fontSize: 22 }} />
          </SocialButton>

           <SocialButton 
            href={`mailto:${Bio.email}`}
            color="#EA4335" // Hover color red for Email
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            <Email sx={{ fontSize: 22 }} />
          </SocialButton>
        </ButtonContainer>

        <AnimatePresence>
          {isOpen && (
            <MobileMenu
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              {navItems.map((item) => (
                <MobileLink 
                    key={item.name} 
                    to={item.href} 
                    onClick={() => setIsOpen(false)}
                >
                  {item.label}
                </MobileLink>
              ))}
              <div style={{display:'flex', gap: '12px', marginTop: '10px'}}>
                  <SocialButton href={Bio.github} target="_blank"><GitHub /></SocialButton>
                  <SocialButton href={Bio.linkedin} target="_blank"><LinkedIn /></SocialButton>
                  <SocialButton href={`mailto:${Bio.email}`}><Email /></SocialButton>
              </div>
            </MobileMenu>
          )}
        </AnimatePresence>

      </NavbarContainer>
    </Nav>
  );
};

export default Navbar;
