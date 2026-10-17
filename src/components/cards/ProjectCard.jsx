import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { CloseRounded, GitHub, LaunchRounded } from "@mui/icons-material";
import { AnimatePresence, motion } from "framer-motion";
import styled from "styled-components";

const Card = styled(motion.div)`
  width: 340px;
  min-height: 520px;
  background: linear-gradient(180deg, rgba(15, 23, 42, 0.9), rgba(15, 23, 42, 0.66));
  cursor: pointer;
  border: 1px solid ${({ theme }) => theme.border || "rgba(255, 255, 255, 0.1)"};
  border-radius: 18px;
  box-shadow: 0 18px 55px rgba(0, 0, 0, 0.28);
  overflow: hidden;
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 16px;
  backdrop-filter: blur(14px);
  transition: transform 0.28s ease, box-shadow 0.28s ease, border-color 0.28s ease;
  &:hover {
    transform: translateY(-8px);
    border-color: rgba(34, 211, 238, 0.38);
    box-shadow: 0 28px 85px rgba(0, 0, 0, 0.38);
  }
`;

const Image = styled.img`
  width: 100%;
  height: 190px;
  background-color: #0b1120;
  border-radius: 14px;
  box-shadow: 0 18px 42px rgba(0, 0, 0, 0.3);
  object-fit: cover;
`;

const Tags = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 4px;
`;

const Tag = styled.span`
  font-size: 12px;
  font-weight: 500;
  color: ${({ theme }) => theme.accent || "#22d3ee"};
  background: rgba(34, 211, 238, 0.08);
  border: 1px solid rgba(34, 211, 238, 0.18);
  border-radius: 999px;
  padding: 4px 10px;
`;

const MoreTag = styled(Tag)`
  color: ${({ theme }) => theme.text_secondary || "#94a3b8"};
  background: rgba(255, 255, 255, 0.055);
  border-color: ${({ theme }) => theme.border || "rgba(255, 255, 255, 0.1)"};
`;

const Details = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding: 0 2px;
`;

const Title = styled.div`
  font-size: 21px;
  font-weight: 700;
  color: ${({ theme }) => theme.text_primary || "#f8fafc"};
  display: -webkit-box;
  max-width: 100%;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const Date = styled.div`
  font-size: 13px;
  margin-left: 2px;
  font-weight: 500;
  color: ${({ theme }) => theme.accent || "#22d3ee"};
  @media only screen and (max-width: 768px) {
    font-size: 11px;
  }
`;

const Description = styled.div`
  font-weight: 400;
  font-size: 14px;
  color: ${({ theme }) => theme.text_secondary || "#94a3b8"};
  overflow: hidden;
  margin-top: 6px;
  line-height: 1.6;
  display: -webkit-box;
  max-width: 100%;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  text-overflow: ellipsis;
`;

const Members = styled.div`
  display: flex;
  align-items: center;
  padding-left: 10px;
`;

const Avatar = styled.img`
  width: 38px;
  height: 38px;
  border-radius: 50%;
  margin-left: -10px;
  background-color: #0b1120;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
  border: 3px solid ${({ theme }) => theme.card || "#1e293b"};
`;

const Button = styled.a`
  color: #ffffff;
  text-decoration: none;
  font-weight: 700;
  font-size: 13px;
  text-align: center;
  padding: 8px 16px;
  background: rgba(255, 255, 255, 0.06);
  border: 1px solid ${({ theme }) => theme.border || "rgba(255, 255, 255, 0.14)"};
  border-radius: 999px;
  transition: all 0.25s ease;
  &:hover {
    background: linear-gradient(135deg, ${({ theme }) => theme.primary || "#854ce6"}, ${({ theme }) => theme.accent || "#22d3ee"});
    border-color: transparent;
    color: #ffffff;
    transform: translateY(-2px);
  }
`;

const ButtonsContainer = styled.div`
  display: flex;
  gap: 10px;
  justify-content: center;
  margin-top: auto;
  padding-top: 10px;
`;

/* ---------------- FULL-SIZE PROPER FORMAT MODAL STYLES ---------------- */

const Overlay = styled(motion.div)`
  position: fixed;
  inset: 0;
  z-index: 999999;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px 16px;
  background: rgba(3, 7, 18, 0.85);
  backdrop-filter: blur(20px);
  overflow-y: auto;
`;

const ModalCard = styled(motion.div)`
  width: min(960px, 94vw);
  max-height: 90vh;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 22px;
  padding: 32px;
  border-radius: 24px;
  border: 1px solid rgba(255, 255, 255, 0.12);
  background: linear-gradient(180deg, rgba(15, 23, 42, 0.98) 0%, rgba(10, 15, 30, 0.96) 100%);
  box-shadow: 0 35px 120px rgba(0, 0, 0, 0.75), 0 0 50px rgba(133, 76, 230, 0.15);
  margin: auto;
  position: relative;

  /* Sleek Minimalist Glass Scrollbar */
  &::-webkit-scrollbar {
    width: 6px;
  }
  &::-webkit-scrollbar-track {
    background: rgba(15, 23, 42, 0.6);
    border-radius: 8px;
  }
  &::-webkit-scrollbar-thumb {
    background: rgba(255, 255, 255, 0.2);
    border-radius: 8px;
  }
  &::-webkit-scrollbar-thumb:hover {
    background: rgba(34, 211, 238, 0.6);
  }

  @media (max-width: 768px) {
    padding: 20px 16px;
    border-radius: 18px;
    gap: 16px;
  }
`;

const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 16px;
  width: 100%;
`;

const HeaderInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const BadgeRow = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
`;

const CategoryBadge = styled.span`
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.8px;
  text-transform: uppercase;
  padding: 4px 12px;
  border-radius: 999px;
  background: rgba(133, 76, 230, 0.16);
  border: 1px solid rgba(133, 76, 230, 0.45);
  color: #c084fc;
`;

const DateBadge = styled.span`
  font-size: 13px;
  font-weight: 500;
  color: #94a3b8;
`;

const ModalTitle = styled.h2`
  font-size: clamp(24px, 4vw, 36px);
  font-weight: 800;
  color: #f8fafc;
  margin: 0;
  line-height: 1.18;
  letter-spacing: -0.5px;
`;

const CloseButton = styled.button`
  width: 44px;
  height: 44px;
  border-radius: 50%;
  border: 1px solid rgba(255, 255, 255, 0.15);
  background: rgba(255, 255, 255, 0.06);
  color: #e2e8f0;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.25s ease;
  flex-shrink: 0;

  &:hover {
    background: rgba(239, 68, 68, 0.2);
    border-color: rgba(239, 68, 68, 0.45);
    color: #f87171;
    transform: rotate(90deg);
  }
`;

const ImageShowcase = styled.div`
  width: 100%;
  border-radius: 18px;
  overflow: hidden;
  position: relative;
  border: 1px solid rgba(255, 255, 255, 0.1);
  background: radial-gradient(circle at center, rgba(30, 41, 59, 0.6) 0%, rgba(10, 15, 30, 0.95) 100%);
  box-shadow: 0 20px 50px rgba(0, 0, 0, 0.45);
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 240px;
`;

const ModalImage = styled.img`
  width: 100%;
  max-height: 460px;
  object-fit: contain;
  display: block;

  @media (max-width: 768px) {
    max-height: 280px;
  }
`;

const FullViewBadge = styled.a`
  position: absolute;
  bottom: 14px;
  right: 14px;
  background: rgba(15, 23, 42, 0.88);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: #f8fafc;
  padding: 6px 14px;
  border-radius: 999px;
  font-size: 12px;
  font-weight: 600;
  text-decoration: none;
  display: flex;
  align-items: center;
  gap: 6px;
  transition: all 0.25s ease;

  &:hover {
    background: rgba(34, 211, 238, 0.2);
    border-color: rgba(34, 211, 238, 0.5);
    color: #38bdf8;
    transform: translateY(-2px);
  }
`;

const ModalContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const SectionBlock = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const SectionHeading = styled.h4`
  font-size: 14px;
  font-weight: 700;
  color: #94a3b8;
  text-transform: uppercase;
  letter-spacing: 0.8px;
  margin: 0;
`;

const ModalDescription = styled.p`
  font-size: 15px;
  line-height: 1.8;
  color: #cbd5e1;
  margin: 0;
  font-weight: 400;
`;

const ModalTagsContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
`;

const ModalTag = styled.span`
  font-size: 12px;
  font-weight: 600;
  color: #38bdf8;
  background: rgba(34, 211, 238, 0.08);
  border: 1px solid rgba(34, 211, 238, 0.22);
  border-radius: 999px;
  padding: 6px 13px;
  transition: all 0.2s ease;

  &:hover {
    background: rgba(34, 211, 238, 0.16);
    border-color: rgba(34, 211, 238, 0.45);
    color: #ffffff;
  }
`;

const ModalActions = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 14px;
  align-items: center;
  padding-top: 14px;
  border-top: 1px solid rgba(255, 255, 255, 0.08);
`;

const PrimaryCTA = styled.a`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  color: #ffffff;
  text-decoration: none;
  font-weight: 700;
  font-size: 15px;
  padding: 13px 28px;
  border-radius: 999px;
  background: linear-gradient(135deg, #854ce6 0%, #22d3ee 100%);
  box-shadow: 0 10px 28px rgba(34, 211, 238, 0.25);
  transition: all 0.25s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 14px 35px rgba(34, 211, 238, 0.4);
    color: #ffffff;
  }
`;

const SecondaryCTA = styled.a`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  color: #f1f5f9;
  text-decoration: none;
  font-weight: 600;
  font-size: 15px;
  padding: 13px 24px;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.06);
  border: 1px solid rgba(255, 255, 255, 0.16);
  transition: all 0.25s ease;

  &:hover {
    background: rgba(255, 255, 255, 0.12);
    border-color: rgba(255, 255, 255, 0.35);
    transform: translateY(-2px);
    color: #ffffff;
  }
`;

const DismissBtn = styled.button`
  display: inline-flex;
  align-items: center;
  color: #94a3b8;
  background: transparent;
  border: none;
  font-size: 14px;
  font-weight: 600;
  padding: 12px 18px;
  cursor: pointer;
  margin-left: auto;
  transition: color 0.2s ease;

  &:hover {
    color: #f8fafc;
  }

  @media (max-width: 640px) {
    margin-left: 0;
    width: 100%;
    justify-content: center;
  }
`;

/* ---------------- COMPONENT ---------------- */

const ProjectCard = ({ project }) => {
  const [isOpen, setIsOpen] = useState(false);

  // Normalize tags array (supports both array and comma-separated string)
  const allTags = Array.isArray(project.tags)
    ? project.tags
    : typeof project.tags === "string"
    ? project.tags.split(",").map((s) => s.trim()).filter(Boolean)
    : [];

  const visibleTags = allTags.slice(0, 6);
  const hiddenTagCount = Math.max(allTags.length - visibleTags.length, 0);

  const openProject = () => setIsOpen(true);
  const closeProject = () => setIsOpen(false);

  // Lock body scroll and listen for Escape key when modal is open
  useEffect(() => {
    if (!isOpen) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const handleKeyDown = (e) => {
      if (e.key === "Escape") closeProject();
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  return (
    <>
      <Card
        role="button"
        tabIndex={0}
        onClick={openProject}
        onKeyDown={(event) => {
          if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            openProject();
          }
        }}
      >
        <Image src={project.image} alt={`${project.title} preview`} loading="lazy" />
        <Tags>
          {visibleTags.map((tag) => (
            <Tag key={`${project.title}-${tag}`}>{tag}</Tag>
          ))}
          {hiddenTagCount > 0 && <MoreTag>+{hiddenTagCount}</MoreTag>}
        </Tags>
        <Details>
          <Title>{project.title}</Title>
          <Date>{project.date}</Date>
          <Description>{project.description}</Description>
        </Details>
        <Members>
          {project.member?.map((member) => (
            <Avatar
              key={member.name ?? member.img}
              src={member.img}
              alt={member.name ?? "Project member"}
              loading="lazy"
            />
          ))}
        </Members>
        {(project.github || project.webapp) && (
          <ButtonsContainer>
            {project.github && (
              <Button
                href={project.github}
                target="_blank"
                rel="noreferrer"
                onClick={(event) => event.stopPropagation()}
              >
                View Code
              </Button>
            )}
            {project.webapp && (
              <Button
                href={project.webapp}
                target="_blank"
                rel="noreferrer"
                onClick={(event) => event.stopPropagation()}
              >
                Live Demo
              </Button>
            )}
          </ButtonsContainer>
        )}
      </Card>

      {/* RENDER VIA PORTAL DIRECTLY INTO DOCUMENT.BODY TO PREVENT ANY STACKING CONTEXT OR NAVBAR OVERLAP */}
      {typeof document !== "undefined" &&
        createPortal(
          <AnimatePresence>
            {isOpen && (
              <Overlay
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.22 }}
                onClick={closeProject}
              >
                <ModalCard
                  initial={{ opacity: 0, scale: 0.95, y: 24 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: 16 }}
                  transition={{ type: "spring", stiffness: 280, damping: 26 }}
                  onClick={(event) => event.stopPropagation()}
                >
                  {/* Top Header */}
                  <ModalHeader>
                    <HeaderInfo>
                      <BadgeRow>
                        {project.category && (
                          <CategoryBadge>{project.category}</CategoryBadge>
                        )}
                        {project.date && <DateBadge>📅 {project.date}</DateBadge>}
                      </BadgeRow>
                      <ModalTitle>{project.title}</ModalTitle>
                    </HeaderInfo>
                    <CloseButton
                      type="button"
                      onClick={closeProject}
                      aria-label="Close project details"
                    >
                      <CloseRounded style={{ fontSize: "24px" }} />
                    </CloseButton>
                  </ModalHeader>

                  {/* Full Size Proper Format Showcase Image */}
                  {project.image && (
                    <ImageShowcase>
                      <ModalImage
                        src={project.image}
                        alt={`${project.title} full showcase`}
                      />
                      <FullViewBadge
                        href={project.image}
                        target="_blank"
                        rel="noreferrer"
                      >
                        <LaunchRounded style={{ fontSize: "15px" }} />
                        <span>Full Image</span>
                      </FullViewBadge>
                    </ImageShowcase>
                  )}

                  {/* Detailed Content */}
                  <ModalContent>
                    <SectionBlock>
                      <SectionHeading>About this project</SectionHeading>
                      <ModalDescription>{project.description}</ModalDescription>
                    </SectionBlock>

                    {allTags.length > 0 && (
                      <SectionBlock>
                        <SectionHeading>Technical Stack & Libraries</SectionHeading>
                        <ModalTagsContainer>
                          {allTags.map((tag) => (
                            <ModalTag key={`${project.title}-modal-${tag}`}>
                              {tag}
                            </ModalTag>
                          ))}
                        </ModalTagsContainer>
                      </SectionBlock>
                    )}

                    {/* Action Buttons */}
                    <ModalActions>
                      {project.webapp && (
                        <PrimaryCTA
                          href={project.webapp}
                          target="_blank"
                          rel="noreferrer"
                        >
                          <LaunchRounded style={{ fontSize: "18px" }} />
                          <span>View Live Demo</span>
                        </PrimaryCTA>
                      )}
                      {project.github && (
                        <SecondaryCTA
                          href={project.github}
                          target="_blank"
                          rel="noreferrer"
                        >
                          <GitHub style={{ fontSize: "18px" }} />
                          <span>View Source Code</span>
                        </SecondaryCTA>
                      )}
                      <DismissBtn type="button" onClick={closeProject}>
                        Close
                      </DismissBtn>
                    </ModalActions>
                  </ModalContent>
                </ModalCard>
              </Overlay>
            )}
          </AnimatePresence>,
          document.body
        )}
    </>
  );
};

export default ProjectCard;
