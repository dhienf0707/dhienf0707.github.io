// components/Hero.jsx
import React from "react";
import styled from "styled-components";
import { motion } from "framer-motion";

const Hero = () => {
  return (
    <Section id="hero">
      <HeroContainer>
        {/* Left Section: Description */}
        <Description>
          <HeroText
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
          >
            Hi, I'm <span>Jerry</span>.
          </HeroText>
          <SubText
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 1 }}
          >
            Full-Stack Developer crafting scalable and elegant solutions,
            with expertise spanning diverse fields such as machine learning,
            circuitry, networking, hardware and embedded system.
          </SubText>
        </Description>

        {/* Right Section: Profile Picture */}
        <ProfilePictureContainer
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.7, duration: 1 }}
        >
          <ProfilePicture
            src="/images/profile.png"
            alt="Profile of Duc Hien Nguyen"
          />
        </ProfilePictureContainer>
      </HeroContainer>
    </Section>
  );
};

const Section = styled.section`
  height: 100vh;
  display: flex;
  align-items: center;
  background: #f8f9fa;
  padding: 0 5rem;

  @media (max-width: 768px) {
    padding: 0 2rem;
    height: auto;
    flex-direction: column;
    text-align: center;
  }
`;

const HeroContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  max-width: 1200px;
  margin: 0 auto;
  width: 100%;

  @media (max-width: 768px) {
    flex-direction: column;
    gap: 2rem;
  }
`;

const Description = styled.div`
  flex: 1;

  @media (max-width: 768px) {
    flex: none;
  }
`;

const HeroText = styled(motion.h1)`
  font-size: 3.5rem;
  font-weight: bold;
  color: #333;

  span {
    color: #007bff;
  }

  @media (max-width: 768px) {
    font-size: 2.5rem;
  }
`;

const SubText = styled(motion.p)`
  font-size: 1.25rem;
  margin-top: 1rem;
  color: #555;

  @media (max-width: 768px) {
    font-size: 1rem;
  }
`;

const ProfilePictureContainer = styled(motion.div)`
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;

  @media (max-width: 768px) {
    flex: none;
    margin-top: 2rem;
  }
`;

const ProfilePicture = styled.img`
  width: 300px;
  height: 300px;
  border-radius: 50%; /* Circular image */
  object-fit: cover;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);

  @media (max-width: 768px) {
    width: 200px;
    height: 200px;
  }
`;

export default Hero;
