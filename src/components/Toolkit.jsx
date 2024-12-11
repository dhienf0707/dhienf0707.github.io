import React from "react";
import styled, { keyframes } from "styled-components";

const Section = styled.section`
  padding: 8rem 5rem;
  background: #f8f9fa;

  @media (max-width: 768px) {
    padding: 6rem 2rem;
  }
`;

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
`;

const Heading = styled.h2`
  font-size: 2rem;
  margin-bottom: 4rem;
  text-align: center;
  color: #333;
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 2rem;

  @media (max-width: 768px) {
    gap: 1.5rem;
  }
`;

const fadeInUp = keyframes`
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const ToolCard = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 1.5rem;
  background: #fff;
  border-radius: 10px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease-in-out;
  overflow: hidden;
  animation: ${fadeInUp} 0.6s ease-out forwards;
  animation-delay: ${props => props.index * 0.1}s;
  opacity: 0;

  &:hover {
    transform: translateY(-10px);
    box-shadow: 0 10px 20px rgba(0, 0, 0, 0.2);
  }

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(255, 255, 255, 0.9);
    transform: translateY(100%);
    transition: transform 0.3s ease-in-out;
  }

  &:hover::before {
    transform: translateY(0);
  }

  @media (max-width: 768px) {
    &:hover {
      transform: none;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    }

    &::before {
      display: none;
    }
  }
`;

const Icon = styled.img`
  width: 80px;
  height: 80px;
  margin-bottom: 1rem;
  transition: all 0.3s ease-in-out;
  z-index: 1;

  ${ToolCard}:hover & {
    transform: translateY(-20px);
  }

  @media (max-width: 768px) {
    ${ToolCard}:hover & {
      transform: none;
    }
  }
`;

const ToolName = styled.p`
  font-size: 1rem;
  font-weight: 600;
  color: #555;
  transition: all 0.3s ease-in-out;
  z-index: 1;

  ${ToolCard}:hover & {
    transform: translateY(-20px);
  }

  @media (max-width: 768px) {
    ${ToolCard}:hover & {
      transform: none;
    }
  }
`;

const Toolkit = () => {
  const tools = [
    { name: "React", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg" },
    { name: "jQuery", icon: "https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/jquery.svg" },
    { name: "Node.js", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg" },
    { name: "JavaScript", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg" },
    { name: "Python", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg" },
    { name: "C", icon: "https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/c.svg" },
    { name: "C#", icon: "https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/csharp.svg" },
    { name: "C++", icon: "https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/cplusplus.svg" },
    { name: "Java", icon: "https://api.iconify.design/logos:java.svg" },
    { name: "Matlab", icon: "https://upload.wikimedia.org/wikipedia/commons/2/21/Matlab_Logo.png" },
    { name: "R", icon: "https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/r.svg" },
    { name: "TensorFlow", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/tensorflow/tensorflow-original.svg" },
    { name: "Keras", icon: "https://upload.wikimedia.org/wikipedia/commons/a/ae/Keras_logo.svg" },
    { name: "OpenCV", icon: " https://cdn.jsdelivr.net/gh/devicons/devicon/icons/opencv/opencv-original.svg" },
    { name: "Docker", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/docker/docker-original.svg" },
    { name: "AWS", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/amazonwebservices/amazonwebservices-original-wordmark.svg" },
    { name: "Azure", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/azure/azure-original.svg" },
    { name: "MongoDB", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mongodb/mongodb-original.svg" },
    { name: "MySQL", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mysql/mysql-original.svg" },
    { name: "Git", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/git/git-original.svg" },
    { name: "VMware", icon: "https://upload.wikimedia.org/wikipedia/commons/9/9a/Vmware.svg" },
    { name: "Proxmox", icon: "https://www.svgrepo.com/download/342139/proxmox.svg" },
  ];

  return (
    <Section id="toolkit">
      <Container>
        <Heading>Toolkit 💻</Heading>
        <Grid>
          {tools.map((tool, index) => (
            <ToolCard key={index} index={index}>
              <Icon src={tool.icon} alt={`${tool.name} icon`} />
              <ToolName>{tool.name}</ToolName>
            </ToolCard>
          ))}
        </Grid>
      </Container>
    </Section>
  );
};

export default Toolkit;

