import React from "react";
import styled from "styled-components";
import { motion } from "framer-motion";
import { SchoolOutlined } from "@mui/icons-material";
import { education } from "../../data/constants";
import { SectionShell, SectionInner } from "../ui/Section";
import SectionHeading from "../ui/SectionHeading";
import { stagger, fadeInUp, viewportOnce } from "../../utils/motion";

/*
 * The degree carries the hiring signal; school results are supporting detail.
 * So the first record gets a full card and the rest collapse into compact rows
 * instead of three identical timeline entries competing for attention.
 */

const Layout = styled(motion.div)`
  display: grid;
  grid-template-columns: 1.35fr 1fr;
  gap: 20px;
  align-items: start;

  @media (max-width: 900px) {
    grid-template-columns: 1fr;
  }
`;

const Primary = styled(motion.article)`
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 32px;
  border-radius: ${({ theme }) => theme.radius.lg};
  background: ${({ theme }) => theme.gradient.surface};
  border: 1px solid ${({ theme }) => theme.border};
  overflow: hidden;

  &::before {
    content: "";
    position: absolute;
    inset: 0;
    background: ${({ theme }) => theme.gradient.accent_soft};
    opacity: 0.55;
    pointer-events: none;
  }

  > * {
    position: relative;
    z-index: 1;
  }

  @media (max-width: 640px) {
    padding: 24px 22px;
  }
`;

const Head = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 15px;
`;

const Crest = styled.div`
  display: grid;
  place-items: center;
  flex-shrink: 0;
  width: 52px;
  height: 52px;
  border-radius: 14px;
  overflow: hidden;
  background: ${({ theme }) => theme.primary_dim};
  border: 1px solid ${({ theme }) => theme.border_accent};
  color: ${({ theme }) => theme.primary};

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

const Degree = styled.h3`
  font-size: 19px;
  font-weight: 600;
  line-height: 1.35;
  color: ${({ theme }) => theme.text_primary};
`;

const School = styled.span`
  font-size: 14.5px;
  font-weight: 500;
  color: ${({ theme }) => theme.primary};
`;

const MetaRow = styled.div`
  display: flex;
  align-items: center;
  gap: 14px;
  flex-wrap: wrap;
  font-family: ${({ theme }) => theme.font.mono};
  font-size: 11.5px;
  letter-spacing: 0.05em;
  text-transform: uppercase;
  color: ${({ theme }) => theme.text_muted};
`;

const Grade = styled.span`
  display: inline-flex;
  align-items: center;
  padding: 4px 11px;
  border-radius: ${({ theme }) => theme.radius.pill};
  background: rgba(79, 107, 63, 0.09);
  border: 1px solid rgba(79, 107, 63, 0.3);
  color: ${({ theme }) => theme.emerald};
  font-weight: 600;
  letter-spacing: 0.04em;
`;

const Body = styled.p`
  font-size: 14.5px;
  line-height: 1.75;
  color: ${({ theme }) => theme.text_secondary};
`;

const Rows = styled.div`
  display: flex;
  flex-direction: column;
  gap: 14px;
`;

const Row = styled(motion.article)`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  padding: 20px 22px;
  border-radius: ${({ theme }) => theme.radius.md};
  background: rgba(36, 29, 19, 0.025);
  border: 1px solid ${({ theme }) => theme.border};
  transition: border-color 0.3s ${({ theme }) => theme.ease.out},
    transform 0.3s ${({ theme }) => theme.ease.out};

  &:hover {
    border-color: ${({ theme }) => theme.border_accent};
    transform: translateX(4px);
  }

  div {
    display: flex;
    flex-direction: column;
    gap: 4px;
    min-width: 0;
  }

  strong {
    font-size: 15px;
    font-weight: 600;
    color: ${({ theme }) => theme.text_primary};
  }

  span {
    font-size: 13px;
    color: ${({ theme }) => theme.text_muted};
  }
`;

const Education = () => {
  const [primary, ...rest] = education;

  return (
    <SectionShell id="education" $pattern="weave">
      <SectionInner>
        <SectionHeading
          eyebrow="Education"
          title="Academic"
          highlight="background"
          description="A computer science degree specialising in artificial intelligence, plus the schooling behind it."
        />

        <Layout
          variants={stagger(0.1)}
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
        >
          {primary && (
            <Primary variants={fadeInUp}>
              <Head>
                <Crest>
                  {primary.img ? (
                    <img src={primary.img} alt="" loading="lazy" referrerPolicy="no-referrer" />
                  ) : (
                    <SchoolOutlined />
                  )}
                </Crest>
                <div>
                  <Degree>{primary.degree}</Degree>
                  <School>{primary.school}</School>
                </div>
              </Head>
              <MetaRow>
                <span>{primary.date}</span>
                {primary.grade && <Grade>{primary.grade}</Grade>}
              </MetaRow>
              <Body>{primary.desc}</Body>
            </Primary>
          )}

          <Rows>
            {rest.map((item) => (
              <Row key={item.id} variants={fadeInUp}>
                <div>
                  <strong>{item.degree}</strong>
                  <span>{item.school}</span>
                  <span>{item.date}</span>
                </div>
                {item.grade && <Grade>{item.grade}</Grade>}
              </Row>
            ))}
          </Rows>
        </Layout>
      </SectionInner>
    </SectionShell>
  );
};

export default Education;
