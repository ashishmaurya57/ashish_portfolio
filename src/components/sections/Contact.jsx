import React, { useRef, useState } from "react";
import styled from "styled-components";
import { motion } from "framer-motion";
import emailjs from "@emailjs/browser";
import {
  MailOutline,
  CallOutlined,
  PlaceOutlined,
  CheckCircleOutline,
  ErrorOutline,
  GitHub,
  LinkedIn,
} from "@mui/icons-material";
import { Bio } from "../../data/constants";
import { SectionShell, SectionInner } from "../ui/Section";
import SectionHeading from "../ui/SectionHeading";
import { StatusBadge } from "../ui/Primitives";
import Reveal from "../ui/Reveal";
import { slideInLeft, slideInRight } from "../../utils/motion";

const SERVICE_ID = "service_tox7kqs";
const TEMPLATE_ID = "template_nv7k7mj";
const PUBLIC_KEY = "SybVGsYS52j2TfLbi";

const Layout = styled.div`
  display: grid;
  grid-template-columns: minmax(0, 0.9fr) minmax(0, 1.1fr);
  gap: 48px;
  align-items: start;

  @media (max-width: 900px) {
    grid-template-columns: minmax(0, 1fr);
    gap: 36px;
  }
`;

const Aside = styled.div`
  display: flex;
  flex-direction: column;
  gap: 26px;
`;

const Lede = styled.p`
  font-size: 16px;
  line-height: 1.75;
  color: ${({ theme }) => theme.text_secondary};
`;

const Direct = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const DirectRow = styled.a`
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 15px 18px;
  border-radius: ${({ theme }) => theme.radius.md};
  border: 1px solid ${({ theme }) => theme.border};
  background: rgba(36, 29, 19, 0.025);
  transition: all 0.28s ${({ theme }) => theme.ease.out};

  svg {
    flex-shrink: 0;
    font-size: 19px;
    color: ${({ theme }) => theme.primary};
  }

  div {
    display: flex;
    flex-direction: column;
    gap: 1px;
    min-width: 0;
  }
  small {
    font-family: ${({ theme }) => theme.font.mono};
    font-size: 10.5px;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    color: ${({ theme }) => theme.text_muted};
  }
  strong {
    font-size: 14.5px;
    font-weight: 500;
    color: ${({ theme }) => theme.text_primary};
    overflow-wrap: anywhere;
  }

  &:hover {
    border-color: ${({ theme }) => theme.border_accent};
    background: ${({ theme }) => theme.primary_dim};
  }
`;

const Socials = styled.div`
  display: flex;
  gap: 10px;
`;

const SocialBtn = styled.a`
  display: grid;
  place-items: center;
  width: 46px;
  height: 46px;
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

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 18px;
  padding: 32px;
  border-radius: ${({ theme }) => theme.radius.lg};
  background: ${({ theme }) => theme.gradient.surface};
  border: 1px solid ${({ theme }) => theme.border};
  box-shadow: ${({ theme }) => theme.shadow.md};

  @media (max-width: 640px) {
    padding: 24px 20px;
  }
`;

const Pair = styled.div`
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
  gap: 18px;

  @media (max-width: 560px) {
    grid-template-columns: minmax(0, 1fr);
  }
`;

const Field = styled.label`
  display: flex;
  flex-direction: column;
  gap: 8px;

  /* Visible label, not a placeholder-only field — the label has to survive
     the user starting to type. */
  span {
    font-family: ${({ theme }) => theme.font.mono};
    font-size: 11px;
    font-weight: 500;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    color: ${({ theme }) => theme.text_muted};
  }

  input,
  textarea {
    width: 100%;
    min-height: 48px;
    padding: 13px 15px;
    border-radius: ${({ theme }) => theme.radius.md};
    border: 1px solid ${({ theme }) => theme.border};
    background: rgba(255, 255, 255, 0.55);
    color: ${({ theme }) => theme.text_primary};
    font-family: ${({ theme }) => theme.font.body};
    font-size: 15px;
    outline: none;
    transition: border-color 0.25s ${({ theme }) => theme.ease.out},
      box-shadow 0.25s ${({ theme }) => theme.ease.out};
    resize: vertical;

    &::placeholder {
      color: ${({ theme }) => theme.text_muted};
      opacity: 0.7;
    }

    &:focus {
      border-color: ${({ theme }) => theme.primary};
      box-shadow: 0 0 0 3px rgba(107, 81, 44, 0.18);
    }
  }
`;

const Submit = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  min-height: 52px;
  margin-top: 4px;
  border: none;
  border-radius: ${({ theme }) => theme.radius.md};
  background: ${({ theme }) => theme.gradient.accent};
  color: ${({ theme }) => theme.parchment};
  font-family: ${({ theme }) => theme.font.body};
  font-size: 15px;
  font-weight: 700;
  cursor: pointer;
  box-shadow: ${({ theme }) => theme.shadow.accent};
  transition: all 0.25s ${({ theme }) => theme.ease.out};

  &:hover:not(:disabled) {
    box-shadow: 0 16px 40px -14px rgba(107, 81, 44, 0.5);
  }
  &:active:not(:disabled) {
    transform: scale(0.985);
  }
  &:disabled {
    opacity: 0.55;
    cursor: not-allowed;
  }
`;

const Status = styled(motion.p)`
  display: flex;
  align-items: center;
  gap: 9px;
  padding: 12px 15px;
  border-radius: ${({ theme }) => theme.radius.md};
  font-size: 13.5px;
  font-weight: 500;

  svg {
    font-size: 18px;
  }

  ${({ $ok, theme }) =>
    $ok
      ? `color: ${theme.emerald}; background: rgba(52,211,153,0.09); border: 1px solid rgba(52,211,153,0.28);`
      : `color: ${theme.rose}; background: rgba(248,113,113,0.09); border: 1px solid rgba(248,113,113,0.28);`}
`;

const Contact = () => {
  const formRef = useRef(null);
  const [state, setState] = useState("idle"); // idle | sending | sent | error

  const handleSubmit = (e) => {
    e.preventDefault();
    if (state === "sending") return;
    setState("sending");

    emailjs
      .sendForm(SERVICE_ID, TEMPLATE_ID, formRef.current, PUBLIC_KEY)
      .then(() => {
        setState("sent");
        // The previous version called form.current.result(), which is not a
        // function and threw before the form was ever cleared.
        formRef.current?.reset();
      })
      .catch(() => setState("error"));
  };

  return (
    <SectionShell id="contact" $tone="deep" $pattern="rings">
      <SectionInner>
        <SectionHeading
          eyebrow="Contact"
          title="Let us build something"
          highlight="together"
          description="Open to AI engineering, backend and software development roles. The fastest way to reach me is email — I reply to everything."
        />

        <Layout>
          <Reveal variants={slideInLeft}>
            <Aside>
              <StatusBadge>{Bio.availability}</StatusBadge>
              <Lede>
                Whether you are hiring, have a system that needs an AI layer, or just want
                to talk about retrieval architecture — send a note.
              </Lede>

              <Direct>
                <DirectRow href={`mailto:${Bio.email}`}>
                  <MailOutline />
                  <div>
                    <small>Email</small>
                    <strong>{Bio.email}</strong>
                  </div>
                </DirectRow>
                <DirectRow href={`tel:${Bio.Contact}`}>
                  <CallOutlined />
                  <div>
                    <small>Phone</small>
                    <strong>{Bio.Contact}</strong>
                  </div>
                </DirectRow>
                <DirectRow as="div">
                  <PlaceOutlined />
                  <div>
                    <small>Based in</small>
                    <strong>{Bio.location}</strong>
                  </div>
                </DirectRow>
              </Direct>

              <Socials>
                <SocialBtn href={Bio.github} target="_blank" rel="noreferrer" aria-label="GitHub">
                  <GitHub />
                </SocialBtn>
                <SocialBtn
                  href={Bio.linkedin}
                  target="_blank"
                  rel="noreferrer"
                  aria-label="LinkedIn"
                >
                  <LinkedIn />
                </SocialBtn>
              </Socials>
            </Aside>
          </Reveal>

          <Reveal variants={slideInRight}>
            <Form ref={formRef} onSubmit={handleSubmit} noValidate={false}>
              <Pair>
                <Field>
                  <span>Your name</span>
                  <input type="text" name="from_name" placeholder="Jane Doe" required />
                </Field>
                <Field>
                  <span>Your email</span>
                  <input type="email" name="from_email" placeholder="jane@company.com" required />
                </Field>
              </Pair>

              <Field>
                <span>Subject</span>
                <input type="text" name="subject" placeholder="Backend engineer role" required />
              </Field>

              <Field>
                <span>Message</span>
                <textarea
                  name="message"
                  rows={5}
                  placeholder="Tell me a little about what you are working on."
                  required
                />
              </Field>

              <Submit type="submit" disabled={state === "sending"}>
                {state === "sending" ? "Sending…" : "Send message"}
              </Submit>

              {/* Live region: status is announced, not just shown */}
              <div aria-live="polite">
                {state === "sent" && (
                  <Status $ok initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }}>
                    <CheckCircleOutline /> Message sent — I will get back to you shortly.
                  </Status>
                )}
                {state === "error" && (
                  <Status initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }}>
                    <ErrorOutline /> Something went wrong. Email me directly at {Bio.email}.
                  </Status>
                )}
              </div>
            </Form>
          </Reveal>
        </Layout>
      </SectionInner>
    </SectionShell>
  );
};

export default Contact;
