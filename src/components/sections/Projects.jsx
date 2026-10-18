import { useEffect, useState } from "react";
import styled from "styled-components";
import { projects as fallbackProjects } from "../../data/constants";
import ProjectCard from "../cards/ProjectCard";
import { fetchProjects } from "../../utils/api";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 96px 16px 40px;
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
  max-width: 1180px;
  gap: 14px;
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

const ToggleButtonGroup = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  border: 1px solid ${({ theme }) => theme.border};
  background: rgba(15, 23, 42, 0.72);
  color: ${({ theme }) => theme.text_secondary};
  font-size: 16px;
  border-radius: 999px;
  font-weight: 600;
  margin: 22px 0;
  overflow: hidden;
  padding: 5px;
  backdrop-filter: blur(14px);
  @media (max-width: 768px) {
    font-size: 12px;
  }
`;
const ToggleButton = styled.button`
  padding: 9px 18px;
  border: none;
  background: transparent;
  color: inherit;
  font: inherit;
  border-radius: 999px;
  cursor: pointer;
  transition: all 0.22s ease;
  &:hover {
    color: ${({ theme }) => theme.white};
    background: rgba(255, 255, 255, 0.06);
  }
  @media (max-width: 768px) {
    padding: 6px 8px;
    border-radius: 4px;
  }
  ${({ $active, theme }) =>
    $active &&
    `
  color: ${theme.white};
  background: linear-gradient(135deg, ${theme.primary}, ${theme.accent});
  box-shadow: 0 10px 24px rgba(34, 211, 238, 0.16);
  `}
`;
const Divider = styled.div`
  display: none;
`;

const CardContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: stretch;
  gap: 26px;
  flex-wrap: wrap;
  width: 100%;
`;

const Projects = () => {
  const [toggle, setToggle] = useState("all");
  const [projectList, setProjectList] = useState(fallbackProjects);

  useEffect(() => {
    let isMounted = true;
    fetchProjects()
      .then((data) => {
        if (isMounted && Array.isArray(data) && data.length > 0) {
          setProjectList(data);
        }
      })
      .catch(() => {
        // Fall back gracefully to constants if backend is unavailable
      });
    return () => {
      isMounted = false;
    };
  }, []);

  const categories = [
    "all",
    ...new Set(projectList.map((project) => project.category).filter(Boolean)),
  ];
  const visibleProjects =
    toggle === "all"
      ? projectList
      : projectList.filter((project) => project.category === toggle);

  return (
    <Container id="Projects">
      <Wrapper>
        <Title>Projects</Title>
        <Desc
          style={{
            marginBottom: "40px",
          }}
        >
          I have worked on a wide range of projects. Here are some of my projects.
        </Desc>

        <ToggleButtonGroup aria-label="Project categories">
          {categories.map((category, index) => (
            <div key={category} style={{ display: "flex" }}>
              {index > 0 && <Divider />}
              <ToggleButton
                type="button"
                $active={toggle === category}
                aria-pressed={toggle === category}
                onClick={() => setToggle(category)}
              >
                {category === "all" ? "All" : category}
              </ToggleButton>
            </div>
          ))}
        </ToggleButtonGroup>

        <CardContainer>
          {visibleProjects.map((project) => (
            <ProjectCard key={project.id ?? project.title} project={project} />
          ))}
        </CardContainer>
      </Wrapper>
    </Container>
  );
};

export default Projects;
