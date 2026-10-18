import React, { useState, useEffect, useMemo } from "react";
import styled, { keyframes } from "styled-components";
import { Link } from "react-router-dom";
import {
  adminSendOtp,
  adminLogin,
  adminVerify,
  adminLogout,
  adminGetStats,
  adminGetMessages,
  adminUpdateMessageStatus,
  adminDeleteMessage,
  adminGetProjects,
  adminCreateProject,
  adminUpdateProject,
  adminDeleteProject,
  adminGetSkills,
  adminCreateSkill,
  adminDeleteSkill,
  adminGetBio,
  adminUpdateBio,
  adminGetExperiences,
  adminCreateExperience,
  adminUpdateExperience,
  adminDeleteExperience,
  adminGetEducation,
  adminCreateEducation,
  adminUpdateEducation,
  adminDeleteEducation,
} from "../../utils/api";
import {
  AdminPanelSettingsRounded,
  DashboardRounded,
  MailRounded,
  CodeRounded,
  BoltRounded,
  DescriptionRounded,
  LogoutRounded,
  OpenInNewRounded,
  SearchRounded,
  CheckCircleRounded,
  DeleteOutlineRounded,
  MarkEmailReadRounded,
  ContentCopyRounded,
  WorkRounded,
  SchoolRounded,
  EditRounded,
  CloseRounded,
  PhoneRounded,
  GridViewRounded,
  ViewListRounded,
  CalendarTodayRounded,
  LaunchRounded,
  WorkspacePremiumRounded,
} from "@mui/icons-material";

// ======================== ANIMATIONS ========================
const pulseGlow = keyframes`
  0% { box-shadow: 0 0 0 0 rgba(34, 211, 238, 0.4); }
  70% { box-shadow: 0 0 0 10px rgba(34, 211, 238, 0); }
  100% { box-shadow: 0 0 0 0 rgba(34, 211, 238, 0); }
`;

const slideDown = keyframes`
  from { transform: translate(-50%, -20px); opacity: 0; }
  to { transform: translate(-50%, 0); opacity: 1; }
`;

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(8px); }
  to { opacity: 1; transform: translateY(0); }
`;

// ======================== STYLED COMPONENTS ========================
const Container = styled.div`
  min-height: 100vh;
  background: radial-gradient(circle at 12% 15%, rgba(133, 76, 230, 0.14) 0%, transparent 45%),
              radial-gradient(circle at 88% 85%, rgba(34, 211, 238, 0.12) 0%, transparent 45%),
              #070a14;
  color: #f1f5f9;
  font-family: "Poppins", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  padding: 32px 24px;
  box-sizing: border-box;
`;

const Header = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: center;
  max-width: 1240px;
  margin: 0 auto 28px;
  padding-bottom: 22px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
  flex-wrap: wrap;
  gap: 16px;
`;

const BrandSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const Title = styled.h1`
  font-size: 26px;
  font-weight: 800;
  letter-spacing: -0.5px;
  background: linear-gradient(135deg, #ffffff 30%, #22d3ee 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  margin: 0;
  display: flex;
  align-items: center;
  gap: 10px;
`;

const StatusPillRow = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
  margin-top: 4px;
`;

const LiveStatusBadge = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  background: rgba(16, 185, 129, 0.12);
  border: 1px solid rgba(16, 185, 129, 0.35);
  color: #34d399;
  padding: 3px 10px;
  border-radius: 999px;
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.3px;
`;

const StatusDot = styled.span`
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: #10b981;
  box-shadow: 0 0 8px #10b981;
  animation: ${pulseGlow} 2s infinite;
`;

const SecBadge = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 5px;
  background: rgba(133, 76, 230, 0.12);
  border: 1px solid rgba(133, 76, 230, 0.35);
  color: #c084fc;
  padding: 3px 10px;
  border-radius: 999px;
  font-size: 11px;
  font-weight: 600;
`;

const HeaderActions = styled.div`
  display: flex;
  gap: 12px;
  align-items: center;
`;

const NavButton = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 9px 18px;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.14);
  color: #e2e8f0;
  border-radius: 999px;
  text-decoration: none;
  font-size: 13px;
  font-weight: 600;
  transition: all 0.22s ease;
  backdrop-filter: blur(10px);
  &:hover {
    background: rgba(255, 255, 255, 0.12);
    color: #fff;
    border-color: rgba(34, 211, 238, 0.4);
    transform: translateY(-2px);
  }
`;

const LogoutButton = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 9px 18px;
  background: rgba(239, 68, 68, 0.12);
  border: 1px solid rgba(239, 68, 68, 0.35);
  color: #fca5a5;
  border-radius: 999px;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.22s ease;
  &:hover {
    background: #ef4444;
    color: #fff;
    border-color: transparent;
    transform: translateY(-2px);
    box-shadow: 0 4px 16px rgba(239, 68, 68, 0.4);
  }
`;

const ToastNotification = styled.div`
  position: fixed;
  top: 24px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 10000;
  background: linear-gradient(135deg, rgba(15, 23, 42, 0.96), rgba(30, 41, 59, 0.98));
  border: 1px solid #10b981;
  color: #6ee7b7;
  padding: 12px 24px;
  border-radius: 999px;
  font-size: 14px;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 10px;
  box-shadow: 0 16px 40px rgba(0, 0, 0, 0.6), 0 0 20px rgba(16, 185, 129, 0.3);
  animation: ${slideDown} 0.25s ease-out;
  backdrop-filter: blur(16px);
`;

const MainContent = styled.main`
  max-width: 1240px;
  margin: 0 auto;
  animation: ${fadeIn} 0.3s ease-out;
`;

const TabNav = styled.div`
  display: flex;
  gap: 8px;
  margin-bottom: 28px;
  overflow-x: auto;
  padding: 6px;
  background: rgba(15, 23, 42, 0.6);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 16px;
  backdrop-filter: blur(14px);
`;

const TabButton = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 10px 20px;
  background: ${(props) =>
    props.active ? "linear-gradient(135deg, #854ce6, #22d3ee)" : "transparent"};
  color: ${(props) => (props.active ? "#ffffff" : "#94a3b8")};
  border: none;
  border-radius: 12px;
  font-size: 13.5px;
  font-weight: 600;
  cursor: pointer;
  white-space: nowrap;
  transition: all 0.22s ease;
  box-shadow: ${(props) => (props.active ? "0 8px 20px rgba(133, 76, 230, 0.35)" : "none")};

  &:hover {
    color: #ffffff;
    background: ${(props) =>
      props.active ? "linear-gradient(135deg, #854ce6, #22d3ee)" : "rgba(255, 255, 255, 0.06)"};
  }
`;

const TabCountBadge = styled.span`
  padding: 2px 8px;
  border-radius: 999px;
  font-size: 11px;
  font-weight: 700;
  background: ${(props) => (props.active ? "rgba(0, 0, 0, 0.3)" : "rgba(255, 255, 255, 0.1)")};
  color: ${(props) => (props.active ? "#ffffff" : "#cbd5e1")};
`;

const GlassCard = styled.div`
  background: linear-gradient(180deg, rgba(15, 23, 42, 0.85) 0%, rgba(10, 15, 30, 0.9) 100%);
  border: 1px solid rgba(255, 255, 255, 0.09);
  border-radius: 20px;
  padding: 28px;
  margin-bottom: 24px;
  box-shadow: 0 16px 40px rgba(0, 0, 0, 0.4), 0 0 20px rgba(133, 76, 230, 0.05);
  backdrop-filter: blur(20px);
  transition: border-color 0.25s ease;
`;

const SectionHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  flex-wrap: wrap;
  gap: 12px;
`;

const SectionTitle = styled.h2`
  font-size: 20px;
  font-weight: 700;
  color: #f8fafc;
  margin: 0;
  display: flex;
  align-items: center;
  gap: 10px;
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 18px;
  margin-bottom: 28px;
`;

const StatCard = styled.div`
  background: linear-gradient(135deg, rgba(20, 27, 50, 0.75), rgba(13, 19, 36, 0.85));
  border: 1px solid ${(props) => props.borderColor || "rgba(255, 255, 255, 0.08)"};
  border-radius: 18px;
  padding: 22px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.3);
  transition: transform 0.22s ease, box-shadow 0.22s ease;

  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 16px 35px rgba(0, 0, 0, 0.4);
  }
`;

const StatCardTop = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const StatIconBox = styled.div`
  width: 44px;
  height: 44px;
  border-radius: 12px;
  background: ${(props) => props.bg || "rgba(34, 211, 238, 0.12)"};
  color: ${(props) => props.color || "#22d3ee"};
  display: flex;
  align-items: center;
  justify-content: center;
`;

const StatLabel = styled.span`
  font-size: 13px;
  color: #94a3b8;
  font-weight: 500;
  margin-top: 14px;
`;

const StatValue = styled.span`
  font-size: 34px;
  font-weight: 800;
  color: ${(props) => props.color || "#ffffff"};
  letter-spacing: -0.5px;
  margin: 4px 0;
`;

const StatSubtext = styled.span`
  font-size: 12px;
  color: ${(props) => props.color || "#64748b"};
  display: flex;
  align-items: center;
  gap: 4px;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: separate;
  border-spacing: 0 8px;
  text-align: left;
  font-size: 13.5px;
`;

const Th = styled.th`
  padding: 12px 18px;
  background: transparent;
  color: #94a3b8;
  font-weight: 600;
  font-size: 12px;
  text-transform: uppercase;
  letter-spacing: 0.6px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
`;

const Tr = styled.tr`
  background: rgba(255, 255, 255, 0.03);
  transition: all 0.2s ease;
  border-radius: 12px;

  &:hover {
    background: rgba(255, 255, 255, 0.06);
    transform: translateY(-1px);
  }
`;

const Td = styled.td`
  padding: 16px 18px;
  color: #e2e8f0;
  vertical-align: middle;
  border-top: 1px solid rgba(255, 255, 255, 0.05);
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);

  &:first-child {
    border-left: 1px solid rgba(255, 255, 255, 0.05);
    border-top-left-radius: 12px;
    border-bottom-left-radius: 12px;
  }
  &:last-child {
    border-right: 1px solid rgba(255, 255, 255, 0.05);
    border-top-right-radius: 12px;
    border-bottom-right-radius: 12px;
  }
`;

const StatusBadge = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 5px;
  padding: 4px 10px;
  border-radius: 999px;
  font-size: 11.5px;
  font-weight: 700;
  letter-spacing: 0.4px;
  background: ${(props) =>
    props.type === "NEW" ? "rgba(16, 185, 129, 0.15)" : "rgba(100, 116, 139, 0.18)"};
  border: 1px solid
    ${(props) => (props.type === "NEW" ? "rgba(16, 185, 129, 0.4)" : "rgba(100, 116, 139, 0.3)")};
  color: ${(props) => (props.type === "NEW" ? "#34d399" : "#cbd5e1")};
`;

const ActionBtn = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 5px;
  padding: 7px 13px;
  border-radius: 8px;
  border: none;
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
  margin-right: 6px;
  margin-bottom: 4px;
  background: ${(props) =>
    props.danger
      ? "rgba(239, 68, 68, 0.16)"
      : props.primary
      ? "linear-gradient(135deg, #854ce6, #22d3ee)"
      : "rgba(255, 255, 255, 0.08)"};
  color: ${(props) => (props.danger ? "#f87171" : "#ffffff")};
  border: 1px solid ${(props) => (props.danger ? "rgba(239, 68, 68, 0.3)" : "transparent")};
  transition: all 0.2s ease;

  &:hover {
    transform: translateY(-1px);
    opacity: 0.9;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.25);
  }
`;

const SearchInputWrapper = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  min-width: 260px;

  svg {
    position: absolute;
    left: 12px;
    color: #94a3b8;
    font-size: 18px;
  }
`;

const SearchInput = styled.input`
  width: 100%;
  padding: 9px 14px 9px 38px;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: 999px;
  color: #fff;
  font-size: 13px;
  outline: none;
  transition: all 0.2s;

  &:focus {
    border-color: #22d3ee;
    background: rgba(255, 255, 255, 0.08);
    box-shadow: 0 0 14px rgba(34, 211, 238, 0.25);
  }
`;

const FormGroup = styled.div`
  margin-bottom: 18px;
  display: flex;
  flex-direction: column;
  gap: 6px;
`;

const Label = styled.label`
  font-size: 12.5px;
  font-weight: 600;
  color: #cbd5e1;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

const Input = styled.input`
  padding: 12px 16px;
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: 12px;
  color: #fff;
  font-size: 14px;
  outline: none;
  transition: all 0.2s;

  &:focus {
    border-color: #854ce6;
    background: rgba(255, 255, 255, 0.07);
    box-shadow: 0 0 16px rgba(133, 76, 230, 0.25);
  }
`;

const TextArea = styled.textarea`
  padding: 12px 16px;
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: 12px;
  color: #fff;
  font-size: 14px;
  min-height: 100px;
  outline: none;
  font-family: inherit;
  resize: vertical;
  transition: all 0.2s;

  &:focus {
    border-color: #854ce6;
    background: rgba(255, 255, 255, 0.07);
    box-shadow: 0 0 16px rgba(133, 76, 230, 0.25);
  }
`;

const SubmitBtn = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 12px 26px;
  background: linear-gradient(135deg, #854ce6, #22d3ee);
  border: none;
  border-radius: 12px;
  color: #ffffff;
  font-weight: 700;
  font-size: 14px;
  cursor: pointer;
  box-shadow: 0 8px 24px rgba(133, 76, 230, 0.35);
  transition: all 0.25s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 12px 30px rgba(34, 211, 238, 0.4);
    opacity: 0.95;
  }
`;

const TagChip = styled.span`
  display: inline-block;
  padding: 3px 9px;
  background: rgba(133, 76, 230, 0.18);
  border: 1px solid rgba(133, 76, 230, 0.35);
  color: #c084fc;
  border-radius: 999px;
  font-size: 11.5px;
  font-weight: 600;
  margin-right: 6px;
  margin-bottom: 4px;
`;

const LiveResumeBox = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 20px;
  background: rgba(34, 211, 238, 0.06);
  border: 1px solid rgba(34, 211, 238, 0.25);
  border-radius: 14px;
  margin-bottom: 24px;
  flex-wrap: wrap;
  gap: 12px;
`;

// ======================== PREMIUM CARD STYLED COMPONENTS ========================
const CardGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(330px, 1fr));
  gap: 20px;
  margin-top: 18px;

  @media (max-width: 640px) {
    grid-template-columns: 1fr;
  }
`;

const ItemCard = styled.div`
  background: linear-gradient(145deg, rgba(20, 27, 50, 0.75) 0%, rgba(13, 19, 36, 0.9) 100%);
  border: 1px solid ${(props) => props.$borderColor || "rgba(255, 255, 255, 0.09)"};
  border-radius: 18px;
  padding: 22px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  box-shadow: 0 10px 28px rgba(0, 0, 0, 0.35);
  transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;
  backdrop-filter: blur(16px);

  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 3px;
    background: ${(props) => props.$accentGradient || "linear-gradient(90deg, #854ce6, #22d3ee)"};
    opacity: ${(props) => (props.$highlight ? "1" : "0.55")};
    transition: opacity 0.25s ease;
  }

  &:hover {
    transform: translateY(-4px);
    border-color: ${(props) => props.$hoverBorder || "rgba(34, 211, 238, 0.45)"};
    box-shadow: 0 18px 40px rgba(0, 0, 0, 0.5), 0 0 24px ${(props) => props.$glowColor || "rgba(133, 76, 230, 0.18)"};

    &::before {
      opacity: 1;
    }
  }
`;

const CardHeaderTop = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 14px;
`;

const CardAvatar = styled.div`
  width: 44px;
  height: 44px;
  border-radius: 13px;
  background: ${(props) => props.$bg || "linear-gradient(135deg, rgba(133, 76, 230, 0.2), rgba(34, 211, 238, 0.2))"};
  border: 1px solid ${(props) => props.$border || "rgba(34, 211, 238, 0.3)"};
  color: ${(props) => props.$color || "#22d3ee"};
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 17px;
  flex-shrink: 0;
`;

const CardMetaBlock = styled.div`
  flex: 1;
  min-width: 0;
`;

const CardTitle = styled.h3`
  font-size: 15.5px;
  font-weight: 700;
  color: #ffffff;
  margin: 0 0 3px 0;
  line-height: 1.35;
  word-break: break-word;
`;

const CardSubtitle = styled.div`
  font-size: 13px;
  color: ${(props) => props.$color || "#38bdf8"};
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 6px;
  flex-wrap: wrap;
`;

const CardDateChip = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 4px;
  font-size: 11.5px;
  color: #94a3b8;
  margin-top: 4px;
`;

const CardInfoPill = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 5px 10px;
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 8px;
  font-size: 12px;
  color: #cbd5e1;
  margin-right: 6px;
  margin-bottom: 6px;
  transition: all 0.2s ease;

  a {
    color: inherit;
    text-decoration: none;
    &:hover {
      color: #38bdf8;
    }
  }

  button {
    background: none;
    border: none;
    color: #64748b;
    cursor: pointer;
    padding: 0;
    display: inline-flex;
    align-items: center;
    &:hover {
      color: #38bdf8;
    }
  }
`;

const CardQuoteBox = styled.div`
  background: rgba(15, 23, 42, 0.55);
  border: 1px solid rgba(255, 255, 255, 0.06);
  border-left: 3px solid ${(props) => props.$borderLeft || "#22d3ee"};
  border-radius: 10px;
  padding: 12px 14px;
  margin: 12px 0 16px;
  font-size: 13px;
  color: #cbd5e1;
  line-height: 1.6;
  max-height: 130px;
  overflow-y: auto;

  &::-webkit-scrollbar {
    width: 4px;
  }
  &::-webkit-scrollbar-thumb {
    background: rgba(255, 255, 255, 0.15);
    border-radius: 4px;
  }
`;

const CardActionsRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  padding-top: 14px;
  border-top: 1px solid rgba(255, 255, 255, 0.07);
  margin-top: auto;
  flex-wrap: wrap;
`;

const ViewToggleWrapper = styled.div`
  display: inline-flex;
  align-items: center;
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 10px;
  padding: 3px;
  gap: 3px;
`;

const ViewToggleBtn = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 5px;
  padding: 6px 12px;
  border: none;
  border-radius: 7px;
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
  background: ${(props) => (props.$active ? "linear-gradient(135deg, rgba(133, 76, 230, 0.25), rgba(34, 211, 238, 0.25))" : "transparent")};
  color: ${(props) => (props.$active ? "#22d3ee" : "#94a3b8")};
  border: 1px solid ${(props) => (props.$active ? "rgba(34, 211, 238, 0.4)" : "transparent")};
  transition: all 0.2s ease;

  &:hover {
    color: #ffffff;
  }
`;

const ProjectImageBanner = styled.div`
  height: 145px;
  border-radius: 12px;
  background: ${(props) =>
    props.$src
      ? `url(${props.$src}) center/cover no-repeat`
      : "linear-gradient(135deg, rgba(133, 76, 230, 0.25), rgba(34, 211, 238, 0.25))"};
  border: 1px solid rgba(255, 255, 255, 0.08);
  position: relative;
  overflow: hidden;
  margin-bottom: 14px;
  display: flex;
  align-items: flex-end;
  padding: 10px 12px;
  box-sizing: border-box;

  &::after {
    content: "";
    position: absolute;
    inset: 0;
    background: linear-gradient(180deg, transparent 35%, rgba(10, 15, 30, 0.88) 100%);
    pointer-events: none;
  }
`;

const CategoryPill = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 3px 9px;
  background: rgba(34, 211, 238, 0.15);
  border: 1px solid rgba(34, 211, 238, 0.35);
  color: #22d3ee;
  border-radius: 999px;
  font-size: 11px;
  font-weight: 700;
  text-transform: capitalize;
  letter-spacing: 0.3px;
  z-index: 1;
`;

const ScoreBadge = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 5px;
  background: rgba(192, 132, 252, 0.14);
  border: 1px solid rgba(192, 132, 252, 0.35);
  color: #c084fc;
  padding: 4px 10px;
  border-radius: 999px;
  font-size: 12px;
  font-weight: 600;
`;

// ======================== COMPONENT ========================
export default function AdminDashboard() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");

  // Login credentials state (Email + OTP based 2FA)
  const [loginEmail, setLoginEmail] = useState("ajaysapkale136@gmail.com");
  const [loginOtp, setLoginOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [otpSending, setOtpSending] = useState(false);
  const [otpCooldown, setOtpCooldown] = useState(0);
  const [loginError, setLoginError] = useState("");
  const [loginSuccess, setLoginSuccess] = useState("");

  // Data states
  const [stats, setStats] = useState(null);
  const [messages, setMessages] = useState([]);
  const [projects, setProjects] = useState([]);
  const [skills, setSkills] = useState([]);
  const [experiences, setExperiences] = useState([]);
  const [educationList, setEducationList] = useState([]);
  const [bio, setBio] = useState({
    name: "Ajay Sapkale",
    roles: "Java Full Stack Developer, Full Stack Developer, MERN Developer, Frontend Developer, Backend Developer",
    description: "",
    github: "",
    resume: "",
    linkedin: "",
    twitter: "",
    insta: "",
    facebook: "",
  });

  // Filter states
  const [messageSearch, setMessageSearch] = useState("");
  const [messageFilter, setMessageFilter] = useState("ALL"); // ALL, NEW, READ
  const [projectSearch, setProjectSearch] = useState("");
  const [experienceSearch, setExperienceSearch] = useState("");
  const [educationSearch, setEducationSearch] = useState("");

  // View mode states (default to 'cards' for executive card layout)
  const [messageViewMode, setMessageViewMode] = useState("cards");
  const [projectViewMode, setProjectViewMode] = useState("cards");
  const [experienceViewMode, setExperienceViewMode] = useState("cards");
  const [educationViewMode, setEducationViewMode] = useState("cards");

  // Edit Tracking
  const [editingProjectId, setEditingProjectId] = useState(null);
  const [editingExperienceId, setEditingExperienceId] = useState(null);
  const [editingEducationId, setEditingEducationId] = useState(null);

  // New Project Form state
  const [newProject, setNewProject] = useState({
    title: "",
    category: "fullstack",
    tags: "",
    description: "",
    imageUrl: "",
    githubUrl: "",
    liveUrl: "",
    dateRange: "",
    published: true,
  });

  // New Skill state
  const [newSkill, setNewSkill] = useState({
    category: "Frontend",
    name: "",
    imageUrl: "",
  });

  // Experience Form state
  const [experienceForm, setExperienceForm] = useState({
    company: "",
    role: "",
    dateRange: "",
    skills: "",
    description: "",
    certificateUrl: "",
  });

  // Education Form state
  const [educationForm, setEducationForm] = useState({
    school: "",
    degree: "",
    dateRange: "",
    grade: "",
    description: "",
  });

  const [notification, setNotification] = useState("");

  const showNotification = (msg) => {
    setNotification(msg);
    setTimeout(() => setNotification(""), 4000);
  };

  useEffect(() => {
    checkAuthStatus();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const checkAuthStatus = async () => {
    setLoading(true);
    const valid = await adminVerify();
    setIsAuthenticated(valid);
    if (valid) {
      loadAllDashboardData();
    }
    setLoading(false);
  };

  useEffect(() => {
    if (otpCooldown <= 0) return;
    const timer = setTimeout(() => setOtpCooldown((prev) => prev - 1), 1000);
    return () => clearTimeout(timer);
  }, [otpCooldown]);

  const handleSendOtp = async () => {
    setLoginError("");
    setLoginSuccess("");
    if (!loginEmail || !loginEmail.includes("@")) {
      setLoginError("Please enter a valid admin email address.");
      return;
    }
    setOtpSending(true);
    try {
      const res = await adminSendOtp(loginEmail);
      setOtpSent(true);
      setOtpCooldown(60);
      setLoginSuccess(res.message || "Verification code dispatched to your email! Please check your inbox.");
    } catch (err) {
      setLoginError(err.message || "Failed to dispatch verification code.");
    } finally {
      setOtpSending(false);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoginError("");
    setLoginSuccess("");
    if (!loginEmail || !loginOtp) {
      setLoginError("Please provide your Admin Email and 6-digit OTP or Master PIN.");
      return;
    }

    try {
      await adminLogin(loginEmail, loginOtp);
      setIsAuthenticated(true);
      loadAllDashboardData();
      showNotification("Welcome back, Ajay! Admin session active.");
    } catch (err) {
      setLoginError(err.message || "Invalid verification code");
    }
  };

  const handleLogout = () => {
    adminLogout();
    setIsAuthenticated(false);
  };

  const loadAllDashboardData = async () => {
    try {
      const [s, m, p, sk, b, exp, edu] = await Promise.all([
        adminGetStats().catch(() => null),
        adminGetMessages().catch(() => []),
        adminGetProjects().catch(() => []),
        adminGetSkills().catch(() => []),
        adminGetBio().catch(() => null),
        adminGetExperiences().catch(() => []),
        adminGetEducation().catch(() => []),
      ]);

      if (s) setStats(s);
      if (m) setMessages(m);
      if (p) setProjects(p);
      if (sk) setSkills(sk);
      if (exp) setExperiences(exp);
      if (edu) setEducationList(edu);
      if (b) {
        setBio({
          name: b.name || "Ajay Sapkale",
          roles: Array.isArray(b.roles) ? b.roles.join(", ") : b.roles || "",
          description: b.description || "",
          github: b.github || "",
          resume: b.resume || "",
          linkedin: b.linkedin || "",
          twitter: b.twitter || "",
          insta: b.insta || "",
          facebook: b.facebook || "",
        });
      }
    } catch (err) {
      console.error("Error loading dashboard data:", err);
    }
  };

  // Message Actions
  const handleDeleteMessage = async (id) => {
    if (!window.confirm("Are you sure you want to delete inquiry #" + id + "?")) return;
    try {
      await adminDeleteMessage(id);
      setMessages((prev) => prev.filter((m) => m.id !== id));
      showNotification("Inquiry #" + id + " deleted successfully.");
    } catch (err) {
      alert("Failed to delete message: " + err.message);
    }
  };

  const handleToggleMessageStatus = async (id, currentStatus) => {
    const nextStatus = currentStatus === "NEW" ? "READ" : "NEW";
    try {
      await adminUpdateMessageStatus(id, nextStatus);
      setMessages((prev) =>
        prev.map((m) => (m.id === id ? { ...m, status: nextStatus } : m))
      );
      if (nextStatus === "READ") {
        showNotification(`Inquiry #${id} marked as READ & visitor notified via email!`);
      } else {
        showNotification(`Inquiry #${id} marked as NEW.`);
      }
    } catch (err) {
      alert("Failed to update status: " + err.message);
    }
  };

  const copyToClipboard = (text, label) => {
    navigator.clipboard.writeText(text);
    showNotification(`Copied ${label} to clipboard!`);
  };

  // Project Actions
  const handleEditProjectClick = (proj) => {
    setEditingProjectId(proj.id);
    setNewProject({
      title: proj.title || "",
      category: proj.category || "fullstack",
      tags: proj.tags || "",
      description: proj.description || "",
      imageUrl: proj.imageUrl || "",
      githubUrl: proj.githubUrl || "",
      liveUrl: proj.liveUrl || "",
      dateRange: proj.dateRange || "",
      published: proj.published !== false,
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleCancelProjectEdit = () => {
    setEditingProjectId(null);
    setNewProject({
      title: "",
      category: "fullstack",
      tags: "",
      description: "",
      imageUrl: "",
      githubUrl: "",
      liveUrl: "",
      dateRange: "",
      published: true,
    });
  };

  const handleSaveProject = async (e) => {
    e.preventDefault();
    if (!newProject.title.trim()) return alert("Project title is required.");
    try {
      if (editingProjectId) {
        const updated = await adminUpdateProject(editingProjectId, newProject);
        setProjects((prev) =>
          prev.map((p) => (p.id === editingProjectId ? updated : p))
        );
        showNotification("Project #" + editingProjectId + " updated successfully!");
        handleCancelProjectEdit();
      } else {
        const created = await adminCreateProject(newProject);
        setProjects((prev) => [...prev, created]);
        handleCancelProjectEdit();
        showNotification("Project added & published to live portfolio!");
      }
    } catch (err) {
      alert("Failed to save project: " + err.message);
    }
  };

  const handleDeleteProject = async (id) => {
    if (!window.confirm("Are you sure you want to delete this project?")) return;
    try {
      await adminDeleteProject(id);
      setProjects((prev) => prev.filter((p) => p.id !== id));
      if (editingProjectId === id) handleCancelProjectEdit();
      showNotification("Project removed successfully.");
    } catch (err) {
      alert("Failed to delete project: " + err.message);
    }
  };

  // Skill Actions
  const handleCreateSkill = async (e) => {
    e.preventDefault();
    if (!newSkill.name.trim()) return alert("Skill name is required.");
    try {
      const created = await adminCreateSkill(newSkill);
      setSkills((prev) => [...prev, created]);
      setNewSkill({ category: "Frontend", name: "", imageUrl: "" });
      showNotification("Skill added to database!");
    } catch (err) {
      alert("Failed to add skill: " + err.message);
    }
  };

  const handleDeleteSkill = async (id) => {
    if (!window.confirm("Delete this skill from database?")) return;
    try {
      await adminDeleteSkill(id);
      setSkills((prev) => prev.filter((s) => s.id !== id));
      showNotification("Skill removed.");
    } catch (err) {
      alert("Failed to delete skill: " + err.message);
    }
  };

  // Experience / Internship Actions
  const handleEditExperienceClick = (item) => {
    setEditingExperienceId(item.id);
    setExperienceForm({
      company: item.company || "",
      role: item.role || "",
      dateRange: item.dateRange || "",
      skills: item.skills || "",
      description: item.description || "",
      certificateUrl: item.certificateUrl || "",
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleCancelExperienceEdit = () => {
    setEditingExperienceId(null);
    setExperienceForm({
      company: "",
      role: "",
      dateRange: "",
      skills: "",
      description: "",
      certificateUrl: "",
    });
  };

  const handleSaveExperience = async (e) => {
    e.preventDefault();
    if (!experienceForm.company.trim() || !experienceForm.role.trim()) {
      return alert("Company name and role are required.");
    }
    try {
      if (editingExperienceId) {
        const updated = await adminUpdateExperience(editingExperienceId, experienceForm);
        setExperiences((prev) =>
          prev.map((x) => (x.id === editingExperienceId ? updated : x))
        );
        showNotification("Internship #" + editingExperienceId + " updated successfully!");
        handleCancelExperienceEdit();
      } else {
        const created = await adminCreateExperience(experienceForm);
        setExperiences((prev) => [...prev, created]);
        handleCancelExperienceEdit();
        showNotification("Internship / Experience added to portfolio!");
      }
    } catch (err) {
      alert("Failed to save experience: " + err.message);
    }
  };

  const handleDeleteExperience = async (id) => {
    if (!window.confirm("Are you sure you want to delete this internship / experience?")) return;
    try {
      await adminDeleteExperience(id);
      setExperiences((prev) => prev.filter((x) => x.id !== id));
      if (editingExperienceId === id) handleCancelExperienceEdit();
      showNotification("Experience #" + id + " removed successfully.");
    } catch (err) {
      alert("Failed to delete experience: " + err.message);
    }
  };

  // Education Actions
  const handleEditEducationClick = (item) => {
    setEditingEducationId(item.id);
    setEducationForm({
      school: item.school || "",
      degree: item.degree || "",
      dateRange: item.dateRange || "",
      grade: item.grade || "",
      description: item.description || "",
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleCancelEducationEdit = () => {
    setEditingEducationId(null);
    setEducationForm({
      school: "",
      degree: "",
      dateRange: "",
      grade: "",
      description: "",
    });
  };

  const handleSaveEducation = async (e) => {
    e.preventDefault();
    if (!educationForm.school.trim() || !educationForm.degree.trim()) {
      return alert("School/College name and degree are required.");
    }
    try {
      if (editingEducationId) {
        const updated = await adminUpdateEducation(editingEducationId, educationForm);
        setEducationList((prev) =>
          prev.map((ed) => (ed.id === editingEducationId ? updated : ed))
        );
        showNotification("Education #" + editingEducationId + " updated successfully!");
        handleCancelEducationEdit();
      } else {
        const created = await adminCreateEducation(educationForm);
        setEducationList((prev) => [...prev, created]);
        handleCancelEducationEdit();
        showNotification("Education record added to portfolio!");
      }
    } catch (err) {
      alert("Failed to save education: " + err.message);
    }
  };

  const handleDeleteEducation = async (id) => {
    if (!window.confirm("Are you sure you want to delete this education record?")) return;
    try {
      await adminDeleteEducation(id);
      setEducationList((prev) => prev.filter((ed) => ed.id !== id));
      if (editingEducationId === id) handleCancelEducationEdit();
      showNotification("Education #" + id + " removed successfully.");
    } catch (err) {
      alert("Failed to delete education: " + err.message);
    }
  };

  // Bio / Resume Action
  const handleSaveBio = async (e) => {
    e.preventDefault();
    try {
      await adminUpdateBio(bio);
      showNotification("Profile and resume link updated across entire portfolio!");
    } catch (err) {
      alert("Failed to update bio: " + err.message);
    }
  };

  // Filtered Messages
  const filteredMessages = useMemo(() => {
    return messages.filter((m) => {
      const matchFilter =
        messageFilter === "ALL" || m.status === messageFilter;
      const matchSearch =
        !messageSearch.trim() ||
        (m.name && m.name.toLowerCase().includes(messageSearch.toLowerCase())) ||
        (m.email && m.email.toLowerCase().includes(messageSearch.toLowerCase())) ||
        (m.phoneNumber && m.phoneNumber.toLowerCase().includes(messageSearch.toLowerCase())) ||
        (m.subject && m.subject.toLowerCase().includes(messageSearch.toLowerCase())) ||
        (m.message && m.message.toLowerCase().includes(messageSearch.toLowerCase()));
      return matchFilter && matchSearch;
    });
  }, [messages, messageFilter, messageSearch]);

  // Filtered Projects
  const filteredProjects = useMemo(() => {
    return projects.filter((p) => {
      if (!projectSearch.trim()) return true;
      const q = projectSearch.toLowerCase();
      return (
        (p.title && p.title.toLowerCase().includes(q)) ||
        (p.category && p.category.toLowerCase().includes(q)) ||
        (p.tags && p.tags.toLowerCase().includes(q)) ||
        (p.description && p.description.toLowerCase().includes(q))
      );
    });
  }, [projects, projectSearch]);

  // Filtered Experiences
  const filteredExperiences = useMemo(() => {
    if (!experienceSearch.trim()) return experiences;
    const q = experienceSearch.toLowerCase();
    return experiences.filter(
      (x) =>
        (x.company && x.company.toLowerCase().includes(q)) ||
        (x.role && x.role.toLowerCase().includes(q)) ||
        (x.skills && x.skills.toLowerCase().includes(q)) ||
        (x.description && x.description.toLowerCase().includes(q))
    );
  }, [experiences, experienceSearch]);

  // Filtered Education
  const filteredEducation = useMemo(() => {
    if (!educationSearch.trim()) return educationList;
    const q = educationSearch.toLowerCase();
    return educationList.filter(
      (ed) =>
        (ed.school && ed.school.toLowerCase().includes(q)) ||
        (ed.degree && ed.degree.toLowerCase().includes(q)) ||
        (ed.grade && ed.grade.toLowerCase().includes(q)) ||
        (ed.description && ed.description.toLowerCase().includes(q))
    );
  }, [educationList, educationSearch]);

  const newMessagesCount = useMemo(() => {
    return messages.filter((m) => m.status === "NEW").length;
  }, [messages]);

  // Loading Screen
  if (loading) {
    return (
      <Container style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ textAlign: "center", padding: "80px" }}>
          <StatusDot style={{ margin: "0 auto 16px", width: 14, height: 14 }} />
          <h2 style={{ fontSize: "18px", color: "#94a3b8" }}>Verifying Secure Admin Session...</h2>
        </div>
      </Container>
    );
  }

  // Login Screen
  if (!isAuthenticated) {
    return (
      <Container style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
        <GlassCard style={{ maxWidth: "440px", width: "100%", padding: "40px" }}>
          <div style={{ textAlign: "center", marginBottom: "26px" }}>
            <div
              style={{
                width: "56px",
                height: "56px",
                margin: "0 auto 14px",
                borderRadius: "16px",
                background: "linear-gradient(135deg, rgba(133, 76, 230, 0.25), rgba(34, 211, 238, 0.25))",
                border: "1px solid rgba(34, 211, 238, 0.4)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#22d3ee",
              }}
            >
              <AdminPanelSettingsRounded style={{ fontSize: "32px" }} />
            </div>
            <Title style={{ justifyContent: "center", fontSize: "24px" }}>Admin Portal</Title>
            <p style={{ color: "#94a3b8", fontSize: "13.5px", marginTop: "8px" }}>
              Sign in to manage your 3D portfolio, inquiries, skills & resume
            </p>
          </div>

          {loginError && (
            <div
              style={{
                background: "rgba(239, 68, 68, 0.15)",
                border: "1px solid #ef4444",
                color: "#fca5a5",
                padding: "11px 16px",
                borderRadius: "10px",
                fontSize: "13px",
                marginBottom: "20px",
              }}
            >
              ⚠️ {loginError}
            </div>
          )}

          {loginSuccess && (
            <div
              style={{
                background: "rgba(34, 197, 94, 0.15)",
                border: "1px solid #22c55e",
                color: "#86efac",
                padding: "11px 16px",
                borderRadius: "10px",
                fontSize: "13px",
                marginBottom: "20px",
              }}
            >
              ✅ {loginSuccess}
            </div>
          )}

          {!otpSent && !loginSuccess && !loginError && (
            <div
              style={{
                background: "rgba(34, 211, 238, 0.08)",
                border: "1px solid rgba(34, 211, 238, 0.25)",
                color: "#7dd3fc",
                padding: "10px 14px",
                borderRadius: "10px",
                fontSize: "12.5px",
                marginBottom: "20px",
                lineHeight: "1.4",
              }}
            >
              ℹ️ Click <strong>"Send OTP"</strong> to receive your 6-digit access code at your registered email address.
            </div>
          )}

          <form onSubmit={handleLogin}>
            <FormGroup>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "4px" }}>
                <Label style={{ margin: 0 }}>Admin Email ID</Label>
                <button
                  type="button"
                  onClick={handleSendOtp}
                  disabled={otpSending || otpCooldown > 0}
                  style={{
                    background: otpCooldown > 0 ? "rgba(148, 163, 184, 0.15)" : "linear-gradient(135deg, rgba(34, 211, 238, 0.2), rgba(133, 76, 230, 0.2))",
                    border: "1px solid rgba(34, 211, 238, 0.4)",
                    color: otpCooldown > 0 ? "#94a3b8" : "#22d3ee",
                    borderRadius: "8px",
                    padding: "4px 12px",
                    fontSize: "12px",
                    cursor: otpCooldown > 0 || otpSending ? "not-allowed" : "pointer",
                    fontWeight: "600",
                    transition: "all 0.2s ease",
                  }}
                >
                  {otpSending ? "Sending OTP..." : otpCooldown > 0 ? `Resend in ${otpCooldown}s` : otpSent ? "Resend OTP" : "Send OTP"}
                </button>
              </div>
              <Input
                type="email"
                value={loginEmail}
                onChange={(e) => setLoginEmail(e.target.value)}
                placeholder="ajaysapkale136@gmail.com"
                required
              />
            </FormGroup>

            <FormGroup>
              <Label>Verification Code (6-Digit OTP or PIN)</Label>
              <Input
                type="text"
                maxLength="64"
                value={loginOtp}
                onChange={(e) => setLoginOtp(e.target.value.trim())}
                placeholder="Enter 6-digit OTP or PIN (202600)"
                required
                style={{ letterSpacing: "3px", fontSize: "16px", fontWeight: "600" }}
              />
            </FormGroup>

            <SubmitBtn type="submit" style={{ width: "100%", marginTop: "12px", justifyContent: "center" }}>
              Verify OTP & Access Control Center
            </SubmitBtn>
          </form>

          <div style={{ textAlign: "center", marginTop: "24px" }}>
            <Link to="/" style={{ color: "#38bdf8", fontSize: "13px", textDecoration: "none" }}>
              ← Return to 3D Portfolio
            </Link>
          </div>
        </GlassCard>
      </Container>
    );
  }

  // Dashboard Main View
  return (
    <Container>
      {notification && (
        <ToastNotification>
          <CheckCircleRounded style={{ fontSize: "20px" }} />
          <span>{notification}</span>
        </ToastNotification>
      )}

      <Header>
        <BrandSection>
          <Title>
            <AdminPanelSettingsRounded style={{ fontSize: "30px", color: "#22d3ee" }} />
            Ajay's Portfolio Control Center
          </Title>
          <StatusPillRow>
            <LiveStatusBadge>
              <StatusDot /> Spring Boot & MySQL Connected
            </LiveStatusBadge>
            <SecBadge>🔒 Session Active</SecBadge>
          </StatusPillRow>
        </BrandSection>

        <HeaderActions>
          <NavButton to="/">
            <OpenInNewRounded style={{ fontSize: "16px" }} /> View Portfolio
          </NavButton>
          <LogoutButton onClick={handleLogout}>
            <LogoutRounded style={{ fontSize: "16px" }} /> Log Out
          </LogoutButton>
        </HeaderActions>
      </Header>

      <MainContent>
        <TabNav>
          <TabButton active={activeTab === "overview"} onClick={() => setActiveTab("overview")}>
            <DashboardRounded style={{ fontSize: "18px" }} /> Overview
          </TabButton>
          <TabButton active={activeTab === "messages"} onClick={() => setActiveTab("messages")}>
            <MailRounded style={{ fontSize: "18px" }} /> Inquiries
            <TabCountBadge active={activeTab === "messages"}>
              {newMessagesCount > 0 ? `${newMessagesCount} new` : messages.length}
            </TabCountBadge>
          </TabButton>
          <TabButton active={activeTab === "projects"} onClick={() => setActiveTab("projects")}>
            <CodeRounded style={{ fontSize: "18px" }} /> Projects
            <TabCountBadge active={activeTab === "projects"}>{projects.length}</TabCountBadge>
          </TabButton>
          <TabButton active={activeTab === "skills"} onClick={() => setActiveTab("skills")}>
            <BoltRounded style={{ fontSize: "18px" }} /> Skills
            <TabCountBadge active={activeTab === "skills"}>{skills.length}</TabCountBadge>
          </TabButton>
          <TabButton active={activeTab === "experiences"} onClick={() => setActiveTab("experiences")}>
            <WorkRounded style={{ fontSize: "18px" }} /> Internships
            <TabCountBadge active={activeTab === "experiences"}>{experiences.length}</TabCountBadge>
          </TabButton>
          <TabButton active={activeTab === "education"} onClick={() => setActiveTab("education")}>
            <SchoolRounded style={{ fontSize: "18px" }} /> Education
            <TabCountBadge active={activeTab === "education"}>{educationList.length}</TabCountBadge>
          </TabButton>
          <TabButton active={activeTab === "profile"} onClick={() => setActiveTab("profile")}>
            <DescriptionRounded style={{ fontSize: "18px" }} /> Resume & Bio
          </TabButton>
        </TabNav>

        {/* 1. OVERVIEW TAB */}
        {activeTab === "overview" && (
          <div>
            <StatsGrid>
              <StatCard borderColor="rgba(56, 189, 248, 0.25)">
                <StatCardTop>
                  <StatIconBox bg="rgba(56, 189, 248, 0.14)" color="#38bdf8">
                    <MailRounded style={{ fontSize: "24px" }} />
                  </StatIconBox>
                  <span style={{ fontSize: "12px", color: "#38bdf8", fontWeight: "600" }}>Live Database</span>
                </StatCardTop>
                <StatLabel>Total Inquiries</StatLabel>
                <StatValue color="#38bdf8">{stats ? stats.totalMessages : messages.length}</StatValue>
                <StatSubtext color="#94a3b8">Submitted through contact form</StatSubtext>
              </StatCard>

              <StatCard borderColor="rgba(16, 185, 129, 0.25)">
                <StatCardTop>
                  <StatIconBox bg="rgba(16, 185, 129, 0.14)" color="#10b981">
                    <CheckCircleRounded style={{ fontSize: "24px" }} />
                  </StatIconBox>
                  <span style={{ fontSize: "12px", color: "#10b981", fontWeight: "600" }}>Needs Action</span>
                </StatCardTop>
                <StatLabel>New Unread Inquiries</StatLabel>
                <StatValue color="#10b981">
                  {stats ? stats.newMessages : newMessagesCount}
                </StatValue>
                <StatSubtext color={newMessagesCount > 0 ? "#34d399" : "#64748b"}>
                  {newMessagesCount > 0 ? "⚡ Pending recruiter responses" : "All messages reviewed"}
                </StatSubtext>
              </StatCard>

              <StatCard borderColor="rgba(168, 85, 247, 0.25)">
                <StatCardTop>
                  <StatIconBox bg="rgba(168, 85, 247, 0.14)" color="#a855f7">
                    <CodeRounded style={{ fontSize: "24px" }} />
                  </StatIconBox>
                  <span style={{ fontSize: "12px", color: "#c084fc", fontWeight: "600" }}>Projects API</span>
                </StatCardTop>
                <StatLabel>Published Projects</StatLabel>
                <StatValue color="#c084fc">{stats ? stats.totalProjects : projects.length}</StatValue>
                <StatSubtext color="#94a3b8">Featured on portfolio website</StatSubtext>
              </StatCard>

              <StatCard borderColor="rgba(245, 158, 11, 0.25)">
                <StatCardTop>
                  <StatIconBox bg="rgba(245, 158, 11, 0.14)" color="#f59e0b">
                    <BoltRounded style={{ fontSize: "24px" }} />
                  </StatIconBox>
                  <span style={{ fontSize: "12px", color: "#fbbf24", fontWeight: "600" }}>Skills DB</span>
                </StatCardTop>
                <StatLabel>Database Skills</StatLabel>
                <StatValue color="#fbbf24">{stats ? stats.totalSkills : skills.length}</StatValue>
                <StatSubtext color="#94a3b8">Grounded in AI chat engine</StatSubtext>
              </StatCard>

              <StatCard borderColor="rgba(14, 165, 233, 0.25)">
                <StatCardTop>
                  <StatIconBox bg="rgba(14, 165, 233, 0.14)" color="#0ea5e9">
                    <WorkRounded style={{ fontSize: "24px" }} />
                  </StatIconBox>
                  <span style={{ fontSize: "12px", color: "#38bdf8", fontWeight: "600" }}>Internships</span>
                </StatCardTop>
                <StatLabel>Work Experience</StatLabel>
                <StatValue color="#38bdf8">{experiences.length}</StatValue>
                <StatSubtext color="#94a3b8">Live on Experience timeline</StatSubtext>
              </StatCard>

              <StatCard borderColor="rgba(192, 132, 252, 0.25)">
                <StatCardTop>
                  <StatIconBox bg="rgba(192, 132, 252, 0.14)" color="#c084fc">
                    <SchoolRounded style={{ fontSize: "24px" }} />
                  </StatIconBox>
                  <span style={{ fontSize: "12px", color: "#c084fc", fontWeight: "600" }}>Education</span>
                </StatCardTop>
                <StatLabel>Degrees & Colleges</StatLabel>
                <StatValue color="#c084fc">{educationList.length}</StatValue>
                <StatSubtext color="#94a3b8">Live on Education section</StatSubtext>
              </StatCard>
            </StatsGrid>

            {/* Quick Actions & Live Synchronizer */}
            <GlassCard>
              <SectionHeader>
                <SectionTitle>⚡ Real-Time Synchronizer & Quick Controls</SectionTitle>
                <span style={{ fontSize: "12px", color: "#94a3b8" }}>
                  Zero-Rebuild Real-Time Updates
                </span>
              </SectionHeader>
              <p style={{ color: "#94a3b8", fontSize: "14px", lineHeight: "1.7", margin: "0 0 20px" }}>
                Every project, skill, internship, and education entry modified here is saved directly to your cloud MySQL database.
                The <strong>Spring AI Chatbot</strong> and live portfolio automatically query this state in real time.
              </p>
              <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
                <ActionBtn primary onClick={() => setActiveTab("messages")}>
                  <MailRounded style={{ fontSize: "16px" }} /> Review Inquiries ({messages.length})
                </ActionBtn>
                <ActionBtn primary onClick={() => setActiveTab("projects")}>
                  <CodeRounded style={{ fontSize: "16px" }} /> Add / Edit Projects ({projects.length})
                </ActionBtn>
                <ActionBtn primary onClick={() => setActiveTab("experiences")}>
                  <WorkRounded style={{ fontSize: "16px" }} /> Add / Edit Internships ({experiences.length})
                </ActionBtn>
                <ActionBtn primary onClick={() => setActiveTab("education")}>
                  <SchoolRounded style={{ fontSize: "16px" }} /> Add / Edit Education ({educationList.length})
                </ActionBtn>
                <ActionBtn primary onClick={() => setActiveTab("profile")}>
                  <DescriptionRounded style={{ fontSize: "16px" }} /> Update Resume Link
                </ActionBtn>
              </div>
            </GlassCard>

            {/* Recent Inquiries Preview */}
            <GlassCard>
              <SectionHeader>
                <div>
                  <SectionTitle>📩 Recent Inquiries Snapshot</SectionTitle>
                  <span style={{ fontSize: "12.5px", color: "#94a3b8" }}>
                    Showing latest contact messages received from portfolio visitors
                  </span>
                </div>
                <ActionBtn onClick={() => setActiveTab("messages")} primary>
                  View All Inquiries ({messages.length}) →
                </ActionBtn>
              </SectionHeader>

              {messages.length === 0 ? (
                <div style={{ textAlign: "center", padding: "36px 20px", color: "#94a3b8" }}>
                  <MailRounded style={{ fontSize: "36px", color: "#64748b", marginBottom: "8px" }} />
                  <p style={{ margin: 0 }}>No messages received yet.</p>
                </div>
              ) : (
                <CardGrid>
                  {messages.slice(0, 4).map((m) => {
                    const initials = m.name ? m.name.trim().charAt(0).toUpperCase() : "U";
                    const isNew = m.status === "NEW";
                    return (
                      <ItemCard
                        key={m.id}
                        $highlight={isNew}
                        $borderColor={isNew ? "rgba(16, 185, 129, 0.35)" : "rgba(255, 255, 255, 0.08)"}
                        $hoverBorder={isNew ? "rgba(16, 185, 129, 0.6)" : "rgba(34, 211, 238, 0.45)"}
                        $accentGradient={isNew ? "linear-gradient(90deg, #10b981, #22d3ee)" : "linear-gradient(90deg, #64748b, #94a3b8)"}
                      >
                        <div>
                          <CardHeaderTop>
                            <div style={{ display: "flex", gap: "12px", alignItems: "center", minWidth: 0 }}>
                              <CardAvatar
                                $bg={isNew ? "rgba(16, 185, 129, 0.15)" : "rgba(255, 255, 255, 0.05)"}
                                $border={isNew ? "rgba(16, 185, 129, 0.4)" : "rgba(255, 255, 255, 0.12)"}
                                $color={isNew ? "#34d399" : "#cbd5e1"}
                              >
                                {initials}
                              </CardAvatar>
                              <CardMetaBlock>
                                <CardTitle title={m.name}>{m.name}</CardTitle>
                                <CardDateChip>
                                  <CalendarTodayRounded style={{ fontSize: "11px" }} />
                                  {m.createdAt ? new Date(m.createdAt).toLocaleDateString() : "Recent"}
                                </CardDateChip>
                              </CardMetaBlock>
                            </div>
                            <StatusBadge type={m.status}>
                              {isNew && <StatusDot style={{ width: 6, height: 6 }} />}
                              {m.status}
                            </StatusBadge>
                          </CardHeaderTop>

                          <div style={{ display: "flex", flexWrap: "wrap", gap: "6px", marginBottom: "8px" }}>
                            <CardInfoPill>
                              <MailRounded style={{ fontSize: "13px", color: "#38bdf8" }} />
                              <a href={`mailto:${m.email}`}>{m.email}</a>
                              <button onClick={() => copyToClipboard(m.email, "Email")} title="Copy email">
                                <ContentCopyRounded style={{ fontSize: "12px" }} />
                              </button>
                            </CardInfoPill>
                            {m.phoneNumber && (
                              <CardInfoPill>
                                <PhoneRounded style={{ fontSize: "13px", color: "#34d399" }} />
                                <a href={`tel:${m.phoneNumber}`}>{m.phoneNumber}</a>
                                <button onClick={() => copyToClipboard(m.phoneNumber, "Phone number")} title="Copy phone">
                                  <ContentCopyRounded style={{ fontSize: "12px" }} />
                                </button>
                              </CardInfoPill>
                            )}
                          </div>

                          <div style={{ fontSize: "12.5px", fontWeight: "700", color: "#38bdf8", marginBottom: "4px" }}>
                            {m.subject || "No Subject"}
                          </div>

                          <CardQuoteBox $borderLeft={isNew ? "#10b981" : "#854ce6"}>
                            {m.message}
                          </CardQuoteBox>
                        </div>

                        <CardActionsRow>
                          <ActionBtn
                            onClick={() => handleToggleMessageStatus(m.id, m.status)}
                            style={{
                              background: isNew ? "rgba(16, 185, 129, 0.15)" : "rgba(255, 255, 255, 0.06)",
                              borderColor: isNew ? "rgba(16, 185, 129, 0.35)" : "rgba(255, 255, 255, 0.12)",
                              color: isNew ? "#34d399" : "#cbd5e1",
                            }}
                          >
                            <MarkEmailReadRounded style={{ fontSize: "14px" }} />
                            {isNew ? "Mark as Read" : "Mark as New"}
                          </ActionBtn>
                          <ActionBtn onClick={() => setActiveTab("messages")}>
                            Open in Inbox →
                          </ActionBtn>
                        </CardActionsRow>
                      </ItemCard>
                    );
                  })}
                </CardGrid>
              )}
            </GlassCard>
          </div>
        )}

        {/* 2. MESSAGES TAB */}
        {activeTab === "messages" && (
          <GlassCard>
            <SectionHeader>
              <div>
                <SectionTitle>📬 Visitor & Recruiter Inquiries</SectionTitle>
                <span style={{ fontSize: "13px", color: "#94a3b8" }}>
                  Showing {filteredMessages.length} of {messages.length} inquiries
                </span>
              </div>

              <div style={{ display: "flex", gap: "10px", alignItems: "center", flexWrap: "wrap" }}>
                <ViewToggleWrapper>
                  <ViewToggleBtn
                    $active={messageViewMode === "cards"}
                    onClick={() => setMessageViewMode("cards")}
                    title="Grid Cards View"
                  >
                    <GridViewRounded style={{ fontSize: "14px" }} /> Cards
                  </ViewToggleBtn>
                  <ViewToggleBtn
                    $active={messageViewMode === "table"}
                    onClick={() => setMessageViewMode("table")}
                    title="Compact Table View"
                  >
                    <ViewListRounded style={{ fontSize: "14px" }} /> Table
                  </ViewToggleBtn>
                </ViewToggleWrapper>

                <SearchInputWrapper>
                  <SearchRounded />
                  <SearchInput
                    type="text"
                    placeholder="Search by name, email, subject..."
                    value={messageSearch}
                    onChange={(e) => setMessageSearch(e.target.value)}
                  />
                </SearchInputWrapper>

                <div style={{ display: "flex", gap: "6px" }}>
                  {["ALL", "NEW", "READ"].map((f) => (
                    <ActionBtn
                      key={f}
                      onClick={() => setMessageFilter(f)}
                      style={{
                        background: messageFilter === f ? "rgba(34, 211, 238, 0.2)" : "rgba(255, 255, 255, 0.05)",
                        borderColor: messageFilter === f ? "#22d3ee" : "rgba(255, 255, 255, 0.1)",
                        color: messageFilter === f ? "#22d3ee" : "#94a3b8",
                      }}
                    >
                      {f}
                    </ActionBtn>
                  ))}
                </div>
              </div>
            </SectionHeader>

            {filteredMessages.length === 0 ? (
              <div style={{ textAlign: "center", padding: "48px 20px", color: "#94a3b8" }}>
                <MailRounded style={{ fontSize: "40px", color: "#64748b", marginBottom: "12px" }} />
                <p style={{ margin: 0 }}>No contact inquiries matched your current filter.</p>
              </div>
            ) : messageViewMode === "cards" ? (
              <CardGrid>
                {filteredMessages.map((m) => {
                  const initials = m.name ? m.name.trim().charAt(0).toUpperCase() : "U";
                  const isNew = m.status === "NEW";
                  return (
                    <ItemCard
                      key={m.id}
                      $highlight={isNew}
                      $borderColor={isNew ? "rgba(16, 185, 129, 0.35)" : "rgba(255, 255, 255, 0.08)"}
                      $hoverBorder={isNew ? "rgba(16, 185, 129, 0.6)" : "rgba(34, 211, 238, 0.45)"}
                      $accentGradient={isNew ? "linear-gradient(90deg, #10b981, #22d3ee)" : "linear-gradient(90deg, #64748b, #94a3b8)"}
                    >
                      <div>
                        <CardHeaderTop>
                          <div style={{ display: "flex", gap: "12px", alignItems: "center", minWidth: 0 }}>
                            <CardAvatar
                              $bg={isNew ? "rgba(16, 185, 129, 0.15)" : "rgba(255, 255, 255, 0.05)"}
                              $border={isNew ? "rgba(16, 185, 129, 0.4)" : "rgba(255, 255, 255, 0.12)"}
                              $color={isNew ? "#34d399" : "#cbd5e1"}
                            >
                              {initials}
                            </CardAvatar>
                            <CardMetaBlock>
                              <CardTitle title={m.name}>{m.name}</CardTitle>
                              <CardDateChip>
                                <CalendarTodayRounded style={{ fontSize: "11px" }} />
                                {m.createdAt ? new Date(m.createdAt).toLocaleDateString() : "Recent"}
                              </CardDateChip>
                            </CardMetaBlock>
                          </div>
                          <StatusBadge type={m.status}>
                            {isNew && <StatusDot style={{ width: 6, height: 6 }} />}
                            {m.status}
                          </StatusBadge>
                        </CardHeaderTop>

                        <div style={{ display: "flex", flexWrap: "wrap", gap: "6px", marginBottom: "8px" }}>
                          <CardInfoPill>
                            <MailRounded style={{ fontSize: "13px", color: "#38bdf8" }} />
                            <a href={`mailto:${m.email}`}>{m.email}</a>
                            <button onClick={() => copyToClipboard(m.email, "Email")} title="Copy email">
                              <ContentCopyRounded style={{ fontSize: "12px" }} />
                            </button>
                          </CardInfoPill>
                          {m.phoneNumber ? (
                            <CardInfoPill>
                              <PhoneRounded style={{ fontSize: "13px", color: "#34d399" }} />
                              <a href={`tel:${m.phoneNumber}`}>{m.phoneNumber}</a>
                              <button onClick={() => copyToClipboard(m.phoneNumber, "Phone number")} title="Copy phone">
                                <ContentCopyRounded style={{ fontSize: "12px" }} />
                              </button>
                            </CardInfoPill>
                          ) : (
                            <span style={{ fontSize: "11px", color: "#64748b", alignSelf: "center", marginLeft: "4px" }}>
                              No phone
                            </span>
                          )}
                        </div>

                        <div style={{ fontSize: "13px", fontWeight: "700", color: "#38bdf8", marginBottom: "4px" }}>
                          {m.subject || "No Subject"}
                        </div>

                        <CardQuoteBox $borderLeft={isNew ? "#10b981" : "#854ce6"}>
                          {m.message}
                        </CardQuoteBox>
                      </div>

                      <CardActionsRow>
                        <ActionBtn
                          onClick={() => handleToggleMessageStatus(m.id, m.status)}
                          style={{
                            background: isNew ? "rgba(16, 185, 129, 0.15)" : "rgba(255, 255, 255, 0.06)",
                            borderColor: isNew ? "rgba(16, 185, 129, 0.35)" : "rgba(255, 255, 255, 0.12)",
                            color: isNew ? "#34d399" : "#cbd5e1",
                          }}
                        >
                          <MarkEmailReadRounded style={{ fontSize: "14px" }} />
                          {isNew ? "Mark as Read" : "Mark as New"}
                        </ActionBtn>
                        <ActionBtn danger onClick={() => handleDeleteMessage(m.id)}>
                          <DeleteOutlineRounded style={{ fontSize: "14px" }} /> Delete
                        </ActionBtn>
                      </CardActionsRow>
                    </ItemCard>
                  );
                })}
              </CardGrid>
            ) : (
              <div style={{ overflowX: "auto" }}>
                <Table>
                  <thead>
                    <tr>
                      <Th>Status</Th>
                      <Th>Date</Th>
                      <Th>Sender Information</Th>
                      <Th>Inquiry & Content</Th>
                      <Th>Actions</Th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredMessages.map((m) => (
                      <Tr key={m.id}>
                        <Td>
                          <StatusBadge type={m.status}>{m.status}</StatusBadge>
                        </Td>
                        <Td style={{ whiteSpace: "nowrap", fontSize: "12px", color: "#94a3b8" }}>
                          {m.createdAt ? new Date(m.createdAt).toLocaleDateString() : "Recent"}
                        </Td>
                        <Td style={{ minWidth: "220px" }}>
                          <strong style={{ color: "#ffffff", fontSize: "14px" }}>{m.name}</strong>
                          <div style={{ fontSize: "12.5px", color: "#38bdf8", marginTop: "2px", display: "flex", alignItems: "center", gap: "6px" }}>
                            <a href={`mailto:${m.email}`} style={{ color: "inherit", textDecoration: "none" }}>
                              {m.email}
                            </a>
                            <button
                              onClick={() => copyToClipboard(m.email, "Email")}
                              style={{ background: "none", border: "none", color: "#64748b", cursor: "pointer", padding: "2px" }}
                              title="Copy email"
                            >
                              <ContentCopyRounded style={{ fontSize: "13px" }} />
                            </button>
                          </div>
                          {m.phoneNumber ? (
                            <div style={{ fontSize: "12.5px", color: "#34d399", marginTop: "4px", display: "flex", alignItems: "center", gap: "6px" }}>
                              <PhoneRounded style={{ fontSize: "13px" }} />
                              <a href={`tel:${m.phoneNumber}`} style={{ color: "inherit", textDecoration: "none" }}>
                                {m.phoneNumber}
                              </a>
                              <button
                                onClick={() => copyToClipboard(m.phoneNumber, "Phone number")}
                                style={{ background: "none", border: "none", color: "#64748b", cursor: "pointer", padding: "2px" }}
                                title="Copy phone number"
                              >
                                <ContentCopyRounded style={{ fontSize: "13px" }} />
                              </button>
                            </div>
                          ) : (
                            <div style={{ fontSize: "11px", color: "#64748b", marginTop: "3px" }}>
                              No phone provided
                            </div>
                          )}
                        </Td>
                        <Td style={{ maxWidth: "460px" }}>
                          <strong style={{ color: "#f8fafc", fontSize: "14px" }}>{m.subject}</strong>
                          <p style={{ margin: "6px 0 0", color: "#cbd5e1", fontSize: "13px", lineHeight: "1.6" }}>
                            {m.message}
                          </p>
                        </Td>
                        <Td style={{ whiteSpace: "nowrap" }}>
                          <ActionBtn onClick={() => handleToggleMessageStatus(m.id, m.status)}>
                            <MarkEmailReadRounded style={{ fontSize: "14px" }} />
                            {m.status === "NEW" ? "Mark Read" : "Mark New"}
                          </ActionBtn>
                          <ActionBtn danger onClick={() => handleDeleteMessage(m.id)}>
                            <DeleteOutlineRounded style={{ fontSize: "14px" }} />
                            Delete
                          </ActionBtn>
                        </Td>
                      </Tr>
                    ))}
                  </tbody>
                </Table>
              </div>
            )}
          </GlassCard>
        )}

        {/* 3. PROJECTS TAB */}
        {activeTab === "projects" && (
          <div>
            <GlassCard>
              <SectionHeader>
                <SectionTitle>
                  <CodeRounded style={{ fontSize: "24px", color: "#22d3ee" }} />
                  {editingProjectId
                    ? `Edit Project #${editingProjectId}: ${newProject.title || "Untitled"}`
                    : "Add & Publish New Project"}
                </SectionTitle>
                {editingProjectId && (
                  <ActionBtn onClick={handleCancelProjectEdit}>
                    <CloseRounded style={{ fontSize: "15px" }} /> Cancel Edit
                  </ActionBtn>
                )}
              </SectionHeader>

              <form onSubmit={handleSaveProject}>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "18px" }}>
                  <FormGroup>
                    <Label>Project Title *</Label>
                    <Input
                      type="text"
                      placeholder="e.g. Smart AI Analytics Platform"
                      value={newProject.title}
                      onChange={(e) => setNewProject({ ...newProject, title: e.target.value })}
                      required
                    />
                  </FormGroup>

                  <FormGroup>
                    <Label>Category</Label>
                    <Input
                      type="text"
                      placeholder="fullstack / web / ai / android"
                      value={newProject.category}
                      onChange={(e) => setNewProject({ ...newProject, category: e.target.value })}
                    />
                  </FormGroup>

                  <FormGroup>
                    <Label>Timeline / Date</Label>
                    <Input
                      type="text"
                      placeholder="e.g. Jan 2026 - Mar 2026"
                      value={newProject.dateRange}
                      onChange={(e) => setNewProject({ ...newProject, dateRange: e.target.value })}
                    />
                  </FormGroup>

                  <FormGroup>
                    <Label>GitHub URL</Label>
                    <Input
                      type="text"
                      placeholder="https://github.com/ajaysapkale136/..."
                      value={newProject.githubUrl}
                      onChange={(e) => setNewProject({ ...newProject, githubUrl: e.target.value })}
                    />
                  </FormGroup>

                  <FormGroup>
                    <Label>Live Demo URL</Label>
                    <Input
                      type="text"
                      placeholder="https://project-demo.vercel.app"
                      value={newProject.liveUrl}
                      onChange={(e) => setNewProject({ ...newProject, liveUrl: e.target.value })}
                    />
                  </FormGroup>

                  <FormGroup>
                    <Label>Tags (Comma-separated)</Label>
                    <Input
                      type="text"
                      placeholder="Java 21, Spring Boot, React, MySQL"
                      value={newProject.tags}
                      onChange={(e) => setNewProject({ ...newProject, tags: e.target.value })}
                    />
                  </FormGroup>
                </div>

                <FormGroup>
                  <Label>Image / Banner URL</Label>
                  <Input
                    type="text"
                    placeholder="https://images.unsplash.com/..."
                    value={newProject.imageUrl}
                    onChange={(e) => setNewProject({ ...newProject, imageUrl: e.target.value })}
                  />
                </FormGroup>

                <FormGroup>
                  <Label>Architecture & Key Features Description</Label>
                  <TextArea
                    placeholder="Describe problem solved, backend architecture, database design, and key libraries used..."
                    value={newProject.description}
                    onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
                  />
                </FormGroup>

                <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
                  <SubmitBtn type="submit">
                    {editingProjectId ? "💾 Update Project Changes" : "+ Save & Publish to Live Portfolio"}
                  </SubmitBtn>
                  {editingProjectId && (
                    <ActionBtn onClick={handleCancelProjectEdit} type="button">
                      Cancel
                    </ActionBtn>
                  )}
                </div>
              </form>
            </GlassCard>

            <GlassCard>
              <SectionHeader>
                <div>
                  <SectionTitle>💻 Portfolio Projects in Database ({projects.length})</SectionTitle>
                  <span style={{ fontSize: "13px", color: "#94a3b8" }}>
                    Showing {filteredProjects.length} projects
                  </span>
                </div>
                <div style={{ display: "flex", gap: "10px", alignItems: "center", flexWrap: "wrap" }}>
                  <ViewToggleWrapper>
                    <ViewToggleBtn
                      $active={projectViewMode === "cards"}
                      onClick={() => setProjectViewMode("cards")}
                      title="Grid Cards View"
                    >
                      <GridViewRounded style={{ fontSize: "14px" }} /> Cards
                    </ViewToggleBtn>
                    <ViewToggleBtn
                      $active={projectViewMode === "table"}
                      onClick={() => setProjectViewMode("table")}
                      title="Compact Table View"
                    >
                      <ViewListRounded style={{ fontSize: "14px" }} /> Table
                    </ViewToggleBtn>
                  </ViewToggleWrapper>

                  <SearchInputWrapper>
                    <SearchRounded />
                    <SearchInput
                      type="text"
                      placeholder="Search projects by title, stack..."
                      value={projectSearch}
                      onChange={(e) => setProjectSearch(e.target.value)}
                    />
                  </SearchInputWrapper>
                </div>
              </SectionHeader>

              {filteredProjects.length === 0 ? (
                <div style={{ textAlign: "center", padding: "48px 20px", color: "#94a3b8" }}>
                  <CodeRounded style={{ fontSize: "40px", color: "#64748b", marginBottom: "12px" }} />
                  <p style={{ margin: 0 }}>No projects matched your search criteria.</p>
                </div>
              ) : projectViewMode === "cards" ? (
                <CardGrid>
                  {filteredProjects.map((p) => (
                    <ItemCard
                      key={p.id}
                      $borderColor="rgba(34, 211, 238, 0.16)"
                      $hoverBorder="rgba(34, 211, 238, 0.45)"
                      $accentGradient="linear-gradient(90deg, #854ce6, #22d3ee)"
                    >
                      <div>
                        <ProjectImageBanner $src={p.imageUrl}>
                          <CategoryPill>{p.category || "General"}</CategoryPill>
                          {p.dateRange && (
                            <span
                              style={{
                                zIndex: 1,
                                fontSize: "11px",
                                background: "rgba(0, 0, 0, 0.65)",
                                border: "1px solid rgba(255, 255, 255, 0.15)",
                                padding: "3px 9px",
                                borderRadius: "999px",
                                color: "#cbd5e1",
                                fontWeight: "600",
                              }}
                            >
                              {p.dateRange}
                            </span>
                          )}
                        </ProjectImageBanner>

                        <div style={{ marginBottom: "8px" }}>
                          <CardTitle style={{ fontSize: "17px", color: "#ffffff" }}>{p.title}</CardTitle>
                        </div>

                        {p.tags && (
                          <div style={{ marginBottom: "12px" }}>
                            {p.tags.split(",").map((t, idx) => (
                              <TagChip key={idx}>{t.trim()}</TagChip>
                            ))}
                          </div>
                        )}

                        {p.description && (
                          <p
                            style={{
                              margin: "0 0 16px",
                              color: "#94a3b8",
                              fontSize: "13px",
                              lineHeight: "1.6",
                              display: "-webkit-box",
                              WebkitLineClamp: 3,
                              WebkitBoxOrient: "vertical",
                              overflow: "hidden",
                            }}
                          >
                            {p.description}
                          </p>
                        )}
                      </div>

                      <CardActionsRow>
                        <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                          {p.githubUrl && (
                            <a
                              href={p.githubUrl}
                              target="_blank"
                              rel="noreferrer"
                              style={{
                                display: "inline-flex",
                                alignItems: "center",
                                gap: "4px",
                                color: "#38bdf8",
                                textDecoration: "none",
                                fontSize: "12px",
                                fontWeight: "600",
                                background: "rgba(56, 189, 248, 0.12)",
                                border: "1px solid rgba(56, 189, 248, 0.3)",
                                padding: "5px 10px",
                                borderRadius: "8px",
                              }}
                            >
                              <CodeRounded style={{ fontSize: "14px" }} /> Code ↗
                            </a>
                          )}
                          {p.liveUrl && (
                            <a
                              href={p.liveUrl}
                              target="_blank"
                              rel="noreferrer"
                              style={{
                                display: "inline-flex",
                                alignItems: "center",
                                gap: "4px",
                                color: "#34d399",
                                textDecoration: "none",
                                fontSize: "12px",
                                fontWeight: "600",
                                background: "rgba(16, 185, 129, 0.12)",
                                border: "1px solid rgba(16, 185, 129, 0.3)",
                                padding: "5px 10px",
                                borderRadius: "8px",
                              }}
                            >
                              <LaunchRounded style={{ fontSize: "14px" }} /> Live ↗
                            </a>
                          )}
                        </div>

                        <div style={{ display: "flex", gap: "6px" }}>
                          <ActionBtn
                            onClick={() => handleEditProjectClick(p)}
                            style={{
                              background: "rgba(34, 211, 238, 0.15)",
                              borderColor: "rgba(34, 211, 238, 0.35)",
                              color: "#22d3ee",
                            }}
                          >
                            <EditRounded style={{ fontSize: "14px" }} /> Edit
                          </ActionBtn>
                          <ActionBtn danger onClick={() => handleDeleteProject(p.id)}>
                            <DeleteOutlineRounded style={{ fontSize: "14px" }} /> Delete
                          </ActionBtn>
                        </div>
                      </CardActionsRow>
                    </ItemCard>
                  ))}
                </CardGrid>
              ) : (
                <div style={{ overflowX: "auto" }}>
                  <Table>
                    <thead>
                      <tr>
                        <Th>Project</Th>
                        <Th>Category</Th>
                        <Th>Tech Stack Tags</Th>
                        <Th>Links</Th>
                        <Th>Actions</Th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredProjects.map((p) => (
                        <Tr key={p.id}>
                          <Td>
                            <strong style={{ color: "#ffffff", fontSize: "14px" }}>{p.title}</strong>
                            <div style={{ fontSize: "12px", color: "#94a3b8", marginTop: "2px" }}>{p.dateRange}</div>
                          </Td>
                          <Td style={{ textTransform: "capitalize", color: "#38bdf8", fontWeight: "600" }}>
                            {p.category}
                          </Td>
                          <Td>
                            {p.tags ? (
                              p.tags.split(",").map((t, idx) => <TagChip key={idx}>{t.trim()}</TagChip>)
                            ) : (
                              <span style={{ color: "#64748b" }}>—</span>
                            )}
                          </Td>
                          <Td style={{ whiteSpace: "nowrap" }}>
                            {p.githubUrl && (
                              <a
                                href={p.githubUrl}
                                target="_blank"
                                rel="noreferrer"
                                style={{ color: "#38bdf8", marginRight: "12px", textDecoration: "none", fontWeight: "600" }}
                              >
                                Code ↗
                              </a>
                            )}
                            {p.liveUrl && (
                              <a
                                href={p.liveUrl}
                                target="_blank"
                                rel="noreferrer"
                                style={{ color: "#10b981", textDecoration: "none", fontWeight: "600" }}
                              >
                                Live ↗
                              </a>
                            )}
                          </Td>
                          <Td style={{ whiteSpace: "nowrap" }}>
                            <ActionBtn
                              onClick={() => handleEditProjectClick(p)}
                              style={{ marginRight: "8px", background: "rgba(34, 211, 238, 0.15)", borderColor: "rgba(34, 211, 238, 0.35)", color: "#22d3ee" }}
                            >
                              <EditRounded style={{ fontSize: "14px" }} /> Edit
                            </ActionBtn>
                            <ActionBtn danger onClick={() => handleDeleteProject(p.id)}>
                              <DeleteOutlineRounded style={{ fontSize: "14px" }} />
                              Delete
                            </ActionBtn>
                          </Td>
                        </Tr>
                      ))}
                    </tbody>
                  </Table>
                </div>
              )}
            </GlassCard>
          </div>
        )}

        {/* 4. SKILLS TAB */}
        {activeTab === "skills" && (
          <div>
            <GlassCard>
              <SectionTitle style={{ marginBottom: "20px" }}>
                <BoltRounded style={{ fontSize: "24px", color: "#f59e0b" }} />
                Register New Skill
              </SectionTitle>
              <form onSubmit={handleCreateSkill} style={{ display: "flex", gap: "16px", flexWrap: "wrap", alignItems: "flex-end" }}>
                <FormGroup style={{ flex: "1 1 200px" }}>
                  <Label>Category</Label>
                  <Input
                    type="text"
                    value={newSkill.category}
                    onChange={(e) => setNewSkill({ ...newSkill, category: e.target.value })}
                    placeholder="Frontend / Backend / Database / Tools"
                    required
                  />
                </FormGroup>

                <FormGroup style={{ flex: "1 1 220px" }}>
                  <Label>Skill Name</Label>
                  <Input
                    type="text"
                    value={newSkill.name}
                    onChange={(e) => setNewSkill({ ...newSkill, name: e.target.value })}
                    placeholder="e.g. Spring AI / Docker / AWS"
                    required
                  />
                </FormGroup>

                <FormGroup style={{ flex: "1 1 240px" }}>
                  <Label>Icon URL (Optional)</Label>
                  <Input
                    type="text"
                    value={newSkill.imageUrl}
                    onChange={(e) => setNewSkill({ ...newSkill, imageUrl: e.target.value })}
                    placeholder="https://..."
                  />
                </FormGroup>

                <SubmitBtn type="submit" style={{ marginBottom: "18px" }}>
                  + Add Skill to DB
                </SubmitBtn>
              </form>
            </GlassCard>

            <GlassCard>
              <SectionHeader>
                <SectionTitle>⚡ All Skills Registered in Database ({skills.length})</SectionTitle>
              </SectionHeader>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
                {skills.map((s) => (
                  <div
                    key={s.id}
                    style={{
                      background: "rgba(255, 255, 255, 0.04)",
                      border: "1px solid rgba(255, 255, 255, 0.1)",
                      padding: "8px 14px",
                      borderRadius: "10px",
                      display: "flex",
                      alignItems: "center",
                      gap: "10px",
                      transition: "all 0.2s ease",
                    }}
                  >
                    <span style={{ fontSize: "11px", color: "#38bdf8", fontWeight: "600" }}>[{s.category}]</span>
                    <strong style={{ fontSize: "13px", color: "#f8fafc" }}>{s.name}</strong>
                    <button
                      onClick={() => handleDeleteSkill(s.id)}
                      style={{
                        background: "none",
                        border: "none",
                        color: "#f87171",
                        cursor: "pointer",
                        fontSize: "14px",
                        padding: 0,
                        marginLeft: "4px",
                      }}
                      title="Remove skill"
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            </GlassCard>
          </div>
        )}

        {/* 5. INTERNSHIPS / EXPERIENCE TAB */}
        {activeTab === "experiences" && (
          <div>
            <GlassCard>
              <SectionHeader>
                <SectionTitle>
                  <WorkRounded style={{ fontSize: "24px", color: "#38bdf8" }} />
                  {editingExperienceId
                    ? `Edit Internship #${editingExperienceId}: ${experienceForm.role || "Untitled"} @ ${experienceForm.company || ""}`
                    : "Add New Internship / Work Experience"}
                </SectionTitle>
                {editingExperienceId && (
                  <ActionBtn onClick={handleCancelExperienceEdit}>
                    <CloseRounded style={{ fontSize: "15px" }} /> Cancel Edit
                  </ActionBtn>
                )}
              </SectionHeader>

              <form onSubmit={handleSaveExperience}>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "18px" }}>
                  <FormGroup>
                    <Label>Company Name *</Label>
                    <Input
                      type="text"
                      placeholder="e.g. Growfinix / Edunet Foundation"
                      value={experienceForm.company}
                      onChange={(e) => setExperienceForm({ ...experienceForm, company: e.target.value })}
                      required
                    />
                  </FormGroup>

                  <FormGroup>
                    <Label>Role / Job Title *</Label>
                    <Input
                      type="text"
                      placeholder="e.g. Backend Developer Intern"
                      value={experienceForm.role}
                      onChange={(e) => setExperienceForm({ ...experienceForm, role: e.target.value })}
                      required
                    />
                  </FormGroup>

                  <FormGroup>
                    <Label>Duration / Date Range</Label>
                    <Input
                      type="text"
                      placeholder="e.g. Aug 2025 - Oct 2025"
                      value={experienceForm.dateRange}
                      onChange={(e) => setExperienceForm({ ...experienceForm, dateRange: e.target.value })}
                    />
                  </FormGroup>

                  <FormGroup>
                    <Label>Certificate / Document URL</Label>
                    <Input
                      type="text"
                      placeholder="https://drive.google.com/... or image link"
                      value={experienceForm.certificateUrl}
                      onChange={(e) => setExperienceForm({ ...experienceForm, certificateUrl: e.target.value })}
                    />
                  </FormGroup>
                </div>

                <FormGroup>
                  <Label>Technologies & Skills Used (Comma-separated)</Label>
                  <Input
                    type="text"
                    placeholder="e.g. NodeJs, ExpressJs, REST APIs, MongoDB, TypeScript"
                    value={experienceForm.skills}
                    onChange={(e) => setExperienceForm({ ...experienceForm, skills: e.target.value })}
                  />
                </FormGroup>

                <FormGroup>
                  <Label>Work Description & Key Contributions</Label>
                  <TextArea
                    rows={4}
                    placeholder="Describe backend architecture designed, APIs integrated, problem solving, teamwork..."
                    value={experienceForm.description}
                    onChange={(e) => setExperienceForm({ ...experienceForm, description: e.target.value })}
                  />
                </FormGroup>

                <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
                  <SubmitBtn type="submit">
                    {editingExperienceId ? "💾 Update Internship Changes" : "+ Add Internship to Database"}
                  </SubmitBtn>
                  {editingExperienceId && (
                    <ActionBtn onClick={handleCancelExperienceEdit} type="button">
                      Cancel
                    </ActionBtn>
                  )}
                </div>
              </form>
            </GlassCard>

            <GlassCard>
              <SectionHeader>
                <div>
                  <SectionTitle>💼 Work & Internship Records in Database ({experiences.length})</SectionTitle>
                  <span style={{ fontSize: "13px", color: "#94a3b8" }}>
                    Showing {filteredExperiences.length} of {experiences.length} records
                  </span>
                </div>
                <div style={{ display: "flex", gap: "10px", alignItems: "center", flexWrap: "wrap" }}>
                  <ViewToggleWrapper>
                    <ViewToggleBtn
                      $active={experienceViewMode === "cards"}
                      onClick={() => setExperienceViewMode("cards")}
                      title="Grid Cards View"
                    >
                      <GridViewRounded style={{ fontSize: "14px" }} /> Cards
                    </ViewToggleBtn>
                    <ViewToggleBtn
                      $active={experienceViewMode === "table"}
                      onClick={() => setExperienceViewMode("table")}
                      title="Compact Table View"
                    >
                      <ViewListRounded style={{ fontSize: "14px" }} /> Table
                    </ViewToggleBtn>
                  </ViewToggleWrapper>

                  <SearchInputWrapper>
                    <SearchRounded />
                    <SearchInput
                      type="text"
                      placeholder="Search by company, role, skills..."
                      value={experienceSearch}
                      onChange={(e) => setExperienceSearch(e.target.value)}
                    />
                  </SearchInputWrapper>
                </div>
              </SectionHeader>

              {filteredExperiences.length === 0 ? (
                <div style={{ textAlign: "center", padding: "40px", color: "#94a3b8" }}>
                  <WorkRounded style={{ fontSize: "40px", color: "#64748b", marginBottom: "12px" }} />
                  <p style={{ margin: 0 }}>No internship records found. Add one above!</p>
                </div>
              ) : experienceViewMode === "cards" ? (
                <CardGrid>
                  {filteredExperiences.map((exp) => (
                    <ItemCard
                      key={exp.id}
                      $borderColor="rgba(14, 165, 233, 0.2)"
                      $hoverBorder="rgba(14, 165, 233, 0.45)"
                      $accentGradient="linear-gradient(90deg, #0ea5e9, #38bdf8)"
                    >
                      <div>
                        <CardHeaderTop>
                          <div style={{ display: "flex", gap: "12px", alignItems: "center", minWidth: 0 }}>
                            <CardAvatar
                              $bg="rgba(14, 165, 233, 0.15)"
                              $border="rgba(14, 165, 233, 0.35)"
                              $color="#38bdf8"
                            >
                              <WorkRounded style={{ fontSize: "22px" }} />
                            </CardAvatar>
                            <CardMetaBlock>
                              <CardTitle title={exp.role}>{exp.role}</CardTitle>
                              <CardSubtitle $color="#38bdf8">
                                {exp.company}
                              </CardSubtitle>
                              {exp.dateRange && (
                                <CardDateChip>
                                  <CalendarTodayRounded style={{ fontSize: "11px" }} />
                                  {exp.dateRange}
                                </CardDateChip>
                              )}
                            </CardMetaBlock>
                          </div>
                        </CardHeaderTop>

                        {exp.skills && (
                          <div style={{ margin: "10px 0 12px" }}>
                            {exp.skills.split(",").map((s, idx) => (
                              <TagChip key={idx}>{s.trim()}</TagChip>
                            ))}
                          </div>
                        )}

                        {exp.description && (
                          <p
                            style={{
                              margin: "0 0 16px",
                              color: "#94a3b8",
                              fontSize: "13px",
                              lineHeight: "1.6",
                              display: "-webkit-box",
                              WebkitLineClamp: 3,
                              WebkitBoxOrient: "vertical",
                              overflow: "hidden",
                            }}
                          >
                            {exp.description}
                          </p>
                        )}
                      </div>

                      <CardActionsRow>
                        <div>
                          {exp.certificateUrl ? (
                            <a
                              href={exp.certificateUrl}
                              target="_blank"
                              rel="noreferrer"
                              style={{
                                display: "inline-flex",
                                alignItems: "center",
                                gap: "5px",
                                color: "#34d399",
                                textDecoration: "none",
                                fontSize: "12px",
                                fontWeight: "600",
                                background: "rgba(16, 185, 129, 0.12)",
                                border: "1px solid rgba(16, 185, 129, 0.3)",
                                padding: "5px 10px",
                                borderRadius: "8px",
                              }}
                            >
                              <WorkspacePremiumRounded style={{ fontSize: "15px" }} /> Certificate ↗
                            </a>
                          ) : (
                            <span style={{ fontSize: "11.5px", color: "#64748b" }}>No document attached</span>
                          )}
                        </div>

                        <div style={{ display: "flex", gap: "6px" }}>
                          <ActionBtn
                            onClick={() => handleEditExperienceClick(exp)}
                            style={{
                              background: "rgba(56, 189, 248, 0.15)",
                              borderColor: "rgba(56, 189, 248, 0.35)",
                              color: "#38bdf8",
                            }}
                          >
                            <EditRounded style={{ fontSize: "14px" }} /> Edit
                          </ActionBtn>
                          <ActionBtn danger onClick={() => handleDeleteExperience(exp.id)}>
                            <DeleteOutlineRounded style={{ fontSize: "14px" }} /> Delete
                          </ActionBtn>
                        </div>
                      </CardActionsRow>
                    </ItemCard>
                  ))}
                </CardGrid>
              ) : (
                <div style={{ overflowX: "auto" }}>
                  <Table>
                    <thead>
                      <tr>
                        <Th>Role & Company</Th>
                        <Th>Timeline</Th>
                        <Th>Key Skills</Th>
                        <Th>Certificate</Th>
                        <Th>Actions</Th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredExperiences.map((exp) => (
                        <Tr key={exp.id}>
                          <Td>
                            <strong style={{ color: "#ffffff", fontSize: "14px" }}>{exp.role}</strong>
                            <div style={{ fontSize: "13px", color: "#38bdf8", fontWeight: "600", marginTop: "2px" }}>
                              {exp.company}
                            </div>
                            {exp.description && (
                              <p style={{ margin: "6px 0 0", color: "#94a3b8", fontSize: "12.5px", maxWidth: "420px", lineHeight: "1.5" }}>
                                {exp.description}
                              </p>
                            )}
                          </Td>
                          <Td style={{ whiteSpace: "nowrap", color: "#e2e8f0", fontSize: "12.5px" }}>
                            {exp.dateRange || "—"}
                          </Td>
                          <Td style={{ maxWidth: "260px" }}>
                            {exp.skills ? (
                              exp.skills.split(",").map((s, idx) => <TagChip key={idx}>{s.trim()}</TagChip>)
                            ) : (
                              <span style={{ color: "#64748b" }}>—</span>
                            )}
                          </Td>
                          <Td style={{ whiteSpace: "nowrap" }}>
                            {exp.certificateUrl ? (
                              <a
                                href={exp.certificateUrl}
                                target="_blank"
                                rel="noreferrer"
                                style={{ color: "#10b981", textDecoration: "none", fontWeight: "600", display: "inline-flex", alignItems: "center", gap: "4px" }}
                              >
                                View ↗
                              </a>
                            ) : (
                              <span style={{ color: "#64748b" }}>—</span>
                            )}
                          </Td>
                          <Td style={{ whiteSpace: "nowrap" }}>
                            <ActionBtn
                              onClick={() => handleEditExperienceClick(exp)}
                              style={{ marginRight: "8px", background: "rgba(56, 189, 248, 0.15)", borderColor: "rgba(56, 189, 248, 0.35)", color: "#38bdf8" }}
                            >
                              <EditRounded style={{ fontSize: "14px" }} /> Edit
                            </ActionBtn>
                            <ActionBtn danger onClick={() => handleDeleteExperience(exp.id)}>
                              <DeleteOutlineRounded style={{ fontSize: "14px" }} /> Delete
                            </ActionBtn>
                          </Td>
                        </Tr>
                      ))}
                    </tbody>
                  </Table>
                </div>
              )}
            </GlassCard>
          </div>
        )}

        {/* 6. EDUCATION TAB */}
        {activeTab === "education" && (
          <div>
            <GlassCard>
              <SectionHeader>
                <SectionTitle>
                  <SchoolRounded style={{ fontSize: "24px", color: "#c084fc" }} />
                  {editingEducationId
                    ? `Edit Education #${editingEducationId}: ${educationForm.degree || "Degree"} @ ${educationForm.school || ""}`
                    : "Add New Education Record"}
                </SectionTitle>
                {editingEducationId && (
                  <ActionBtn onClick={handleCancelEducationEdit}>
                    <CloseRounded style={{ fontSize: "15px" }} /> Cancel Edit
                  </ActionBtn>
                )}
              </SectionHeader>

              <form onSubmit={handleSaveEducation}>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "18px" }}>
                  <FormGroup>
                    <Label>School / College / University *</Label>
                    <Input
                      type="text"
                      placeholder="e.g. GF's Godavari College of Engineering, Jalgaon"
                      value={educationForm.school}
                      onChange={(e) => setEducationForm({ ...educationForm, school: e.target.value })}
                      required
                    />
                  </FormGroup>

                  <FormGroup>
                    <Label>Degree / Course *</Label>
                    <Input
                      type="text"
                      placeholder="e.g. Bachelor of Technology - BTech, Computer Engineering"
                      value={educationForm.degree}
                      onChange={(e) => setEducationForm({ ...educationForm, degree: e.target.value })}
                      required
                    />
                  </FormGroup>

                  <FormGroup>
                    <Label>Timeline / Date Range</Label>
                    <Input
                      type="text"
                      placeholder="e.g. Sep 2022 - July 2026"
                      value={educationForm.dateRange}
                      onChange={(e) => setEducationForm({ ...educationForm, dateRange: e.target.value })}
                    />
                  </FormGroup>

                  <FormGroup>
                    <Label>Grade / Score / Status</Label>
                    <Input
                      type="text"
                      placeholder="e.g. (Pursuing) / 8.5 CGPA / 68.33%"
                      value={educationForm.grade}
                      onChange={(e) => setEducationForm({ ...educationForm, grade: e.target.value })}
                    />
                  </FormGroup>
                </div>

                <FormGroup>
                  <Label>Educational Details & Coursework Description</Label>
                  <TextArea
                    rows={4}
                    placeholder="Describe courses taken, specializations, academic projects, leadership roles..."
                    value={educationForm.description}
                    onChange={(e) => setEducationForm({ ...educationForm, description: e.target.value })}
                  />
                </FormGroup>

                <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
                  <SubmitBtn type="submit">
                    {editingEducationId ? "💾 Update Education Changes" : "+ Add Education Record to Database"}
                  </SubmitBtn>
                  {editingEducationId && (
                    <ActionBtn onClick={handleCancelEducationEdit} type="button">
                      Cancel
                    </ActionBtn>
                  )}
                </div>
              </form>
            </GlassCard>

            <GlassCard>
              <SectionHeader>
                <div>
                  <SectionTitle>🎓 Education History in Database ({educationList.length})</SectionTitle>
                  <span style={{ fontSize: "13px", color: "#94a3b8" }}>
                    Showing {filteredEducation.length} of {educationList.length} records
                  </span>
                </div>
                <div style={{ display: "flex", gap: "10px", alignItems: "center", flexWrap: "wrap" }}>
                  <ViewToggleWrapper>
                    <ViewToggleBtn
                      $active={educationViewMode === "cards"}
                      onClick={() => setEducationViewMode("cards")}
                      title="Grid Cards View"
                    >
                      <GridViewRounded style={{ fontSize: "14px" }} /> Cards
                    </ViewToggleBtn>
                    <ViewToggleBtn
                      $active={educationViewMode === "table"}
                      onClick={() => setEducationViewMode("table")}
                      title="Compact Table View"
                    >
                      <ViewListRounded style={{ fontSize: "14px" }} /> Table
                    </ViewToggleBtn>
                  </ViewToggleWrapper>

                  <SearchInputWrapper>
                    <SearchRounded />
                    <SearchInput
                      type="text"
                      placeholder="Search by school, degree, grade..."
                      value={educationSearch}
                      onChange={(e) => setEducationSearch(e.target.value)}
                    />
                  </SearchInputWrapper>
                </div>
              </SectionHeader>

              {filteredEducation.length === 0 ? (
                <div style={{ textAlign: "center", padding: "40px", color: "#94a3b8" }}>
                  <SchoolRounded style={{ fontSize: "40px", color: "#64748b", marginBottom: "12px" }} />
                  <p style={{ margin: 0 }}>No education records found. Add one above!</p>
                </div>
              ) : educationViewMode === "cards" ? (
                <CardGrid>
                  {filteredEducation.map((edu) => (
                    <ItemCard
                      key={edu.id}
                      $borderColor="rgba(192, 132, 252, 0.2)"
                      $hoverBorder="rgba(192, 132, 252, 0.45)"
                      $accentGradient="linear-gradient(90deg, #c084fc, #854ce6)"
                    >
                      <div>
                        <CardHeaderTop>
                          <div style={{ display: "flex", gap: "12px", alignItems: "center", minWidth: 0 }}>
                            <CardAvatar
                              $bg="rgba(192, 132, 252, 0.15)"
                              $border="rgba(192, 132, 252, 0.35)"
                              $color="#c084fc"
                            >
                              <SchoolRounded style={{ fontSize: "22px" }} />
                            </CardAvatar>
                            <CardMetaBlock>
                              <CardTitle title={edu.degree}>{edu.degree}</CardTitle>
                              <CardSubtitle $color="#c084fc">
                                {edu.school}
                              </CardSubtitle>
                              {edu.dateRange && (
                                <CardDateChip>
                                  <CalendarTodayRounded style={{ fontSize: "11px" }} />
                                  {edu.dateRange}
                                </CardDateChip>
                              )}
                            </CardMetaBlock>
                          </div>
                        </CardHeaderTop>

                        {edu.grade && (
                          <div style={{ margin: "10px 0 12px" }}>
                            <ScoreBadge>
                              🏆 Grade / Score: <strong>{edu.grade}</strong>
                            </ScoreBadge>
                          </div>
                        )}

                        {edu.description && (
                          <p
                            style={{
                              margin: "0 0 16px",
                              color: "#94a3b8",
                              fontSize: "13px",
                              lineHeight: "1.6",
                              display: "-webkit-box",
                              WebkitLineClamp: 3,
                              WebkitBoxOrient: "vertical",
                              overflow: "hidden",
                            }}
                          >
                            {edu.description}
                          </p>
                        )}
                      </div>

                      <CardActionsRow>
                        <div style={{ fontSize: "12px", color: "#64748b" }}>
                          Academic Credential
                        </div>

                        <div style={{ display: "flex", gap: "6px" }}>
                          <ActionBtn
                            onClick={() => handleEditEducationClick(edu)}
                            style={{
                              background: "rgba(168, 85, 247, 0.15)",
                              borderColor: "rgba(168, 85, 247, 0.35)",
                              color: "#c084fc",
                            }}
                          >
                            <EditRounded style={{ fontSize: "14px" }} /> Edit
                          </ActionBtn>
                          <ActionBtn danger onClick={() => handleDeleteEducation(edu.id)}>
                            <DeleteOutlineRounded style={{ fontSize: "14px" }} /> Delete
                          </ActionBtn>
                        </div>
                      </CardActionsRow>
                    </ItemCard>
                  ))}
                </CardGrid>
              ) : (
                <div style={{ overflowX: "auto" }}>
                  <Table>
                    <thead>
                      <tr>
                        <Th>Degree & Institution</Th>
                        <Th>Timeline</Th>
                        <Th>Grade / Score</Th>
                        <Th>Coursework & Details</Th>
                        <Th>Actions</Th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredEducation.map((edu) => (
                        <Tr key={edu.id}>
                          <Td>
                            <strong style={{ color: "#ffffff", fontSize: "14px" }}>{edu.degree}</strong>
                            <div style={{ fontSize: "13px", color: "#c084fc", fontWeight: "600", marginTop: "2px" }}>
                              {edu.school}
                            </div>
                          </Td>
                          <Td style={{ whiteSpace: "nowrap", color: "#e2e8f0", fontSize: "12.5px" }}>
                            {edu.dateRange || "—"}
                          </Td>
                          <Td style={{ whiteSpace: "nowrap" }}>
                            <span style={{ background: "rgba(168, 85, 247, 0.15)", border: "1px solid rgba(168, 85, 247, 0.35)", color: "#c084fc", padding: "3px 10px", borderRadius: "999px", fontSize: "12px", fontWeight: "600" }}>
                              {edu.grade || "N/A"}
                            </span>
                          </Td>
                          <Td style={{ maxWidth: "380px" }}>
                            <p style={{ margin: 0, color: "#94a3b8", fontSize: "12.5px", lineHeight: "1.5" }}>
                              {edu.description || "—"}
                            </p>
                          </Td>
                          <Td style={{ whiteSpace: "nowrap" }}>
                            <ActionBtn
                              onClick={() => handleEditEducationClick(edu)}
                              style={{ marginRight: "8px", background: "rgba(168, 85, 247, 0.15)", borderColor: "rgba(168, 85, 247, 0.35)", color: "#c084fc" }}
                            >
                              <EditRounded style={{ fontSize: "14px" }} /> Edit
                            </ActionBtn>
                            <ActionBtn danger onClick={() => handleDeleteEducation(edu.id)}>
                              <DeleteOutlineRounded style={{ fontSize: "14px" }} /> Delete
                            </ActionBtn>
                          </Td>
                        </Tr>
                      ))}
                    </tbody>
                  </Table>
                </div>
              )}
            </GlassCard>
          </div>
        )}

        {/* 7. RESUME & PROFILE TAB */}
        {activeTab === "profile" && (
          <GlassCard>
            <SectionHeader>
              <SectionTitle>
                <DescriptionRounded style={{ fontSize: "24px", color: "#38bdf8" }} />
                Manage Resume & Global Profile
              </SectionTitle>
            </SectionHeader>

            <LiveResumeBox>
              <div>
                <span style={{ fontSize: "12px", color: "#94a3b8", display: "block" }}>Active Resume Link:</span>
                <span style={{ fontSize: "14px", color: "#22d3ee", fontWeight: "600", wordBreak: "break-all" }}>
                  {bio.resume || "No resume link set yet"}
                </span>
              </div>
              {bio.resume && (
                <NavButton
                  as="a"
                  href={bio.resume}
                  target="_blank"
                  rel="noreferrer"
                  style={{ background: "rgba(34, 211, 238, 0.15)", borderColor: "#22d3ee", color: "#22d3ee" }}
                >
                  <OpenInNewRounded style={{ fontSize: "15px" }} /> Test Live Link
                </NavButton>
              )}
            </LiveResumeBox>

            <form onSubmit={handleSaveBio}>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "18px" }}>
                <FormGroup>
                  <Label>Full Name</Label>
                  <Input
                    type="text"
                    value={bio.name}
                    onChange={(e) => setBio({ ...bio, name: e.target.value })}
                    required
                  />
                </FormGroup>

                <FormGroup>
                  <Label>Resume Link (Google Drive / Cloud URL) *</Label>
                  <Input
                    type="text"
                    value={bio.resume}
                    onChange={(e) => setBio({ ...bio, resume: e.target.value })}
                    placeholder="https://drive.google.com/file/d/..."
                    required
                  />
                </FormGroup>

                <FormGroup>
                  <Label>GitHub URL</Label>
                  <Input
                    type="text"
                    value={bio.github}
                    onChange={(e) => setBio({ ...bio, github: e.target.value })}
                  />
                </FormGroup>

                <FormGroup>
                  <Label>LinkedIn URL</Label>
                  <Input
                    type="text"
                    value={bio.linkedin}
                    onChange={(e) => setBio({ ...bio, linkedin: e.target.value })}
                  />
                </FormGroup>
              </div>

              <FormGroup>
                <Label>Roles & Specializations (Comma-separated)</Label>
                <Input
                  type="text"
                  value={bio.roles}
                  onChange={(e) => setBio({ ...bio, roles: e.target.value })}
                  placeholder="Java Full Stack Developer, Spring AI Specialist, React Developer"
                />
              </FormGroup>

              <FormGroup>
                <Label>Professional Bio / Description</Label>
                <TextArea
                  value={bio.description}
                  onChange={(e) => setBio({ ...bio, description: e.target.value })}
                  rows={4}
                />
              </FormGroup>

              <SubmitBtn type="submit">💾 Save Profile & Resume Changes</SubmitBtn>
            </form>
          </GlassCard>
        )}
      </MainContent>
    </Container>
  );
}
