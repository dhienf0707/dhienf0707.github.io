// App.js
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import GlobalStyles from "./styles/GlobalStyles";
import Header from "./components/Header";
import Hero from "./components/Hero";
import About from "./components/About";
import Toolkit from "./components/Toolkit";
import Projects from "./components/Projects";
import Contact from "./components/Contact";
import BlogList from "./components/Blog/BlogList";
import BlogPost from "./components/Blog/BlogPost";

const App = () => {
  return (
    <Router>
      <GlobalStyles />
      <Header />
      <Routes>
        <Route path="/" element={
          <>
            <Hero />
            <Projects />
            <About />
            <Toolkit />
            <Contact />
          </>
        } />
        <Route path="/blog" element={<BlogList />} />
        <Route path="/blog/:slug" element={<BlogPost />} />
      </Routes>
    </Router>
  );
};

export default App;
