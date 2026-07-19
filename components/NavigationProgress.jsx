"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import styled, { keyframes } from "styled-components";

function isInternalNavigationLink(anchor, pathname) {
  if (!anchor || anchor.target === "_blank") return false;

  const href = anchor.getAttribute("href");
  if (!href || href.startsWith("#") || href.startsWith("mailto:")) return false;
  if (href.startsWith("http") && !href.startsWith(window.location.origin)) {
    return false;
  }

  try {
    const nextPath = new URL(href, window.location.origin).pathname;
    return nextPath !== pathname;
  } catch {
    return false;
  }
}

export default function NavigationProgress() {
  const pathname = usePathname();
  const [visible, setVisible] = useState(false);
  const showTimerRef = useRef(null);

  useEffect(() => {
    setVisible(false);
    if (showTimerRef.current) {
      clearTimeout(showTimerRef.current);
      showTimerRef.current = null;
    }
  }, [pathname]);

  useEffect(() => {
    const startNavigation = () => {
      if (showTimerRef.current) {
        clearTimeout(showTimerRef.current);
      }
      showTimerRef.current = setTimeout(() => setVisible(true), 120);
    };

    const handleClick = (event) => {
      const anchor = event.target.closest("a[href]");
      if (!isInternalNavigationLink(anchor, pathname)) return;
      startNavigation();
    };

    document.addEventListener("click", handleClick, true);
    return () => {
      document.removeEventListener("click", handleClick, true);
      if (showTimerRef.current) {
        clearTimeout(showTimerRef.current);
      }
    };
  }, [pathname]);

  if (!visible) return null;

  return (
    <>
      <Bar aria-hidden="true" />
      <Overlay aria-live="polite" aria-busy="true">
        <Spinner aria-hidden="true" />
        <OverlayText>Loading page…</OverlayText>
      </Overlay>
    </>
  );
}

const slide = keyframes`
  0% {
    transform: translateX(-100%);
  }
  100% {
    transform: translateX(250%);
  }
`;

const spin = keyframes`
  to {
    transform: rotate(360deg);
  }
`;

const Bar = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: 3px;
  z-index: 1000;
  overflow: hidden;
  background: rgba(0, 123, 255, 0.15);

  &::after {
    content: "";
    position: absolute;
    inset: 0;
    width: 40%;
    background: #007bff;
    animation: ${slide} 1.1s ease-in-out infinite;
  }
`;

const Overlay = styled.div`
  position: fixed;
  inset: 0;
  z-index: 999;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  background: rgba(255, 255, 255, 0.72);
  backdrop-filter: blur(2px);
  pointer-events: none;
`;

const Spinner = styled.div`
  width: 2.25rem;
  height: 2.25rem;
  border: 3px solid rgba(0, 123, 255, 0.2);
  border-top-color: #007bff;
  border-radius: 50%;
  animation: ${spin} 0.7s linear infinite;
`;

const OverlayText = styled.p`
  margin: 0;
  font-size: 0.95rem;
  font-weight: 600;
  color: #333;
`;
