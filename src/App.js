// App.js
import React from "react";
import GlobalStyles from "./styles/GlobalStyles";
import Header from "./components/Header";
import Hero from "./components/Hero";
import About from "./components/About";
import Toolkit from "./components/Toolkit";
import Projects from "./components/Projects";
import Contact from "./components/Contact";

const App = () => {
  return (
    <>
      <GlobalStyles />
      <Header />
      <Hero />
      <Projects />
      <About />
      <Toolkit />
      <Contact />
    </>
  );
};

export default App;
