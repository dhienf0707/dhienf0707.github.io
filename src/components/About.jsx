// components/About.jsx
import React from "react";
import styled from "styled-components";
import { motion } from "framer-motion";
import Container from "../styles/Container";

const About = () => {
  return (
    <Section id="about">
      <Container>
        <Heading
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          About Me 🐱‍💻
        </Heading>
        <Paragraph
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3, duration: 0.8 }}
        >
          I am a results-driven Full-Stack Developer with practical experience in designing and
          enhancing web applications using cutting-edge frameworks and technologies.
          I’m passionate about creating scalable, high-performance software solutions,
          with expertise spanning frontend and backend development, database management,
          and cloud-based deployments. My experience extends to machine learning, computer vision
          and robotic where I design and implement models to derive actionable insights and enhance
          application functionality. Beyond coding, I also have a strong interest and
          hands-on experience in hardware, networking, security, circuitry, and system administration.
        </Paragraph>
      </Container>
    </Section>
  );
};

const Section = styled.section`
  background: #fff;
  padding: 8rem 5rem;

  @media (max-width: 768px) {
    padding: 6rem 2rem; /* Reduce padding on smaller screens */
  }

  @media (max-width: 480px) {
    padding: 4rem 1rem; /* Further reduce padding on very small screens */
  }
`;

const Heading = styled(motion.h2)`
  font-size: 2rem;
  margin-bottom: 2rem;
  text-align: center;
  color: #333;
`;

const Paragraph = styled(motion.p)`
  font-size: 1.2rem;
  text-align: center;
  color: #555;
  line-height: 1.8;
`;

export default About;
