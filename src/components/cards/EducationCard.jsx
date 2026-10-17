import React from "react";
import { VerticalTimelineElement } from "react-vertical-timeline-component";
import styled from "styled-components";

const Top = styled.div`
  width: 100%;
  display: flex;
  max-width: 100%;
  gap: 14px;
`;
const Image = styled.img`
  height: 54px;
  width: 54px;
  object-fit: cover;
  border-radius: 14px;
  margin-top: 4px;
  border: 1px solid rgba(255, 255, 255, 0.14);
  @media only screen and (max-width: 768px) {
    height: 40px;
  }
`;
const Body = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
`;
const School = styled.div`
  font-size: 18px;
  font-weight: 700;
  color: ${({ theme }) => theme.text_primary};
  @media only screen and (max-width: 768px) {
    font-size: 14px;
  }
`;
const Degree = styled.div`
  font-size: 14px;
  font-weight: 500;
  color: ${({ theme }) => theme.accent};
  @media only screen and (max-width: 768px) {
    font-size: 12px;
  }
`;
const Date = styled.div`
  font-size: 12px;
  font-weight: 500;
  color: ${({ theme }) => theme.text_secondary};

  @media only screen and (max-width: 768px) {
    font-size: 10px;
  }
`;

const Description = styled.div`
  width: 100%;
  font-size: 15px;
  font-weight: 400;
  color: ${({ theme }) => theme.text_secondary};
  margin-bottom: 10px;
  line-height: 1.7;
  @media only screen and (max-width: 768px) {
    font-size: 12px;
  }
`;

const Grade = styled.div`
  font-size: 14px;
  font-weight: 600;
  color: ${({ theme }) => theme.text_primary};
  @media only screen and (max-width: 768px) {
    font-size: 12px;
  }
`;
const Span = styled.div`
  display: -webkit-box;
  max-width: 100%;
`;

const DEFAULT_EDU_ICON = "https://cdn-icons-png.flaticon.com/512/8074/8074788.png";

const EducationCard = ({ education }) => {
  const iconImg = education?.img && education.img.trim() !== "" ? education.img : DEFAULT_EDU_ICON;

  return (
    <VerticalTimelineElement
      icon={
        <img
          width="100%"
          height="100%"
          alt={education?.school || "School"}
          style={{ borderRadius: "50%", objectFit: "cover" }}
          src={iconImg}
          onError={(e) => {
            e.target.src = DEFAULT_EDU_ICON;
          }}
        />
      }
      contentStyle={{
        display: "flex",
        flexDirection: "column",
        gap: "12px",
        background:
          "linear-gradient(180deg, rgba(15, 23, 42, 0.9), rgba(15, 23, 42, 0.68))",
        color: "#fff",
        boxShadow: "0 24px 70px rgba(0, 0, 0, 0.32)",
        border: "1px solid rgba(148, 163, 184, 0.18)",
        borderRadius: "18px",
        backdropFilter: "blur(16px)",
      }}
      contentArrowStyle={{
        borderRight: "7px solid  rgba(255, 255, 255, 0.3)",
      }}
      date={education?.date}
    >
      <Top>
        <Image
          src={iconImg}
          alt={education?.school || "School"}
          onError={(e) => {
            e.target.src = DEFAULT_EDU_ICON;
          }}
        />
        <Body>
          <School>{education?.school}</School>
          <Degree>{education?.degree}</Degree>
          <Date>{education?.date}</Date>
        </Body>
      </Top>
      <Grade>
        <b>Grade : </b>
        {education?.grade}
      </Grade>
      <Description>
        {education?.desc && <Span>{education.desc}</Span>}
      </Description>
    </VerticalTimelineElement>
  );
};

export default EducationCard;
