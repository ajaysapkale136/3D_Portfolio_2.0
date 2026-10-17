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
const Role = styled.div`
  font-size: 18px;
  font-weight: 700;
  color: ${({ theme }) => theme.text_primary};
  @media only screen and (max-width: 768px) {
    font-size: 14px;
  }
`;
const Company = styled.div`
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
const Skills = styled.div`
  width: 100%;
  display: flex;
  gap: 12px;
  margin-top: -10px;
`;
const Span = styled.div`
  display: -webkit-box;
  max-width: 100%;
`;

const Skill = styled.div`
  font-size: 13px;
  font-weight: 500;
  color: ${({ theme }) => theme.text_primary};
  background: rgba(255, 255, 255, 0.055);
  border: 1px solid rgba(255, 255, 255, 0.11);
  border-radius: 999px;
  padding: 5px 9px;
  @media only screen and (max-width: 768px) {
    font-size: 12px;
  }
`;

const ItemWrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
`;

const DEFAULT_EXP_ICON = "https://cdn-icons-png.flaticon.com/512/3281/3281289.png";

const ExperienceCard = ({ experience }) => {
  const iconImg = experience?.img && experience.img.trim() !== "" ? experience.img : DEFAULT_EXP_ICON;

  return (
    <VerticalTimelineElement
      icon={
        <img
          width="100%"
          height="100%"
          alt={experience?.company || "Experience"}
          style={{ borderRadius: "50%", objectFit: "cover" }}
          src={iconImg}
          onError={(e) => {
            e.target.src = DEFAULT_EXP_ICON;
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
      date={experience?.date}
    >
      <Top>
        <Image
          src={iconImg}
          alt={experience?.company || "Company"}
          onError={(e) => {
            e.target.src = DEFAULT_EXP_ICON;
          }}
        />
        <Body>
          <Role>{experience?.role}</Role>
          <Company>{experience?.company}</Company>
          <Date>{experience?.date}</Date>
        </Body>
      </Top>
      <Description>
        {experience?.desc && <Span>{experience.desc}</Span>}
        {experience?.skills && (
          <>
            <br />
            <Skills>
              <b>Skills</b>
              <ItemWrapper>
                {experience?.skills?.map((skill) => (
                  <Skill key={`${experience?.company}-${skill}`}>{skill}</Skill>
                ))}
              </ItemWrapper>
            </Skills>
          </>
        )}
      </Description>
    </VerticalTimelineElement>
  );
};

export default ExperienceCard;
