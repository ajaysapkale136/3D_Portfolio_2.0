import React from "react";
import styled, { ThemeProvider } from "styled-components";
import { darkTheme } from "./utils/Themes";
import Navbar from "./components/Navbar";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Hero from "./components/sections/Hero";
import Skills from "./components/sections/Skills";
import Experience from "./components/sections/Experience";
import Education from "./components/sections/Education";
import Projects from "./components/sections/Projects";
import Contact from "./components/sections/Contact";
import Footer from "./components/sections/Footer";
import ChatWidget from "./components/chat/ChatWidget";
import AdminDashboard from "./components/admin/AdminDashboard";

const Body = styled.div`
  background:
    radial-gradient(circle at top left, rgba(34, 211, 238, 0.08), transparent 34%),
    radial-gradient(circle at 85% 18%, rgba(139, 92, 246, 0.12), transparent 30%),
    ${({ theme }) => theme.bg};
  width: 100%;
  overflow-x: hidden;
  position: relative;
`;

const Wrapper = styled.div`
  padding: 76px 0 100px;
  background: linear-gradient(
      38.73deg,
      rgba(34, 211, 238, 0.08) 0%,
      rgba(34, 211, 238, 0) 45%
    ),
    linear-gradient(
      141.27deg,
      rgba(139, 92, 246, 0) 52%,
      rgba(139, 92, 246, 0.1) 100%
    );
  width: 100%;
  clip-path: polygon(0 0, 100% 0, 100% 100%, 30% 98%, 0 100%);
`;

function PortfolioHome() {
  return (
    <>
      <Navbar />
      <Body>
        <div>
          <Hero />
          <Wrapper>
            <Skills />
            <Experience />
          </Wrapper>
          <Projects />
          <Wrapper>
            <Education />
            <Contact />
          </Wrapper>
          <Footer />
          <ChatWidget />
        </div>
      </Body>
    </>
  );
}

function App() {
  return (
    <ThemeProvider theme={darkTheme}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<PortfolioHome />} />
          <Route path="/admin" element={<AdminDashboard />} />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
