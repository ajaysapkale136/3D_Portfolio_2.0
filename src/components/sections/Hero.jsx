import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Tilt } from "react-tilt";
import styled from "styled-components";
import Typewriter from "typewriter-effect";
import { Bio } from "../../data/constants";
import { fetchBio } from "../../utils/api";
import HeroImg from "../../images/HeroImage2.jpg";
import {
  headContainerAnimation,
  headContentAnimation,
  headTextAnimation,
} from "../../utils/motion";
import StarCanvas from "../canvas/Stars";
import HeroBgAnimation from "../HeroBgAnimation";

const HeroContainer = styled.div`
  display: flex;
  justify-content: center;
  position: relative;
  min-height: calc(100vh - 80px);
  padding: 112px 30px 90px;
  z-index: 1;

  @media (max-width: 960px) {
    padding: 66px 16px;
  }

  @media (max-width: 640px) {
    padding: 32px 16px;
  }

  clip-path: polygon(0 0, 100% 0, 100% 100%, 70% 95%, 0 100%);
`;
const HeroInnerContainer = styled.div`
  position: relative;
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  max-width: 1180px;
  gap: 64px;

  @media (max-width: 960px) {
    flex-direction: column;
  }
`;
const HeroLeftContainer = styled.div`
  width: 100%;
  max-width: 640px;
  order: 1;
  @media (max-width: 960px) {
    order: 2;
    margin-bottom: 30px;
    display: flex;
    gap: 6px;
    flex-direction: column;
    align-items: center;
  }
`;
const HeroRightContainer = styled.div`
  width: 100%;
  order: 2;
  display: flex;
  justify-content: end;
  @media (max-width: 960px) {
    order: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    margin-bottom: 80px;
  }

  @media (max-width: 640px) {
    margin-bottom: 30px;
  }
`;

const Title = styled.div`
  font-weight: 800;
  font-size: 64px;
  color: ${({ theme }) => theme.text_primary};
  line-height: 1.08;
  letter-spacing: 0;
  text-shadow: 0 20px 80px rgba(139, 92, 246, 0.18);

  @media (max-width: 960px) {
    text-align: center;
  }

  @media (max-width: 960px) {
    font-size: 40px;
    line-height: 48px;
    margin-bottom: 8px;
  }
`;

const TextLoop = styled.div`
  font-weight: 700;
  font-size: 30px;
  display: flex;
  gap: 12px;
  color: ${({ theme }) => theme.text_primary};
  line-height: 1.6;

  @media (max-width: 960px) {
    text-align: center;
  }

  @media (max-width: 960px) {
    font-size: 22px;
    line-height: 48px;
    margin-bottom: 16px;
  }
`;

const Span = styled.div`
  cursor: pointer;
  color: ${({ theme }) => theme.accent};
  text-shadow: 0 0 28px rgba(34, 211, 238, 0.28);
`;

const SubTitle = styled.div`
  max-width: 620px;
  font-size: 18px;
  line-height: 1.8;
  margin: 18px 0 42px;
  color: ${({ theme }) => theme.text_secondary};

  @media (max-width: 960px) {
    text-align: center;
  }

  @media (max-width: 960px) {
    font-size: 16px;
    line-height: 32px;
  }
`;

const ResumeButton = styled.a`
  -webkit-appearance: button;
  -moz-appearance: button;
  appearance: button;
  text-decoration: none;

  width: 95%;
  max-width: 300px;
  text-align: center;
  padding: 16px 26px;
  background: linear-gradient(135deg, ${({ theme }) => theme.primary} 0%, ${({ theme }) => theme.accent} 100%);
  box-shadow: 0 18px 45px rgba(34, 211, 238, 0.18), 0 14px 34px rgba(139, 92, 246, 0.24);
  border-radius: 50px;
  font-weight: 700;
  font-size: 16px;
  color: white;
  transition: all 0.28s ease-in-out;

  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 24px 60px rgba(34, 211, 238, 0.22), 0 18px 44px rgba(139, 92, 246, 0.28);
    filter: brightness(1.05);
  }

  @media (max-width: 640px) {
    padding: 13px 0;
    font-size: 15px;
  }
`;

const Img = styled.img`
  border-radius: 50%;
  width: 100%;
  height: 100%;
  max-width: 392px;
  max-height: 392px;
  object-fit: cover;
  border: 1px solid rgba(255, 255, 255, 0.18);
  box-shadow:
    0 0 0 12px rgba(139, 92, 246, 0.08),
    0 0 0 24px rgba(34, 211, 238, 0.04),
    0 34px 100px rgba(0, 0, 0, 0.55);
  filter: saturate(1.06) contrast(1.04);

  @media (max-width: 640px) {
    max-width: 280px;
    max-height: 280px;
  }
`;

const HeroBg = styled.div`
  position: absolute;
  display: flex;
  justify-content: end;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 100%;
  max-width: 1360px;
  overflow: hidden;
  padding: 0 30px;
  opacity: 0.86;
  top: 50%;
  left: 50%;
  -webkit-transform: translateX(-50%) translateY(-50%);
  transform: translateX(-50%) translateY(-50%);

  @media (max-width: 960px) {
    justify-content: center;
    padding: 0 0px;
  }
`;

const Hero = () => {
  const [resumeUrl, setResumeUrl] = useState(Bio.resume);

  useEffect(() => {
    fetchBio()
      .then((b) => {
        if (b && b.resume) setResumeUrl(b.resume);
      })
      .catch(() => {});
  }, []);

  return (
    <div id="About">
      <HeroContainer>
        <HeroBg>
          <StarCanvas />
          <HeroBgAnimation />
        </HeroBg>

        <motion.div {...headContainerAnimation}>
          <HeroInnerContainer>
            <HeroLeftContainer>
              <motion.div {...headTextAnimation}>
                <Title>
                  Hi, I am <br /> {Bio.name}
                </Title>
                <TextLoop>
                  I am a
                  <Span>
                    <Typewriter
                      options={{
                        strings: Bio.roles,
                        autoStart: true,
                        loop: true,
                      }}
                    />
                  </Span>
                </TextLoop>
              </motion.div>

              <motion.div {...headContentAnimation}>
                <SubTitle>{Bio.description}</SubTitle>
              </motion.div>

              <ResumeButton href={resumeUrl} target="_blank" rel="noopener noreferrer">
                Check Resume
              </ResumeButton>
            </HeroLeftContainer>
            <HeroRightContainer>
              <motion.div {...headContentAnimation}>
                <Tilt>
                  <Img src={HeroImg} alt={`${Bio.name} profile`} />
                </Tilt>
              </motion.div>
            </HeroRightContainer>
          </HeroInnerContainer>
        </motion.div>
      </HeroContainer>
    </div>
  );
};

export default Hero;
