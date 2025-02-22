import React from "react";
import styled from "styled-components";

// Styled-components
const ProjectsSection = styled.section`
  padding: 4rem 2rem;
  background-color: #f1f3f5; // A slightly cooler, more neutral tone
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
    transform: scale(1.03);
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
  transition: transform 0.3s ease-in-out;

  ${ProjectCard}:hover & {
    transform: scale(1.1); /* Zoom effect on hover */
  }
`;

const ProjectInfo = styled.div`
  padding: 1.5rem;
`;

const ProjectTitle = styled.h3`
  font-size: 1.5rem;
  font-weight: bold;
  margin-bottom: 0.5rem;
`;

const ProjectDescription = styled.p`
  font-size: 1rem;
  margin-bottom: 1rem;
  color: #555;
`;

const ProjectToolkit = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-bottom: 2rem;
`;

const ToolkitItem = styled.span`
  font-size: 0.875rem;
  padding: 0.2rem 0.5rem;
  background-color: #f0f0f0;
  border-radius: 5px;
  color: #333;
`;

const ProjectLinks = styled.div`
    position: absolute;
    bottom: 0rem;
    margin-bottom: 1rem;
    a {
        margin-right: 1rem;
        text-decoration: none;
        color: #007bff;
        font-weight: bold;

        &:hover {
        text-decoration: underline;
        }
    }
`;

const Projects = () => {
    const projects = [
        {
            title: "Autoclicker Microservice",
            description: "Designed and implemented a scalable multi-threaded system to automate decentralized exchange (DeFi) trades using Selenium for browser automation. Engineered a Python FastAPI backend to transform scripts into an API server, enabling dynamic task queuing and execution. Integrated Eureka service discovery for seamless microservice coordination. Developed a TypeScript-based ViteJS frontend for intuitive task management and real-time interaction with backend services.",
            toolkit: ["Python", "FastAPI", "Selenium", "Eureka", "TypeScript"],
            image: "/images/autoclicker.gif",
        },
        {
            title: "My Portfolio",
            description: "The thing that you are looking at right now 😁. This is a portfolio website that I built using ReactJS for client side and NextJS for server side. It is hosted on Vercel and uses Notion API to fetch my Blog posts and projects data.",
            toolkit: ["ReactJS", "NextJS", "Vercel", "CI/CD", "Notion API", "Redis", "Azure Blobs"],
            image: "/images/portfolio.gif",
            "View Live": "https://jerry-nguyen.vercel.app/",
            github: "https://github.com/dhienf0707/dhienf0707.github.io",
        },
        {
            title: "Covid 19 GIS",
            description: "Covid 19 Geographic Information System with Restful API server",
            toolkit: ["React", "Node.js", "MongoDB", "ExpressJS", "RESTful API", "CI/CD", "Vercel", "Redis", "Azure Blobs"],
            image: "/images/covid19.gif",
            "View Live": "https://covid19-gis.vercel.app/",
            github: "https://github.com/meowlearning/covid19-gis",
        },
        {
            title: "Product Mapping",
            description: "Product Mapping - Explore eBay products, track popularity, and analyze availability effortlessly!",
            toolkit: ["Node.js", "WebSocket", "Express.js", "pugjs", "Vercel", "Azure redis", "Azure Blobs"],
            image: "/images/mashup-api.gif",
            "View Live": "https://mashup-api.vercel.app/",
            github: "https://github.com/dhienf0707/Mashup_API",
        },
        {
            title: "Wireguard Server with IPv4/IPv6 on Oracle",
            description: "Customized Wireguard VPN Server on Oracle to bypass CGNAT problem and provide full access to IPv6",
            toolkit: ["VLAN", "Routing", "Subnetting", "NDP", "Oracle Cloud"],
            image: "/images/wireguard-server.webp",
            Blog: "/Blog/wireguard-server",
        },
        {
            title: "Password Store",
            description: "Password Manager using git, gpg and Yubikey to store and encrypt passwords",
            toolkit: ["git", "gpg", "bash", "zsh", "security"],
            image: "/images/password-store.gif",
            Blog: "/Blog/password-store",
        },
        {
            title: "Process Overseer",
            description: "An ssh-alike program for executing and controlling server processes through client terminal by using socket programming with the help of cmake.",
            toolkit: ["C", "System Programming", "Linux", "Cmake", "Socket Programming", "Parallelization"],
            image: "/images/process-overseer.gif",
            github: "https://github.com/dhienf0707/process_overseer",
        },
        {
            title: "Link Aggregation",
            description: "Customized link aggregation and load balancing between 5G and Fibre network using a custom OpenWrt firmware to enhance network performance in rural areas",
            toolkit: ["Link Aggregation", "Load Balancing", "OpenWRT", "Raspberry Pi", "Oracle Cloud"],
            image: '/images/link-aggregation.png',
            Reference: "https://kamrul.dev/aggregate-multiple-internet-with-openmptcprouter/?fbclid=IwAR2klfC550FzcrxhyMUhLEA8P6-JNN7qwt1gAQAmj1WhQqMOVhhAqTHSO1U",
        },
        {
            title: "ThinkPad T400 Modification",
            description: "Hardware modificiation to my Thinkpad T400 to enable Quad-core support, Wifi 6, NVMe Storage and 5G connection",
            toolkit: ["Soldering", "EEPROM Programming", "Bios Mod", "Coreboot"],
            image: '/images/t400.jpeg',
            Blog: "https://yourportfolio.com",
            github: "https://github.com/yourusername/portfolio",
        },
        {
            title: "AMD Radeon™ RX 7900 XTX Overclocking",
            description: "Push my GPU to the limit with extreme hardware overclocking using liquid metal, shunt mod and watercooling",
            toolkit: ["Watercooling", "EEPROM Programming", "Bios Mod", "Soldering", "Shunt mod"],
            image: '/images/7900xtx.jpg',
            Blog: "https://yourportfolio.com",
            github: "https://github.com/yourusername/portfolio",
        },
        {
            title: "Advanced Object Recognition",
            description: "Propose a new method for training an object classification machine learning model that is both cost-effective and highly accurate.",
            toolkit: ["TensorFlow", "DCNN", "Image Processing", "Data Analysis"],
            image: '/images/ml.gif',
            Blog: "https://yourportfolio.com",
            github: "https://github.com/yourusername/portfolio",
        },
    ];

    return (
        <ProjectsSection id="projects">
            <SectionTitle>Projects</SectionTitle>
            <ProjectsGrid>
                {projects.map((project, index) => (
                    <ProjectCard key={index}>
                        <ProjectImageContainer>
                            {project.image ? (
                                <ProjectImage src={project.image} alt={project.title} />
                            ) : null}
                        </ProjectImageContainer>
                        <ProjectInfo>
                            <ProjectTitle>{project.title}</ProjectTitle>
                            <ProjectDescription>{project.description}</ProjectDescription>
                            <ProjectToolkit>
                                {project.toolkit.map((tool, i) => (
                                    <ToolkitItem key={i}>{tool}</ToolkitItem>
                                ))}
                            </ProjectToolkit>
                            <ProjectLinks>
                                {Object.keys(project)[4] !== 'github' ? (
                                    <a href={project[(Object.keys(project)[4])]} target="_blank" rel="noopener noreferrer">
                                        {Object.keys(project)[4]}
                                    </a>
                                ) : null}
                                {project.github ? (
                                    <a href={project.github} target="_blank" rel="noopener noreferrer">
                                        GitHub
                                    </a>
                                ) : null}
                            </ProjectLinks>
                        </ProjectInfo>
                    </ProjectCard>
                ))}
            </ProjectsGrid>
        </ProjectsSection>
    );
};

export default Projects;
