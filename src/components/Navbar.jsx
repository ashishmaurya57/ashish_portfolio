import React, { useState, useEffect, useCallback } from "react";
import styled from "styled-components";
import { motion, AnimatePresence } from "framer-motion";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { GitHub, LinkedIn, Close, MenuRounded, ArrowOutward } from "@mui/icons-material";
import { Bio, navLinks } from "../data/constants";
import Magnetic from "./ui/Magnetic";

const Nav = styled(motion.header)`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1100;
  display: flex;
  justify-content: center;
  transition: background 0.35s ${({ theme }) => theme.ease.out},
    border-color 0.35s ${({ theme }) => theme.ease.out};

  /* Transparent over the hero, then a solid glass bar once scrolled — so the
     nav never competes with the headline but stays readable over content. */
  background: ${({ $scrolled }) => ($scrolled ? "rgba(242, 235, 221, 0.88)" : "transparent")};
  backdrop-filter: ${({ $scrolled }) => ($scrolled ? "blur(16px) saturate(150%)" : "none")};
  -webkit-backdrop-filter: ${({ $scrolled }) => ($scrolled ? "blur(16px) saturate(150%)" : "none")};
  border-bottom: 1px solid
    ${({ $scrolled, theme }) => ($scrolled ? theme.border : "transparent")};
`;

const Container = styled.div`
  width: 100%;
  max-width: 1320px;
  height: ${({ $scrolled }) => ($scrolled ? "68px" : "84px")};
  padding: 0 24px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20px;
  transition: height 0.35s ${({ theme }) => theme.ease.out};

  @media (max-width: 640px) {
    padding: 0 18px;
  }
`;

const Brand = styled.a`
  display: flex;
  align-items: center;
  gap: 12px;
  flex-shrink: 0;
`;

const Monogram = styled.span`
  display: grid;
  place-items: center;
  width: 38px;
  height: 38px;
  border-radius: 11px;
  background: ${({ theme }) => theme.gradient.accent};
  color: ${({ theme }) => theme.parchment};
  font-family: ${({ theme }) => theme.font.mono};
  font-size: 14px;
  font-weight: 700;
  letter-spacing: -0.02em;
  box-shadow: ${({ theme }) => theme.shadow.accent};
`;

const BrandText = styled.span`
  display: flex;
  flex-direction: column;
  line-height: 1.2;

  strong {
    font-family: ${({ theme }) => theme.font.display};
    font-size: 15px;
    font-weight: 600;
    color: ${({ theme }) => theme.text_primary};
  }
  small {
    font-family: ${({ theme }) => theme.font.mono};
    font-size: 10.5px;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    color: ${({ theme }) => theme.text_muted};
  }

  @media (max-width: 520px) {
    display: none;
  }
`;

const Menu = styled.nav`
  display: flex;
  align-items: center;
  gap: 2px;
  padding: 5px;
  border-radius: ${({ theme }) => theme.radius.pill};
  border: 1px solid ${({ theme }) => theme.border};
  background: rgba(247, 241, 228, 0.72);
  backdrop-filter: blur(10px);

  @media (max-width: 1024px) {
    display: none;
  }
`;

const MenuLink = styled.a`
  position: relative;
  padding: 9px 16px;
  border-radius: ${({ theme }) => theme.radius.pill};
  font-size: 14px;
  font-weight: 500;
  color: ${({ $active, theme }) => ($active ? theme.ink : theme.text_secondary)};
  transition: color 0.25s ${({ theme }) => theme.ease.out};

  &:hover {
    color: ${({ theme }) => theme.text_primary};
  }

  span {
    position: relative;
    z-index: 1;
  }
`;

const Pill = styled(motion.span)`
  position: absolute;
  inset: 0;
  border-radius: ${({ theme }) => theme.radius.pill};
  background: ${({ theme }) => theme.primary_dim};
  border: 1px solid ${({ theme }) => theme.border_accent};
  z-index: 0;
`;

const Actions = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  flex-shrink: 0;
`;

const IconLink = styled.a`
  display: grid;
  place-items: center;
  width: 40px;
  height: 40px;
  border-radius: 12px;
  border: 1px solid ${({ theme }) => theme.border};
  background: rgba(36, 29, 19, 0.02);
  color: ${({ theme }) => theme.text_secondary};
  transition: all 0.25s ${({ theme }) => theme.ease.out};

  svg {
    font-size: 19px;
  }

  &:hover {
    color: ${({ theme }) => theme.bronze};
    border-color: ${({ theme }) => theme.border_accent};
    background: ${({ theme }) => theme.primary_dim};
  }

  @media (max-width: 1024px) {
    display: none;
  }
`;

const ResumeCta = styled.a`
  display: inline-flex;
  align-items: center;
  gap: 7px;
  height: 40px;
  padding: 0 18px;
  border-radius: ${({ theme }) => theme.radius.pill};
  background: ${({ theme }) => theme.text_primary};
  color: ${({ theme }) => theme.bg};
  font-size: 14px;
  font-weight: 600;
  transition: all 0.25s ${({ theme }) => theme.ease.out};

  svg {
    font-size: 15px;
  }

  &:hover {
    background: ${({ theme }) => theme.primary};
    color: ${({ theme }) => theme.parchment};
  }

  @media (max-width: 1024px) {
    display: none;
  }
`;

const Burger = styled.button`
  display: none;
  place-items: center;
  width: 42px;
  height: 42px;
  border-radius: 12px;
  border: 1px solid ${({ theme }) => theme.border};
  background: rgba(36, 29, 19, 0.03);
  color: ${({ theme }) => theme.text_primary};
  cursor: pointer;

  @media (max-width: 1024px) {
    display: grid;
  }
`;

const Drawer = styled(motion.div)`
  position: fixed;
  inset: 0;
  z-index: 1150;
  background: rgba(242, 235, 221, 0.985);
  backdrop-filter: blur(20px);
  display: flex;
  flex-direction: column;
  padding: 96px 28px 40px;
  gap: 4px;
  overflow-y: auto;
`;

const DrawerLink = styled(motion.a)`
  display: flex;
  align-items: baseline;
  gap: 14px;
  padding: 15px 4px;
  border-bottom: 1px solid ${({ theme }) => theme.border};
  font-family: ${({ theme }) => theme.font.display};
  font-size: 25px;
  font-weight: 500;
  color: ${({ theme }) => theme.text_primary};

  em {
    font-family: ${({ theme }) => theme.font.mono};
    font-size: 12px;
    font-style: normal;
    color: ${({ theme }) => theme.primary};
  }
`;

const DrawerFoot = styled.div`
  margin-top: auto;
  display: flex;
  gap: 12px;
  padding-top: 28px;

  a {
    flex: 1;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    min-height: 50px;
    border-radius: ${({ theme }) => theme.radius.md};
    border: 1px solid ${({ theme }) => theme.border};
    color: ${({ theme }) => theme.text_primary};
    font-size: 14px;
    font-weight: 600;
  }
`;

const CloseBtn = styled.button`
  position: absolute;
  top: 22px;
  right: 22px;
  display: grid;
  place-items: center;
  width: 42px;
  height: 42px;
  border-radius: 12px;
  border: 1px solid ${({ theme }) => theme.border};
  background: transparent;
  color: ${({ theme }) => theme.text_primary};
  cursor: pointer;
`;

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(navLinks[0].id);
  const location = useLocation();
  const navigate = useNavigate();
  const onBlog = location.pathname.startsWith("/blog");

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Scroll-spy via IntersectionObserver rather than measuring offsets on every
  // scroll frame — it stays correct when sections resize or images load late.
  //
  // Navbar lives outside <Routes> and never unmounts, but Home's sections are
  // lazy-loaded and get torn down and rebuilt every time the route leaves and
  // returns to "/" — so this has to re-run on every navigation to Home, and
  // retry for a moment on each run since the target elements may not exist
  // yet when a lazy chunk is still loading.
  useEffect(() => {
    if (location.pathname !== "/") return undefined;

    let observer;
    let timer;
    let attempts = 0;
    let cancelled = false;

    const setup = () => {
      if (cancelled) return;
      const sections = navLinks.map((l) => document.getElementById(l.id)).filter(Boolean);
      if (sections.length < navLinks.length && attempts < 40) {
        attempts += 1;
        timer = setTimeout(setup, 150);
        return;
      }
      if (!sections.length) return;

      observer = new IntersectionObserver(
        (entries) => {
          const visible = entries
            .filter((e) => e.isIntersecting)
            .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
          if (visible) setActive(visible.target.id);
        },
        { rootMargin: "-45% 0px -50% 0px", threshold: [0, 0.25, 0.5, 1] }
      );
      sections.forEach((s) => observer.observe(s));
    };

    setup();
    return () => {
      cancelled = true;
      clearTimeout(timer);
      observer?.disconnect();
    };
  }, [location.pathname]);

  // A drawer that lets the page scroll behind it feels broken, and Escape must close it.
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    const onKey = (e) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  // Anchors only exist on Home. From any other route, navigate to Home with
  // the hash attached — Home's own scroll-to-hash effect finishes the job
  // once its lazy sections have mounted.
  const go = useCallback(
    (e, href) => {
      e.preventDefault();
      setOpen(false);
      if (location.pathname !== "/") {
        navigate("/" + href);
        return;
      }
      const el = document.querySelector(href);
      if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
    },
    [location.pathname, navigate]
  );

  return (
    <>
      <Nav
        $scrolled={scrolled}
        initial={{ y: -90 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      >
        <Container $scrolled={scrolled}>
          <Brand
            as={Link}
            to="/"
            onClick={() => setOpen(false)}
            aria-label="Ashish Maurya, back to top"
          >
            <Monogram>AM</Monogram>
            <BrandText>
              <strong>Ashish Maurya</strong>
              <small>{Bio.title}</small>
            </BrandText>
          </Brand>

          <Menu aria-label="Section navigation">
            {navLinks.map((link) => (
              <MenuLink
                key={link.id}
                href={link.href}
                $active={active === link.id}
                aria-current={active === link.id ? "true" : undefined}
                onClick={(e) => go(e, link.href)}
              >
                {active === link.id && (
                  <Pill
                    layoutId="nav-pill"
                    transition={{ type: "spring", stiffness: 380, damping: 32 }}
                  />
                )}
                <span>{link.label}</span>
              </MenuLink>
            ))}
            <MenuLink as={Link} to="/blog" $active={onBlog} aria-current={onBlog ? "true" : undefined}>
              {onBlog && (
                <Pill
                  layoutId="nav-pill"
                  transition={{ type: "spring", stiffness: 380, damping: 32 }}
                />
              )}
              <span>Blog</span>
            </MenuLink>
          </Menu>

          <Actions>
            <Magnetic strength={0.25}>
              <IconLink href={Bio.github} target="_blank" rel="noreferrer" aria-label="GitHub profile">
                <GitHub />
              </IconLink>
            </Magnetic>
            <Magnetic strength={0.25}>
              <IconLink href={Bio.linkedin} target="_blank" rel="noreferrer" aria-label="LinkedIn profile">
                <LinkedIn />
              </IconLink>
            </Magnetic>
            <Magnetic strength={0.2}>
              <ResumeCta href={Bio.resume} target="_blank" rel="noreferrer">
                Resume <ArrowOutward />
              </ResumeCta>
            </Magnetic>
            <Burger onClick={() => setOpen(true)} aria-label="Open navigation menu" aria-expanded={open}>
              <MenuRounded />
            </Burger>
          </Actions>
        </Container>
      </Nav>

      <AnimatePresence>
        {open && (
          <Drawer
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.28 }}
            role="dialog"
            aria-modal="true"
            aria-label="Navigation menu"
          >
            <CloseBtn onClick={() => setOpen(false)} aria-label="Close navigation menu">
              <Close />
            </CloseBtn>
            {navLinks.map((link, i) => (
              <DrawerLink
                key={link.id}
                href={link.href}
                onClick={(e) => go(e, link.href)}
                initial={{ opacity: 0, x: -18 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.05 + i * 0.05 }}
              >
                <em>{String(i + 1).padStart(2, "0")}</em>
                {link.label}
              </DrawerLink>
            ))}
            <DrawerLink
              as={Link}
              to="/blog"
              onClick={() => setOpen(false)}
              initial={{ opacity: 0, x: -18 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.05 + navLinks.length * 0.05 }}
            >
              <em>{String(navLinks.length + 1).padStart(2, "0")}</em>
              Blog
            </DrawerLink>
            <DrawerFoot>
              <a href={Bio.github} target="_blank" rel="noreferrer">
                <GitHub fontSize="small" /> GitHub
              </a>
              <a href={Bio.linkedin} target="_blank" rel="noreferrer">
                <LinkedIn fontSize="small" /> LinkedIn
              </a>
            </DrawerFoot>
          </Drawer>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;
