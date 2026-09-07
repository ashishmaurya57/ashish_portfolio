import React from "react";
import styled from "styled-components";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowOutward } from "@mui/icons-material";
import { blogPosts } from "../data/constants";
import { SectionShell, SectionInner } from "../components/ui/Section";
import PageHeader from "../components/ui/PageHeader";
import { stagger, fadeInUp, viewportOnce } from "../utils/motion";

/*
 * The index used to be hairline-separated rows on bare parchment, which meant
 * a single post read as a stray paragraph rather than as something to click.
 *
 * These are dark ink cards instead. The colour is not an arbitrary choice to
 * make them stand out: the post page itself (BlogPostHarness) is set on
 * `gradient.night` with candle text, so the card is a literal preview of what
 * the link opens. Every other card surface on the site is parchment, so the
 * blog reads as its own thing without introducing a colour the palette does
 * not already have.
 *
 * Contrast on the night ground, measured across the whole gradient
 * (#2D2416 at the top through #211A10 at the bottom):
 *   candle       #E8D9B5  10.9-12.3:1  titles, tag kicker
 *   candle_faint #B3A179   6.0-6.8:1   excerpt, date, arrow
 * Both clear AA at every point of the gradient. Sepia measures 3.2-3.7:1 on
 * this ground, so it is used for edges only and never for text.
 */

const List = styled(motion.div)`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

/* Wrapper exists purely to carry the stagger variant — the card itself is the
   <a>, so the whole surface is one hit target rather than just the title. */
const PostRow = styled(motion.article)`
  display: flex;
`;

const CARD_EDGE = "rgba(179, 161, 121, 0.22)";
const CARD_EDGE_HOVER = "rgba(232, 217, 181, 0.45)";

const PostLink = styled(Link)`
  position: relative;
  flex: 1;
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto;
  align-items: center;
  gap: 28px;
  padding: 34px 36px;
  border-radius: ${({ theme }) => theme.radius.xl};
  background: ${({ theme }) => theme.gradient.night};
  border: 1px solid ${CARD_EDGE};
  box-shadow: ${({ theme }) => theme.shadow.md};
  overflow: hidden;
  transition: transform 0.35s ${({ theme }) => theme.ease.out},
    box-shadow 0.35s ${({ theme }) => theme.ease.out},
    border-color 0.35s ${({ theme }) => theme.ease.out};

  /* Accent spine. Starts as a stub and runs the full height on hover, which
     gives the card somewhere to go without moving any text. */
  &::before {
    content: "";
    position: absolute;
    left: 0;
    top: 0;
    bottom: 0;
    width: 3px;
    background: linear-gradient(
      to bottom,
      ${({ theme }) => theme.candle},
      ${({ theme }) => theme.sepia}
    );
    transform: scaleY(0.28);
    transform-origin: 50% 0;
    transition: transform 0.4s ${({ theme }) => theme.ease.out};
  }

  /* The same halftone screen the parchment uses, inverted — it keeps the dark
     card reading as printed stock rather than as a flat swatch. */
  &::after {
    content: "";
    position: absolute;
    inset: 0;
    pointer-events: none;
    background-image: radial-gradient(
      rgba(232, 217, 181, 0.14) 0.5px,
      transparent 0.5px
    );
    background-size: 5px 5px;
    opacity: 0.5;
  }

  &:hover,
  &:focus-visible {
    transform: translateY(-4px);
    border-color: ${CARD_EDGE_HOVER};
    box-shadow: ${({ theme }) => theme.shadow.lg};
  }

  &:hover::before,
  &:focus-visible::before {
    transform: scaleY(1);
  }

  @media (max-width: 640px) {
    grid-template-columns: minmax(0, 1fr);
    gap: 18px;
    padding: 26px 22px;
  }
`;

const PostBody = styled.div`
  position: relative; /* above the halftone layer */
  z-index: 1;
  display: flex;
  flex-direction: column;
  gap: 10px;
  min-width: 0;
`;

const Meta = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
  font-family: ${({ theme }) => theme.font.mono};
  font-size: 11px;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: ${({ theme }) => theme.candle};

  span {
    color: ${({ theme }) => theme.candle_faint};
    text-transform: none;
    letter-spacing: normal;
  }
`;

const PostTitle = styled.h2`
  font-size: clamp(22px, 3vw, 30px);
  font-weight: 600;
  line-height: 1.25;
  color: ${({ theme }) => theme.candle};
`;

const Excerpt = styled.p`
  font-size: 15px;
  line-height: 1.68;
  color: ${({ theme }) => theme.candle_faint};
  max-width: 62ch;
`;

const Arrow = styled(ArrowOutward)`
  position: relative;
  z-index: 1;
  flex-shrink: 0;
  font-size: 22px !important;
  color: ${({ theme }) => theme.candle_faint};
  transition: all 0.3s ${({ theme }) => theme.ease.out};

  ${PostLink}:hover & {
    color: ${({ theme }) => theme.candle};
    transform: translate(3px, -3px);
  }

  @media (max-width: 640px) {
    justify-self: start;
  }
`;

const Empty = styled.p`
  padding: 40px 0;
  font-size: 15px;
  color: ${({ theme }) => theme.text_muted};
`;

const BlogPage = () => (
  <SectionShell as="main" id="main" $pattern="rules" style={{ paddingTop: "clamp(118px, 17vw, 148px)" }}>
    <SectionInner>
      <PageHeader
        eyebrow="Writing"
        title="Blog"
        description="Longer technical write-ups — architecture, trade-offs, and how the systems on the Projects page actually work underneath."
      />

      {blogPosts.length === 0 ? (
        <Empty>Nothing published yet — check back soon.</Empty>
      ) : (
        <List
          variants={stagger(0.08)}
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
        >
          {blogPosts.map((post) => (
            <PostRow key={post.slug} variants={fadeInUp}>
              <PostLink to={`/blog/${post.slug}`}>
                <PostBody>
                  <Meta>
                    {post.tag}
                    <span>
                      {post.readTime} · {post.updated}
                    </span>
                  </Meta>
                  <PostTitle>{post.title}</PostTitle>
                  <Excerpt>{post.excerpt}</Excerpt>
                </PostBody>
                <Arrow />
              </PostLink>
            </PostRow>
          ))}
        </List>
      )}
    </SectionInner>
  </SectionShell>
);

export default BlogPage;
