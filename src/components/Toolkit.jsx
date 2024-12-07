// components/Toolkit.jsx
import React from "react";
import styled from "styled-components";
import { motion } from "framer-motion";

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
    { name: "Proxmox", icon: "https://raw.githubusercontent.com/proxmox/pve-docs/refs/heads/master/images/proxmox-logo.svg" },
  ];

  return (
    <Section id="toolkit">"
      <Container>
        <Heading
          initial={{ opacity: 0, y: -50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          Toolkit 💻
        </Heading>
        <Grid>
          {tools.map((tool, index) => (
            <ToolCard
              key={index}
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
            >
              <Icon src={tool.icon} alt={`${tool.name} icon`} />
              <ToolName>{tool.name}</ToolName>
            </ToolCard>
          ))}
        </Grid>
      </Container>
    </Section>
  );
};

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
  text-align: center;
`;

const Heading = styled(motion.h2)`
  font-size: 2rem;
  margin-bottom: 4rem;
  color: #333;
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 2rem;

  @media (max-width: 768px) {
    gap: 1.5rem;
  }
`;

const ToolCard = styled(motion.div)`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 1.5rem;
  background: #fff;
  border-radius: 10px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease-in-out;

  &:hover {
    box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15);
    transform: translateY(-5px);
  }
`;

const Icon = styled.img`
  width: 160px;
  height: 64px;
  margin-bottom: 1rem;
`;

const ToolName = styled.p`
  font-size: 1rem;
  font-weight: 600;
  color: #555;
`;

export default Toolkit;
