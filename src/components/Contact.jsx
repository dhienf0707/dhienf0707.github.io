import React, { useState } from "react";
import styled from "styled-components";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLinkedin, faTwitter, faGithub } from "@fortawesome/free-brands-svg-icons";
import emailjs from '@emailjs/browser'

// Styled components
const ContactContainer = styled.section`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 50px;
  background: #fff;
  color: #d17a7a;
`;

const ContentWrapper = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  max-width: 1100px;
  width: 100%;
  @media (max-width: 768px) {
    flex-direction: column;
    align-items: center;
  }
`;

const LeftSection = styled.div`
  flex: 1;
  text-align: left;
  padding: 20px;

  h2 {
    font-size: 2.5rem;
    margin-bottom: 10px;
    color: #333;
  }

  p {
    font-size: 1rem;
    line-height: 1.5;
    margin-bottom: 20px;
    color: #555;
  }

  a {
    margin-right: 15px;
    color: #d17a7a;
    font-size: 2rem;
    text-decoration: none;

    &:hover {
      color: #e56b6b;
    }
  }
`;

const RightSection = styled.div`
  flex: 1;
  padding: 20px;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
`;

const Input = styled.input`
    margin-bottom: 15px;
    padding: 10px;
    border: 1px solid #ccc;
    border-radius: 5px;
    font-size: 1rem;
    background-color: #fff;

    &:focus {
        outline: none;
        border-color: #007bff; /* Accent color for focus state */
    }
`;

const TextArea = styled.textarea`
    margin-bottom: 15px;
    padding: 10px;
    border: 1px solid #ccc;
    border-radius: 5px;
    font-size: 1rem;
    background-color: #fff;

    &:focus {
    outline: none;
    border-color: #007bff;
    }
`;

const Button = styled.button`
    padding: 10px 20px;
    background-color: #007bff; /* Accent color for button */
    color: white;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    font-size: 1rem;

    &:hover {
        background-color: #0056b3; /* Darker blue on hover */
    }
`;

const Footer = styled.div`
  margin-top: 30px;
  text-align: center;
  color: #0056b3;
  font-size: 0.9rem;

  a {
    color: #e56b6b;
    text-decoration: none;
  }
`;

const SocialIcons = styled.div`
  display: flex;
  margin-top: 20px;

  a {
    margin-right: 15px;
    font-size: 1.5rem;
    color: #555; /* Neutral color */
    transition: color 0.3s ease;

    &:hover {
      color: #007bff; /* Accent color on hover */
    }
  }
`;

const Contact = () => {
    const [loading, setLoading] = useState(false);
    const [statusMessage, setStatusMessage] = useState("");

    const handleSubmit = (e) => {
        e.preventDefault();
        const serviceId = process.env.REACT_APP_SERVICEID;
        const templateId = process.env.REACT_APP_TEMPLATEID;
        const userId = process.env.REACT_APP_USERID;
        setLoading(true);
        emailjs
            .sendForm(
                serviceId,
                templateId,
                e.target,
                userId
            )
            .then((result) => {
                console.log("Email sent successfully!", result);
                setStatusMessage("Message sent successfully!");
            })
            .catch(error => {
                console.log("Error sending email:", error);
                setStatusMessage("Failed to send message. Please try again.");
            })
        setLoading(false)
    };

    return (
        <ContactContainer id="contact">
            <ContentWrapper>
                <LeftSection>
                    <h2>Let's Connect! 💌</h2>
                    <p>
                        If you ever want to grab a coffee or bubble tea (virtually) or just
                        want a quick chat, you can find me on social media or send me a
                        message here!
                    </p>
                    <SocialIcons>
                        <a href="https://www.linkedin.com/in/jerry-nguyen-0a880116a/" target="_blank" rel="noopener noreferrer">
                        <FontAwesomeIcon icon={faLinkedin} />
                        </a>
                        <a href="https://x.com/JerryNg93744532" target="_blank" rel="noopener noreferrer">
                        <FontAwesomeIcon icon={faTwitter} />
                        </a>
                        <a href="https://github.com/dhienf0707" target="_blank" rel="noopener noreferrer">
                        <FontAwesomeIcon icon={faGithub} />
                        </a>
                    </SocialIcons>
                </LeftSection>
                <RightSection>
                    <Form onSubmit={handleSubmit}>
                        <Input
                            type="text"
                            name="name"
                            placeholder="Your Name"
                            required
                        />
                        <Input
                            type="email"
                            name="email"
                            placeholder="Your Email"
                            required
                        />
                        <TextArea
                            name="message"
                            placeholder="Your Message"
                            rows="5"
                            required
                        />
                        <Button type="submit" disabled={loading}>Send Message</Button>
                        {statusMessage && <p>{statusMessage}</p>}
                    </Form>
                </RightSection>
            </ContentWrapper>
            <Footer>
                Developed and designed with love ❤️ by Jerry
            </Footer>
        </ContactContainer>
    );
};

export default Contact;
