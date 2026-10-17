import React, { useState, useEffect } from "react";
import { VerticalTimeline } from "react-vertical-timeline-component";
import "react-vertical-timeline-component/style.min.css";
import styled from "styled-components";
import { experiences as fallbackExperiences } from "../../data/constants";
import ExperienceCard from "../cards/ExperienceCard";
import { fetchExperiences } from "../../utils/api";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 0 16px;
  margin-top: 20px;
  position: relative;
  z-index: 1;
  align-items: center;
`;

const Wrapper = styled.div`
  position: relative;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-direction: column;
  width: 100%;
  max-width: 1100px;
  gap: 12px;
  @media (max-width: 960px) {
    flex-direction: column;
  }
`;
const Title = styled.div`
  font-size: 48px;
  text-align: center;
  font-weight: 800;
  margin-top: 20px;
  color: ${({ theme }) => theme.text_primary};
  @media (max-width: 768px) {
    margin-top: 12px;
    font-size: 32px;
  }
`;
const Desc = styled.div`
  max-width: 720px;
  font-size: 17px;
  line-height: 1.7;
  text-align: center;
  font-weight: 400;
  color: ${({ theme }) => theme.text_secondary};
  @media (max-width: 768px) {
    font-size: 16px;
  }
`;

const Experience = () => {
  const [experienceList, setExperienceList] = useState(fallbackExperiences);

  useEffect(() => {
    let isMounted = true;
    fetchExperiences()
      .then((data) => {
        if (isMounted && Array.isArray(data) && data.length > 0) {
          const mapped = data.map((item, idx) => {
            const fallback = fallbackExperiences.find(
              (f) => f.company?.toLowerCase() === item.company?.toLowerCase()
            ) || fallbackExperiences[idx % fallbackExperiences.length];

            return {
              ...item,
              img: item.img && item.img.trim() !== "" ? item.img : (fallback ? fallback.img : "https://cdn-icons-png.flaticon.com/512/3281/3281289.png"),
            };
          });
          setExperienceList(mapped);
        }
      })
      .catch(() => {
        // Fall back gracefully to constants if backend is unavailable
      });
    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <Container id="Experience">
      <Wrapper>
        <Title>Experience</Title>
        <Desc
          style={{
            marginBottom: "40px",
          }}
        >
          My work experience as a software engineer and working on different
          companies and projects.
        </Desc>

        <VerticalTimeline>
          {experienceList.map((experience, index) => (
            <ExperienceCard
              key={`experience-${experience.id || index}`}
              experience={experience}
            />
          ))}
        </VerticalTimeline>
      </Wrapper>
    </Container>
  );
};

export default Experience;
