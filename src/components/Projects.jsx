import React from "react";
import styled from "styled-components";

// Styled-components
const ProjectsSection = styled.section`
  padding: 4rem 2rem;
  background-color: #f8f8f8;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const SectionTitle = styled.h2`
  font-size: 2.5rem;
  text-align: center;
  margin-bottom: 3rem;
  font-weight: bold;
`;

const ProjectsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 20px;
  width: 100%;
  max-width: 1200px;
`;

const ProjectCard = styled.div`
  position: relative;
  overflow: hidden;
  border-radius: 10px;
  background-color: white;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease-in-out;
  cursor: pointer;

  &:hover {
    transform: scale(1.07); /* Larger scaling on hover */
  }

  &:hover .info {
    opacity: 1;
    transform: translateY(0);
  }

  &:hover img {
    transform: scale(1.3); /* Larger image scaling */
  }
`;

const ProjectImageContainer = styled.div`
  width: 100%;
  aspect-ratio: 16 / 9; /* Ensures consistent aspect ratio */
  overflow: hidden;
  position: relative;
`;

const ProjectImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
  transition: transform 0.5s ease-in-out;
`;

const ProjectInfo = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background: rgba(0, 0, 0, 0.8); /* Dark overlay */
  color: white;
  padding: 1.5rem;
  text-align: center;
  transition: all 0.4s ease-in-out;

  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  /* Show title by default */
  & ${ProjectTitle} {
    opacity: 1;
    transform: translateY(0);
  }

  /* Hide other content initially */
  & > *:not(${ProjectTitle}) {
    opacity: 0;
    transform: translateY(20px);
    transition: all 0.4s ease-in-out;
  }

  /* Show other content on hover */
  .info:hover & > *:not(${ProjectTitle}) {
    opacity: 1;
    transform: translateY(0);
  }
`;

const ProjectTitle = styled.h3`
  font-size: 1.2rem;
  margin-bottom: 0.5rem;
`;

const ProjectDescription = styled.p`
  font-size: 0.9rem;
  margin-bottom: 1rem;
`;

const ToolkitContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 1rem;
  justify-content: center;
`;

const ToolkitItem = styled.span`
  font-size: 0.8rem;
  color: #fff;
  background-color: rgba(255, 255, 255, 0.1);
  padding: 4px 12px;
  border-radius: 15px;
  backdrop-filter: blur(5px);
  transition: all 0.3s ease;
  border: 1px solid rgba(255, 255, 255, 0.2);

  &:hover {
    background-color: rgba(255, 255, 255, 0.2);
    transform: translateY(-2px);
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
  }
`;

const ButtonContainer = styled.div`
  display: flex;
  gap: 10px;
`;

const Button = styled.a`
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 5px;
  font-size: 0.9rem;
  font-weight: bold;
  text-transform: uppercase;
  color: white;
  text-decoration: none;
  background-color: #007bff; /* Blue button */
  transition: background-color 0.3s ease;

  &:hover {
    background-color: #0056b3; /* Darker blue on hover */
  }
`;

const Projects = () => {
    const projects = [
        {
            title: "Covid 19 GIS",
            description: "Covid 19 Geographic Information System with Restful API server",
            toolkit: ["React", "Node.js", "MongoDB", "ExpressJS", "RESTful API"],
            image: "/images/covid19.gif",
            liveLink: "https://covid19-data-visualization.onrender.com/   ",
            githubLink: "https://github.com/meowlearning/covid19-gis",
        },
        {
            title: "Wireguard Server with IPV4/IPV6 on Oracle",
            description: "A personal portfolio website showcasing my projects and skills.",
            toolkit: ["React", "Styled", "Components"],
            image: "/images/portfolio.jpg",
            liveLink: "https://yourportfolio.com",
            githubLink: "https://github.com/yourusername/portfolio",
        },
        {
            title: "Product Mapping",
            description: "Product Mapping - Explore eBay products, track popularity, and analyze availability effortlessly!",
            toolkit: ["Node.js", "WebSocket", "Express.js", "pugjs", "azure redis", "azure blobs"],
            image: "/images/mashup-api.gif",
            liveLink: "https://chatapp-demo.com",
            githubLink: "https://github.com/dhienf0707/Mashup_API",
        },
    ];

  return (
    <ProjectsSection>
      <SectionTitle>Projects</SectionTitle>
      <ProjectsGrid>
        {projects.map((project) => (
          <ProjectCard key={project.id}>
            <ProjectImageContainer>
              <ProjectImage src={project.image} alt={project.title} />
              <ProjectInfo className="info">
                <ProjectTitle>{project.title}</ProjectTitle>
                <ProjectDescription>{project.description}</ProjectDescription>
                <ToolkitContainer>
                  {project.toolkit.map((tool, index) => (
                    <ToolkitItem key={index}>{tool}</ToolkitItem>
                  ))}
                </ToolkitContainer>
                <ButtonContainer>
                  <Button href={project.liveLink} target="_blank">
                    View Live
                  </Button>
                  <Button href={project.githubLink} target="_blank">
                    GitHub
                  </Button>
                </ButtonContainer>
              </ProjectInfo>
            </ProjectImageContainer>
          </ProjectCard>
        ))}
      </ProjectsGrid>
    </ProjectsSection>
  );
};

export default Projects;
