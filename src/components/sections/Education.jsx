import React, { useState, useEffect } from "react";
import { VerticalTimeline } from "react-vertical-timeline-component";
import "react-vertical-timeline-component/style.min.css";
import styled from "styled-components";
import { education as fallbackEducation } from "../../data/constants";
import EducationCard from "../cards/EducationCard";
import EarthCanvas from "../canvas/Earth";
import { fetchEducation } from "../../utils/api";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  position: relative;
  z-index: 1;
  align-items: center;
  padding: 0 16px;
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

const Education = () => {
  const [educationList, setEducationList] = useState(fallbackEducation);

  useEffect(() => {
    let isMounted = true;
    fetchEducation()
      .then((data) => {
        if (isMounted && Array.isArray(data) && data.length > 0) {
          const mapped = data.map((item, idx) => {
            const fallback = fallbackEducation.find(
              (f) => f.school?.toLowerCase() === item.school?.toLowerCase()
            ) || fallbackEducation[idx % fallbackEducation.length];

            return {
              ...item,
              img: item.img && item.img.trim() !== "" ? item.img : (fallback ? fallback.img : "https://cdn-icons-png.flaticon.com/512/8074/8074788.png"),
            };
          });
          setEducationList(mapped);
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
    <Container id="Education">
      <Wrapper>
        <Title>Education</Title>
        <Desc
          style={{
            marginBottom: "40px",
          }}
        >
          My education has been a journey of self-discovery and growth. My
          educational details are as follows.
        </Desc>

        <VerticalTimeline>
          {educationList.map((education, index) => (
            <EducationCard key={`education-${education.id || index}`} education={education} />
          ))}
        </VerticalTimeline>
        <EarthCanvas />
      </Wrapper>
    </Container>
  );
};

export default Education;
