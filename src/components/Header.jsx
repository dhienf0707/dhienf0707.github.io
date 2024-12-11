// components/Header.jsx
import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { Link as ScrollLink } from "react-scroll";
import { Link as RouterLink, useLocation } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faIgloo } from '@fortawesome/free-solid-svg-icons';

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const isHomePage = location.pathname === "/";

  // Disable scrolling on the background when the menu is open
  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "auto";
  }, [isOpen]);

  const closeMenu = () => setIsOpen(false);

  return (
    <Nav>
      <Logo>
        <RouterLink style={{ textDecoration: 'none' }} to="/">
          <FontAwesomeIcon icon={faIgloo} /> Home
        </RouterLink>
      </Logo>
      <DesktopMenu>
        {isHomePage ? (
          <>
            <NavItem as={ScrollLink} to="hero" smooth={true} duration={1500}>
              Hero
            </NavItem>
            <NavItem as={ScrollLink} to="projects" smooth={true} duration={1500}>
              Projects
            </NavItem>
            <NavItem as={RouterLink} to="/blog">
              Blog
            </NavItem>
            <NavItem as={ScrollLink} to="about" smooth={true} duration={1500}>
              About
            </NavItem>
            <NavItem as={ScrollLink} to="toolkit" smooth={true} duration={1500}>
              Toolkit
            </NavItem>
            <NavItem as={ScrollLink} to="contact" smooth={true} duration={1500}>
              Contact
            </NavItem>
          </>
        ) : (
          <NavItem as={RouterLink} to="/">
            Home
          </NavItem>
        )}
      </DesktopMenu>
      <Hamburger onClick={() => setIsOpen(!isOpen)}>
        <span className={isOpen ? "open" : ""} />
        <span className={isOpen ? "open" : ""} />
        <span className={isOpen ? "open" : ""} />
      </Hamburger>
      {isOpen && <Overlay onClick={closeMenu} />}
      <MobileMenu isOpen={isOpen}>
        <CloseButton onClick={closeMenu}>&times;</CloseButton>
        <MobileMenuContent>
          {isHomePage ? (
            <>
              <NavItem as={ScrollLink} to="hero" smooth={true} duration={1500} onClick={closeMenu}>
                Hero
              </NavItem>
              <NavItem as={ScrollLink} to="projects" smooth={true} duration={1500} onClick={closeMenu}>
                Projects
              </NavItem>
              <NavItem as={RouterLink} to="/blog" onClick={closeMenu}>
                Blog
              </NavItem>
              <NavItem as={ScrollLink} to="about" smooth={true} duration={1500} onClick={closeMenu}>
                About
              </NavItem>
              <NavItem as={ScrollLink} to="toolkit" smooth={true} duration={1500} onClick={closeMenu}>
                Toolkit
              </NavItem>
              <NavItem as={ScrollLink} to="contact" smooth={true} duration={1500} onClick={closeMenu}>
                Contact
              </NavItem>
            </>
          ) : (
            <NavItem as={RouterLink} to="/" onClick={closeMenu}>
              Home
            </NavItem>
          )}
        </MobileMenuContent>
      </MobileMenu>
    </Nav>
  );
};

// Sticky navigation bar
const Nav = styled.nav`
  position: sticky;
  top: 0;
  z-index: 100;
  background: #fff;
  padding: 1rem 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
`;

const Logo = styled.h1`
  font-size: 1.5rem;
  color: #333;
`;

const DesktopMenu = styled.div`
  display: flex;
  gap: 1.5rem;

  @media (max-width: 768px) {
    display: none; /* Hide desktop menu on smaller screens */
  }
`;

const Hamburger = styled.div`
  display: none;
  flex-direction: column;
  cursor: pointer;

  span {
    height: 3px;
    width: 25px;
    background: #333;
    margin: 4px 0;
    transition: all 0.3s ease;

    &.open:nth-child(1) {
      transform: translateY(8px) rotate(45deg);
    }

    &.open:nth-child(2) {
      opacity: 0;
    }

    &.open:nth-child(3) {
      transform: translateY(-8px) rotate(-45deg);
    }
  }

  @media (max-width: 768px) {
    display: flex; /* Show hamburger menu on smaller screens */
  }
`;

const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  z-index: 98;
`;

const MobileMenu = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: #333;
  color: #fff;
  display: ${({ isOpen }) => (isOpen ? "flex" : "none")};
  justify-content: center;
  align-items: center;
  flex-direction: column;
  z-index: 99;
`;

const CloseButton = styled.button`
  position: absolute;
  top: 1.5rem;
  right: 1.5rem;
  font-size: 2rem;
  color: #fff;
  background: none;
  border: none;
  cursor: pointer;

  &:hover {
    color: #007bff;
  }
`;

const MobileMenuContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2rem;
`;

const NavItem = styled(ScrollLink)`
  font-size: 1rem;
  font-weight: bold;
  color: #333;
  cursor: pointer;
  transition: color 0.3s ease;
  text-decoration: none;

  &:hover {
    color: #007bff;
  }

  @media (max-width: 768px) {
    color: #fff; /* White text for mobile menu */
    font-size: 2rem; /* Larger font size for mobile menu */
  }
`;

export default Header;
