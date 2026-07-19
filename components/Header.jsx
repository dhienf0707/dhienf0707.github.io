"use client";

import React, { useState, useEffect } from "react";
import styled from "styled-components";
import Link from "next/link";
import { Link as ScrollLink } from "react-scroll";
import { usePathname } from "next/navigation";
import { useUser } from "@auth0/nextjs-auth0/client";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faIgloo } from "@fortawesome/free-solid-svg-icons";

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const isHomePage = pathname === "/";
  const { user, isLoading } = useUser();

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "auto";
  }, [isOpen]);

  const closeMenu = () => setIsOpen(false);

  const renderAuthControls = (onNavigate, { mobile = false } = {}) => {
    if (isLoading) return null;

    if (user) {
      return (
        <AuthButton
          as="a"
          href="/auth/logout"
          $variant="outline"
          $mobile={mobile}
          onClick={onNavigate}
        >
          Logout
        </AuthButton>
      );
    }

    return (
      <AuthButton
        as="a"
        href="/auth/login"
        $variant="solid"
        $mobile={mobile}
        onClick={onNavigate}
      >
        Login
      </AuthButton>
    );
  };

  return (
    <Nav>
      <Logo>
        <Link href="/" style={{ textDecoration: "none" }}>
          <FontAwesomeIcon icon={faIgloo} /> Home
        </Link>
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
            <NavItem as={Link} href="/blog">
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
            {renderAuthControls()}
          </>
        ) : (
          <>
            <NavItem as={Link} href="/">
              Home
            </NavItem>
            <NavItem as={Link} href="/blog">
              Blog
            </NavItem>
            {renderAuthControls()}
          </>
        )}
      </DesktopMenu>
      <Hamburger onClick={() => setIsOpen(!isOpen)}>
        <span className={isOpen ? "open" : ""} />
        <span className={isOpen ? "open" : ""} />
        <span className={isOpen ? "open" : ""} />
      </Hamburger>
      {isOpen && <Overlay onClick={closeMenu} />}
      <MobileMenu isopen={isOpen.toString()}>
        <CloseButton onClick={closeMenu}>&times;</CloseButton>
        <MobileMenuContent>
          {isHomePage ? (
            <>
              <NavItem
                as={ScrollLink}
                to="hero"
                smooth={true}
                duration={1500}
                onClick={closeMenu}
              >
                Hero
              </NavItem>
              <NavItem
                as={ScrollLink}
                to="projects"
                smooth={true}
                duration={1500}
                onClick={closeMenu}
              >
                Projects
              </NavItem>
              <NavItem as={Link} href="/blog" onClick={closeMenu}>
                Blog
              </NavItem>
              <NavItem
                as={ScrollLink}
                to="about"
                smooth={true}
                duration={1500}
                onClick={closeMenu}
              >
                About
              </NavItem>
              <NavItem
                as={ScrollLink}
                to="toolkit"
                smooth={true}
                duration={1500}
                onClick={closeMenu}
              >
                Toolkit
              </NavItem>
              <NavItem
                as={ScrollLink}
                to="contact"
                smooth={true}
                duration={1500}
                onClick={closeMenu}
              >
                Contact
              </NavItem>
              {renderAuthControls(closeMenu, { mobile: true })}
            </>
          ) : (
            <>
              <NavItem as={Link} href="/" onClick={closeMenu}>
                Home
              </NavItem>
              <NavItem as={Link} href="/blog" onClick={closeMenu}>
                Blog
              </NavItem>
              {renderAuthControls(closeMenu, { mobile: true })}
            </>
          )}
        </MobileMenuContent>
      </MobileMenu>
    </Nav>
  );
};

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

  a {
    color: #000;
    text-decoration: none;
  }
`;

const DesktopMenu = styled.div`
  display: flex;
  gap: 1.5rem;
  align-items: center;

  @media (max-width: 768px) {
    display: none;
  }
`;

const AuthButton = styled.a`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: ${({ $mobile }) => ($mobile ? "0.85rem 1.5rem" : "0.5rem 1rem")};
  border-radius: 6px;
  font-size: ${({ $mobile }) => ($mobile ? "1.25rem" : "0.95rem")};
  font-weight: 700;
  text-decoration: none;
  cursor: pointer;
  transition: background 0.2s ease, color 0.2s ease, border-color 0.2s ease;
  border: 2px solid
    ${({ $variant }) => ($variant === "solid" ? "#007bff" : "#333")};
  background: ${({ $variant }) =>
    $variant === "solid" ? "#007bff" : "transparent"};
  color: ${({ $variant, $mobile }) =>
    $variant === "solid" ? "#fff" : $mobile ? "#fff" : "#333"};

  ${({ $mobile, $variant }) =>
    $mobile &&
    $variant === "outline" &&
    `
    border-color: #fff;
    color: #fff;
  `}

  &:hover {
    background: ${({ $variant }) =>
      $variant === "solid" ? "#0069d9" : "#333"};
    color: #fff;
    border-color: ${({ $variant }) =>
      $variant === "solid" ? "#0069d9" : "#333"};
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
    display: flex;
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
  display: ${({ isopen }) => (isopen === "true" ? "flex" : "none")};
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
  align-items: center;
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
    color: #fff;
    font-size: 2rem;
  }
`;

export default Header;
