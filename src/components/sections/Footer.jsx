import React from "react";
import styled from "styled-components";
import { Link } from "react-router-dom";
import { GitHub, Instagram, LinkedIn, MailOutline, ArrowUpward } from "@mui/icons-material";
import { Bio, navLinks } from "../../data/constants";
import Magnetic from "../ui/Magnetic";

const Shell = styled.footer`
  position: relative;
  z-index: 1;
  width: 100%;
  display: flex;
  justify-content: center;
  padding: 64px 24px 40px;
  border-top: 1px solid ${({ theme }) => theme.border};
  background: linear-gradient(180deg, transparent, rgba(234, 225, 205, 0.75));

  @media (max-width: 640px) {
    padding: 48px 18px 32px;
  }
`;

const Inner = styled.div`
  width: 100%;
  max-width: ${({ theme }) => theme.maxWidth};
  display: flex;
  flex-direction: column;
  gap: 40px;
`;

const Top = styled.div`
  display: grid;
  grid-template-columns: minmax(0, 1.4fr) minmax(0, 1fr) auto;
  gap: 40px;
  align-items: start;

  @media (max-width: 820px) {
    grid-template-columns: minmax(0, 1fr);
    gap: 32px;
  }
`;

const Brand = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  max-width: 380px;

  strong {
    font-family: ${({ theme }) => theme.font.display};
    font-size: 20px;
    font-weight: 600;
    color: ${({ theme }) => theme.text_primary};
  }
  p {
    font-size: 14.5px;
    line-height: 1.7;
    color: ${({ theme }) => theme.text_secondary};
  }
`;

const LinkCol = styled.nav`
  display: flex;
  flex-direction: column;
  gap: 10px;

  h4 {
    margin-bottom: 4px;
    font-family: ${({ theme }) => theme.font.mono};
    font-size: 11px;
    font-weight: 600;
    letter-spacing: 0.14em;
    text-transform: uppercase;
    color: ${({ theme }) => theme.text_muted};
  }

  div {
    display: grid;
    grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
    gap: 8px 20px;
  }

  a {
    font-size: 14px;
    color: ${({ theme }) => theme.text_secondary};
    transition: color 0.22s ${({ theme }) => theme.ease.out};

    &:hover {
      color: ${({ theme }) => theme.primary};
    }
  }
`;

const Socials = styled.div`
  display: flex;
  gap: 10px;
`;

const SocialBtn = styled.a`
  display: grid;
  place-items: center;
  width: 44px;
  height: 44px;
  border-radius: 13px;
  border: 1px solid ${({ theme }) => theme.border};
  color: ${({ theme }) => theme.text_secondary};
  transition: all 0.25s ${({ theme }) => theme.ease.out};

  &:hover {
    color: ${({ theme }) => theme.bronze};
    border-color: ${({ theme }) => theme.border_accent};
    background: ${({ theme }) => theme.primary_dim};
  }
`;

const Bottom = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20px;
  padding-top: 26px;
  border-top: 1px solid ${({ theme }) => theme.border};
  font-family: ${({ theme }) => theme.font.mono};
  font-size: 12px;
  color: ${({ theme }) => theme.text_muted};

  @media (max-width: 560px) {
    flex-direction: column;
    align-items: flex-start;
    gap: 14px;
  }
`;

const ToTop = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  min-height: 40px;
  padding: 0 16px;
  border-radius: ${({ theme }) => theme.radius.pill};
  border: 1px solid ${({ theme }) => theme.border};
  background: transparent;
  color: ${({ theme }) => theme.text_secondary};
  font-family: ${({ theme }) => theme.font.mono};
  font-size: 11.5px;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  cursor: pointer;
  transition: all 0.25s ${({ theme }) => theme.ease.out};

  svg {
    font-size: 15px;
  }

  &:hover {
    color: ${({ theme }) => theme.primary};
    border-color: ${({ theme }) => theme.border_accent};
  }
`;

const Footer = () => {
  const scrollTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

  return (
    <Shell>
      <Inner>
        <Top>
          <Brand>
            <strong>{Bio.name}</strong>
            <p>{Bio.tagline}</p>
          </Brand>

          <LinkCol aria-label="Footer navigation">
            <h4>Navigate</h4>
            <div>
              {navLinks.map((l) => (
                <Link key={l.id} to={`/${l.href}`}>
                  {l.label}
                </Link>
              ))}
              <Link to="/#contact">Contact</Link>
              <Link to="/blog">Blog</Link>
            </div>
          </LinkCol>

          <Socials>
            <Magnetic strength={0.25}>
              <SocialBtn href={`mailto:${Bio.email}`} aria-label="Email Ashish">
                <MailOutline />
              </SocialBtn>
            </Magnetic>
            <Magnetic strength={0.25}>
              <SocialBtn href={Bio.github} target="_blank" rel="noreferrer" aria-label="GitHub">
                <GitHub />
              </SocialBtn>
            </Magnetic>
            <Magnetic strength={0.25}>
              <SocialBtn href={Bio.linkedin} target="_blank" rel="noreferrer" aria-label="LinkedIn">
                <LinkedIn />
              </SocialBtn>
            </Magnetic>
            <Magnetic strength={0.25}>
              <SocialBtn href={Bio.insta} target="_blank" rel="noreferrer" aria-label="Instagram">
                <Instagram />
              </SocialBtn>
            </Magnetic>
          </Socials>
        </Top>

        <Bottom>
          {/* Derived, so the year does not silently go stale like the old hardcoded 2024 */}
          <span>
            © {new Date().getFullYear()} {Bio.name}. Built with React and three.js.
          </span>
          <ToTop onClick={scrollTop}>
            Back to top <ArrowUpward />
          </ToTop>
        </Bottom>
      </Inner>
    </Shell>
  );
};

export default Footer;
