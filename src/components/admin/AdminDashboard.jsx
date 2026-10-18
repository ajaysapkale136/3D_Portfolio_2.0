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
  NotificationsNoneRounded,
  VisibilityOutlined,
  FolderRounded,
  PersonOutlineRounded,
  TrendingUpRounded,
  KeyboardArrowDownRounded,
} from "@mui/icons-material";

// ======================== ANIMATIONS ========================
const pulseGlow = keyframes`
  0% { box-shadow: 0 0 0 0 rgba(34, 211, 238, 0.5); }
  70% { box-shadow: 0 0 0 10px rgba(34, 211, 238, 0); }
  100% { box-shadow: 0 0 0 0 rgba(34, 211, 238, 0); }
`;

const float = keyframes`
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-6px); }
`;

const slideDown = keyframes`
  from { transform: translate(-50%, -20px); opacity: 0; }
  to { transform: translate(-50%, 0); opacity: 1; }
`;

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
`;

// ======================== STYLED COMPONENTS ========================
const Container = styled.div`
  min-height: 100vh;
  background-color: #070913;
  background-image: 
    radial-gradient(circle at 10% 12%, rgba(59, 130, 246, 0.07) 0%, transparent 45%),
    radial-gradient(circle at 90% 88%, rgba(6, 182, 212, 0.05) 0%, transparent 48%),
    linear-gradient(180deg, #070913 0%, #0b0f19 100%);
  color: #f1f5f9;
  font-family: "Poppins", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  padding: 24px 28px 64px;
  box-sizing: border-box;
  position: relative;
  overflow-x: hidden;
`;

const Header = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: center;
  max-width: 1240px;
  margin: 0 auto 24px;
  padding: 4px 0 16px;
  position: relative;
  flex-wrap: wrap;
  gap: 16px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.06);
`;

const BrandSection = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

const BrandLogo = styled.div`
  width: 34px;
  height: 34px;
  border-radius: 9px;
  background: linear-gradient(135deg, rgba(59, 130, 246, 0.2), rgba(6, 182, 212, 0.2));
  border: 1px solid rgba(59, 130, 246, 0.4);
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 14px rgba(59, 130, 246, 0.2);
`;

const BrandText = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 13.5px;

  .brand-name {
    font-weight: 800;
    color: #ffffff;
    letter-spacing: 0.6px;
  }

  .brand-sep {
    color: #475569;
    font-weight: 300;
  }

  .brand-sub {
    color: #94a3b8;
    font-weight: 600;
    font-size: 11.5px;
    letter-spacing: 1.2px;
    text-transform: uppercase;
  }
`;

const CenterStatus = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 3px;
`;

const HeaderTitle = styled.h1`
  font-size: 17px;
  font-weight: 700;
  color: #ffffff;
  margin: 0;
  letter-spacing: -0.2px;
`;

const SystemStatusBadge = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  color: #10b981;
  font-size: 10.5px;
  font-weight: 700;
  letter-spacing: 0.8px;
  text-transform: uppercase;
`;

const StatusDot = styled.span`
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: #10b981;
  box-shadow: 0 0 8px #10b981, 0 0 14px #10b981;
  animation: ${pulseGlow} 2s infinite;
`;

const HeaderActions = styled.div`
  display: flex;
  gap: 10px;
  align-items: center;
`;

const ViewPortfolioBtn = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: 7px;
  padding: 8px 16px;
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.12);
  color: #e2e8f0;
  border-radius: 8px;
  text-decoration: none;
  font-size: 12.5px;
  font-weight: 600;
  transition: all 0.2s ease;

  &:hover {
    background: rgba(255, 255, 255, 0.08);
    border-color: rgba(255, 255, 255, 0.22);
    color: #ffffff;
  }
`;

const HeaderLogoutBtn = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 8px 16px;
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.12);
  color: #cbd5e1;
  border-radius: 8px;
  font-size: 12.5px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: rgba(239, 68, 68, 0.15);
    border-color: rgba(239, 68, 68, 0.35);
    color: #fca5a5;
  }
`;

// Fallback aliases for login / legacy subcomponents
const Title = styled.h1`
  font-size: 26px;
  font-weight: 800;
  color: #ffffff;
  margin: 0;
  display: flex;
  align-items: center;
  gap: 10px;
`;
const NavButton = ViewPortfolioBtn;

const ToastNotification = styled.div`
  position: fixed;
  top: 24px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 10000;
  background: #0f172a;
  border: 1px solid #10b981;
  color: #6ee7b7;
  padding: 10px 22px;
  border-radius: 999px;
  font-size: 13.5px;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 8px;
  box-shadow: 0 16px 40px rgba(0, 0, 0, 0.6);
  animation: ${slideDown} 0.25s ease-out;
`;

const MainContent = styled.main`
  max-width: 1240px;
  margin: 0 auto;
  animation: ${fadeIn} 0.3s ease-out;
`;

const TabNav = styled.div`
  display: flex;
  gap: 6px;
  margin-bottom: 24px;
  overflow-x: auto;
  padding: 6px;
  background: #0b101d;
  border: 1px solid rgba(255, 255, 255, 0.07);
  border-radius: 12px;

  &::-webkit-scrollbar {
    height: 4px;
  }
  &::-webkit-scrollbar-thumb {
    background: rgba(255, 255, 255, 0.12);
    border-radius: 999px;
  }
`;

const TabButton = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 9px 18px;
  background: ${(props) => (props.active ? "#4f46e5" : "transparent")};
  color: ${(props) => (props.active ? "#ffffff" : "#94a3b8")};
  border: none;
  border-radius: 8px;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  white-space: nowrap;
  transition: all 0.2s ease;

  &:hover {
    color: #ffffff;
    background: ${(props) => (props.active ? "#4f46e5" : "rgba(255, 255, 255, 0.05)")};
  }
`;

const TabCountBadge = styled.span`
  padding: 1px 7px;
  border-radius: 999px;
  font-size: 11px;
  font-weight: 700;
  background: #3b82f6;
  color: #ffffff;
  margin-left: 4px;
`;

const GlassCard = styled.div`
  background: #0e1422;
  border: 1px solid rgba(255, 255, 255, 0.07);
  border-radius: 16px;
  padding: 24px;
  margin-bottom: 22px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.4);
  position: relative;
  overflow: hidden;
`;

const GreetingSection = styled.div`
  margin-bottom: 22px;
`;

const GreetingTitle = styled.h2`
  font-size: 24px;
  font-weight: 700;
  color: #ffffff;
  margin: 0 0 6px;
  letter-spacing: -0.3px;
`;

const GreetingSubtitle = styled.p`
  font-size: 13.5px;
  color: #8896ab;
  margin: 0;
`;

const KpiGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
  margin-bottom: 20px;

  @media (max-width: 1024px) {
    grid-template-columns: repeat(2, 1fr);
  }
  @media (max-width: 640px) {
    grid-template-columns: 1fr;
  }
`;

const KpiCard = styled.div`
  background: #0e1422;
  border: 1px solid rgba(255, 255, 255, 0.07);
  border-radius: 16px;
  padding: 18px 20px;
  display: flex;
  align-items: center;
  gap: 16px;
  transition: transform 0.2s ease, border-color 0.2s ease;

  &:hover {
    transform: translateY(-2px);
    border-color: rgba(255, 255, 255, 0.15);
  }
`;

const KpiIconBox = styled.div`
  width: 48px;
  height: 48px;
  border-radius: 12px;
  background: ${(props) => props.$bg || "#172554"};
  color: ${(props) => props.$color || "#60a5fa"};
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
`;

const KpiContent = styled.div`
  display: flex;
  flex-direction: column;
  min-width: 0;
`;

const KpiLabel = styled.span`
  font-size: 12px;
  color: #8896ab;
  font-weight: 500;
  margin-bottom: 3px;
`;

const KpiValue = styled.span`
  font-size: 24px;
  font-weight: 800;
  color: #ffffff;
  letter-spacing: -0.5px;
  line-height: 1.1;
  margin-bottom: 4px;
`;

const KpiTrend = styled.span`
  font-size: 11px;
  font-weight: 600;
  display: inline-flex;
  align-items: center;
  gap: 4px;
  color: ${(props) => (props.$positive ? "#10b981" : props.$neutral ? "#64748b" : "#ef4444")};
`;

const TwoColumnGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 18px;
  margin-bottom: 18px;

  @media (max-width: 960px) {
    grid-template-columns: 1fr;
  }
`;

const DashCard = styled.div`
  background: #0e1422;
  border: 1px solid rgba(255, 255, 255, 0.07);
  border-radius: 16px;
  padding: 22px 24px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  position: relative;
`;

const CardTopRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 18px;
`;

const CardHeading = styled.h3`
  font-size: 15px;
  font-weight: 700;
  color: #ffffff;
  margin: 0;
`;

const DropdownPill = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 5px;
  padding: 4px 10px;
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 6px;
  color: #cbd5e1;
  font-size: 11.5px;
  cursor: pointer;
  user-select: none;
`;

const CardLink = styled.button`
  background: transparent;
  border: none;
  color: #3b82f6;
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 0;

  &:hover {
    color: #60a5fa;
    text-decoration: underline;
  }
`;

const ChartWrapper = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
`;

const LegendRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  margin-top: 10px;
  font-size: 11px;
  color: #94a3b8;

  .legend-bar {
    width: 14px;
    height: 2px;
    background: #6366f1;
    border-radius: 1px;
  }
`;

const MessageList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const MessageRow = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 8px 10px;
  border-radius: 10px;
  transition: background 0.2s ease;
  cursor: pointer;

  &:hover {
    background: rgba(255, 255, 255, 0.03);
  }
`;

const MsgAvatar = styled.div`
  width: 34px;
  height: 34px;
  border-radius: 50%;
  background: ${(props) => props.$bg || "#312e81"};
  color: ${(props) => props.$color || "#c7d2fe"};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  font-weight: 700;
  flex-shrink: 0;
`;

const MsgInfo = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  min-width: 0;
`;

const MsgName = styled.span`
  font-size: 13px;
  font-weight: 600;
  color: #ffffff;
  margin-bottom: 2px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const MsgSnippet = styled.span`
  font-size: 12px;
  color: #8896ab;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const MsgMeta = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  flex-shrink: 0;
`;

const MsgTime = styled.span`
  font-size: 11px;
  color: #64748b;
`;

const MsgBadge = styled.span`
  font-size: 11px;
  font-weight: 600;
  padding: 2px 8px;
  border-radius: 6px;
  background: ${(props) => (props.$type === "NEW" ? "#1e1b4b" : "#064e3b")};
  color: ${(props) => (props.$type === "NEW" ? "#818cf8" : "#34d399")};
`;

const TimelineContainer = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding-left: 6px;
`;

const TimelineLine = styled.div`
  position: absolute;
  left: 21px;
  top: 14px;
  bottom: 14px;
  width: 2px;
  background: rgba(255, 255, 255, 0.07);
  z-index: 0;
`;

const TimelineRow = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 14px;
  position: relative;
  z-index: 1;
`;

const TimelineNode = styled.div`
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: ${(props) => props.$bg || "#064e3b"};
  color: ${(props) => props.$color || "#10b981"};
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
`;

const TimelineContent = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
`;

const TimelineHeading = styled.span`
  font-size: 12.5px;
  font-weight: 600;
  color: #ffffff;
  margin-bottom: 2px;
`;

const TimelineDesc = styled.span`
  font-size: 11.5px;
  color: #8896ab;
`;

const TimelineTime = styled.span`
  font-size: 11px;
  color: #64748b;
  flex-shrink: 0;
`;

const HealthContent = styled.div`
  display: flex;
  align-items: center;
  gap: 28px;
  padding-top: 6px;

  @media (max-width: 580px) {
    flex-direction: column;
    align-items: flex-start;
  }
`;

const HealthGauge = styled.div`
  position: relative;
  width: 124px;
  height: 124px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
`;

const HealthScore = styled.div`
  position: absolute;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  .score-val {
    font-size: 32px;
    font-weight: 800;
    color: #ffffff;
    line-height: 1;
  }

  .score-max {
    font-size: 11px;
    color: #64748b;
    font-weight: 600;
    margin-top: 2px;
  }
`;

const HealthList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const HealthLead = styled.p`
  font-size: 12.5px;
  color: #cbd5e1;
  margin: 0 0 6px;
  line-height: 1.4;

  strong {
    color: #ffffff;
  }
`;

const HealthItem = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 12px;
  color: #94a3b8;
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


const Table = styled.table`
  width: 100%;
  border-collapse: separate;
  border-spacing: 0 8px;
  text-align: left;
  font-size: 13.5px;
`;

const Th = styled.th`
  padding: 14px 20px;
  background: transparent;
  color: #94a3b8;
  font-weight: 600;
  font-size: 12px;
  text-transform: uppercase;
  letter-spacing: 0.7px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
`;

const Tr = styled.tr`
  background: rgba(255, 255, 255, 0.025);
  transition: all 0.22s cubic-bezier(0.16, 1, 0.3, 1);
  border-radius: 14px;

  &:hover {
    background: rgba(255, 255, 255, 0.06);
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(0, 0, 0, 0.25);
  }
`;

const Td = styled.td`
  padding: 16px 20px;
  color: #e2e8f0;
  vertical-align: middle;
  border-top: 1px solid rgba(255, 255, 255, 0.05);
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);

  &:first-child {
    border-left: 1px solid rgba(255, 255, 255, 0.05);
    border-top-left-radius: 14px;
    border-bottom-left-radius: 14px;
  }
  &:last-child {
    border-right: 1px solid rgba(255, 255, 255, 0.05);
    border-top-right-radius: 14px;
    border-bottom-right-radius: 14px;
  }
`;

const StatusBadge = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 4px 12px;
  border-radius: 999px;
  font-size: 11.5px;
  font-weight: 700;
  letter-spacing: 0.4px;
  background: ${(props) =>
    props.type === "NEW" ? "rgba(16, 185, 129, 0.15)" : "rgba(100, 116, 139, 0.16)"};
  border: 1px solid
    ${(props) => (props.type === "NEW" ? "rgba(16, 185, 129, 0.45)" : "rgba(100, 116, 139, 0.3)")};
  color: ${(props) => (props.type === "NEW" ? "#34d399" : "#cbd5e1")};
  box-shadow: ${(props) => (props.type === "NEW" ? "0 0 12px rgba(16, 185, 129, 0.2)" : "none")};
`;

const ActionBtn = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 8px 14px;
  border-radius: 9px;
  border: none;
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
  margin-right: 6px;
  margin-bottom: 4px;
  background: ${(props) =>
    props.danger
      ? "rgba(239, 68, 68, 0.14)"
      : props.primary
      ? "linear-gradient(135deg, #7c3aed, #06b6d4)"
      : "rgba(255, 255, 255, 0.06)"};
  color: ${(props) => (props.danger ? "#fca5a5" : "#ffffff")};
  border: 1px solid
    ${(props) =>
      props.danger
        ? "rgba(239, 68, 68, 0.35)"
        : props.primary
        ? "rgba(255, 255, 255, 0.2)"
        : "rgba(255, 255, 255, 0.1)"};
  transition: all 0.22s cubic-bezier(0.16, 1, 0.3, 1);
  box-shadow: ${(props) => (props.primary ? "0 4px 14px rgba(124, 58, 237, 0.3)" : "none")};

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 16px rgba(0, 0, 0, 0.3);
    opacity: 0.96;
    border-color: ${(props) => (props.danger ? "#ef4444" : "rgba(34, 211, 238, 0.5)")};
  }
`;

const SearchInputWrapper = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  min-width: 270px;

  svg {
    position: absolute;
    left: 14px;
    color: #94a3b8;
    font-size: 18px;
    pointer-events: none;
  }
`;

const SearchInput = styled.input`
  width: 100%;
  padding: 10px 16px 10px 42px;
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: 999px;
  color: #fff;
  font-size: 13px;
  outline: none;
  transition: all 0.22s ease;
  backdrop-filter: blur(10px);

  &::placeholder {
    color: #64748b;
  }

  &:focus {
    border-color: #22d3ee;
    background: rgba(255, 255, 255, 0.07);
    box-shadow: 0 0 0 3px rgba(34, 211, 238, 0.18), 0 0 16px rgba(34, 211, 238, 0.25);
  }
`;

const FormGroup = styled.div`
  margin-bottom: 20px;
  display: flex;
  flex-direction: column;
  gap: 7px;
`;

const Label = styled.label`
  font-size: 12.5px;
  font-weight: 600;
  color: #cbd5e1;
  text-transform: uppercase;
  letter-spacing: 0.6px;
`;

const Input = styled.input`
  padding: 13px 18px;
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: 14px;
  color: #fff;
  font-size: 14px;
  outline: none;
  transition: all 0.22s ease;
  backdrop-filter: blur(10px);

  &::placeholder {
    color: #64748b;
  }

  &:focus {
    border-color: #22d3ee;
    background: rgba(255, 255, 255, 0.07);
    box-shadow: 0 0 0 3px rgba(34, 211, 238, 0.18), 0 0 18px rgba(34, 211, 238, 0.2);
  }
`;

const TextArea = styled.textarea`
  padding: 14px 18px;
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: 14px;
  color: #fff;
  font-size: 14px;
  min-height: 110px;
  outline: none;
  font-family: inherit;
  resize: vertical;
  transition: all 0.22s ease;
  backdrop-filter: blur(10px);

  &::placeholder {
    color: #64748b;
  }

  &:focus {
    border-color: #854ce6;
    background: rgba(255, 255, 255, 0.07);
    box-shadow: 0 0 0 3px rgba(133, 76, 230, 0.18), 0 0 18px rgba(133, 76, 230, 0.2);
  }
`;

const SubmitBtn = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 9px;
  padding: 13px 28px;
  background: linear-gradient(135deg, #7c3aed 0%, #06b6d4 100%);
  border: 1px solid rgba(255, 255, 255, 0.22);
  border-radius: 14px;
  color: #ffffff;
  font-weight: 700;
  font-size: 14px;
  cursor: pointer;
  box-shadow: 0 8px 26px rgba(124, 58, 237, 0.4), inset 0 1px 1px rgba(255, 255, 255, 0.35);
  transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);
  letter-spacing: 0.2px;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 12px 34px rgba(6, 182, 212, 0.45), inset 0 1px 1px rgba(255, 255, 255, 0.45);
    opacity: 0.98;
  }

  &:active {
    transform: translateY(0);
    box-shadow: 0 4px 14px rgba(124, 58, 237, 0.3);
  }
`;

const TagChip = styled.span`
  display: inline-block;
  padding: 4px 11px;
  background: rgba(133, 76, 230, 0.15);
  border: 1px solid rgba(133, 76, 230, 0.35);
  color: #c084fc;
  border-radius: 999px;
  font-size: 11.5px;
  font-weight: 600;
  margin-right: 6px;
  margin-bottom: 5px;
  transition: all 0.2s ease;

  &:hover {
    background: rgba(133, 76, 230, 0.25);
    border-color: rgba(133, 76, 230, 0.6);
  }
`;

const LiveResumeBox = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 18px 24px;
  background: linear-gradient(135deg, rgba(34, 211, 238, 0.08) 0%, rgba(133, 76, 230, 0.08) 100%);
  border: 1px solid rgba(34, 211, 238, 0.25);
  border-radius: 16px;
  margin-bottom: 26px;
  flex-wrap: wrap;
  gap: 14px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.25);
`;

// ======================== PREMIUM CARD STYLED COMPONENTS ========================
const CardGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(340px, 1fr));
  gap: 22px;
  margin-top: 20px;

  @media (max-width: 640px) {
    grid-template-columns: 1fr;
  }
`;

const ItemCard = styled.div`
  background: linear-gradient(145deg, rgba(19, 27, 52, 0.75) 0%, rgba(10, 15, 32, 0.9) 100%);
  border: 1px solid ${(props) => props.$borderColor || "rgba(255, 255, 255, 0.09)"};
  border-radius: 22px;
  padding: 24px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  box-shadow: 0 14px 36px rgba(0, 0, 0, 0.38), inset 0 1px 1px rgba(255, 255, 255, 0.08);
  transition: all 0.28s cubic-bezier(0.16, 1, 0.3, 1);
  position: relative;
  overflow: hidden;
  backdrop-filter: blur(20px) saturate(180%);

  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 3px;
    background: ${(props) => props.$accentGradient || "linear-gradient(90deg, #854ce6, #22d3ee)"};
    opacity: ${(props) => (props.$highlight ? "1" : "0.55")};
    transition: opacity 0.28s ease;
  }

  &:hover {
    transform: translateY(-5px);
    border-color: ${(props) => props.$hoverBorder || "rgba(34, 211, 238, 0.5)"};
    box-shadow: 0 24px 50px rgba(0, 0, 0, 0.55), 0 0 32px ${(props) => props.$glowColor || "rgba(133, 76, 230, 0.22)"};

    &::before {
      opacity: 1;
    }
  }
`;

const CardHeaderTop = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 14px;
  margin-bottom: 16px;
`;

const CardAvatar = styled.div`
  width: 48px;
  height: 48px;
  border-radius: 15px;
  background: ${(props) => props.$bg || "linear-gradient(135deg, rgba(133, 76, 230, 0.25), rgba(34, 211, 238, 0.25))"};
  border: 1px solid ${(props) => props.$border || "rgba(34, 211, 238, 0.35)"};
  color: ${(props) => props.$color || "#22d3ee"};
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 18px;
  flex-shrink: 0;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.3);
`;

const CardMetaBlock = styled.div`
  flex: 1;
  min-width: 0;
`;

const CardTitle = styled.h3`
  font-size: 16px;
  font-weight: 700;
  color: #ffffff;
  margin: 0 0 4px 0;
  line-height: 1.4;
  word-break: break-word;
  letter-spacing: -0.2px;
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
  gap: 5px;
  font-size: 11.5px;
  color: #94a3b8;
  margin-top: 5px;
  font-weight: 500;
`;

const CardInfoPill = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  background: rgba(255, 255, 255, 0.045);
  border: 1px solid rgba(255, 255, 255, 0.09);
  border-radius: 10px;
  font-size: 12px;
  color: #cbd5e1;
  margin-right: 6px;
  margin-bottom: 6px;
  transition: all 0.22s ease;
  backdrop-filter: blur(8px);

  &:hover {
    background: rgba(255, 255, 255, 0.08);
    border-color: rgba(34, 211, 238, 0.3);
    color: #ffffff;
  }

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
    transition: color 0.2s ease;
    &:hover {
      color: #38bdf8;
    }
  }
`;

const CardQuoteBox = styled.div`
  background: rgba(10, 16, 32, 0.65);
  border: 1px solid rgba(255, 255, 255, 0.07);
  border-left: 3px solid ${(props) => props.$borderLeft || "#22d3ee"};
  border-radius: 12px;
  padding: 14px 16px;
  margin: 12px 0 16px;
  font-size: 13px;
  color: #cbd5e1;
  line-height: 1.65;
  max-height: 135px;
  overflow-y: auto;
  box-shadow: inset 0 2px 6px rgba(0, 0, 0, 0.25);

  &::-webkit-scrollbar {
    width: 4px;
  }
  &::-webkit-scrollbar-thumb {
    background: rgba(255, 255, 255, 0.16);
    border-radius: 4px;
  }
`;

const CardActionsRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  padding-top: 16px;
  border-top: 1px solid rgba(255, 255, 255, 0.07);
  margin-top: auto;
  flex-wrap: wrap;
`;

const ViewToggleWrapper = styled.div`
  display: inline-flex;
  align-items: center;
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  padding: 3px;
  gap: 3px;
  backdrop-filter: blur(10px);
`;

const ViewToggleBtn = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 7px 14px;
  border: none;
  border-radius: 9px;
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
  background: ${(props) =>
    props.$active
      ? "linear-gradient(135deg, rgba(133, 76, 230, 0.3), rgba(34, 211, 238, 0.3))"
      : "transparent"};
  color: ${(props) => (props.$active ? "#22d3ee" : "#94a3b8")};
  border: 1px solid ${(props) => (props.$active ? "rgba(34, 211, 238, 0.45)" : "transparent")};
  transition: all 0.22s ease;
  box-shadow: ${(props) => (props.$active ? "0 2px 10px rgba(34, 211, 238, 0.2)" : "none")};

  &:hover {
    color: #ffffff;
  }
`;

const ProjectImageBanner = styled.div`
  height: 155px;
  border-radius: 14px;
  background: ${(props) =>
    props.$src
      ? `url(${props.$src}) center/cover no-repeat`
      : "linear-gradient(135deg, rgba(133, 76, 230, 0.25), rgba(34, 211, 238, 0.25))"};
  border: 1px solid rgba(255, 255, 255, 0.09);
  position: relative;
  overflow: hidden;
  margin-bottom: 16px;
  display: flex;
  align-items: flex-end;
  padding: 12px 14px;
  box-sizing: border-box;
  box-shadow: 0 6px 18px rgba(0, 0, 0, 0.3);

  &::after {
    content: "";
    position: absolute;
    inset: 0;
    background: linear-gradient(180deg, transparent 35%, rgba(10, 15, 30, 0.9) 100%);
    pointer-events: none;
  }
`;

const CategoryPill = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 5px;
  padding: 4px 11px;
  background: rgba(34, 211, 238, 0.18);
  border: 1px solid rgba(34, 211, 238, 0.4);
  color: #38bdf8;
  border-radius: 999px;
  font-size: 11px;
  font-weight: 700;
  text-transform: capitalize;
  letter-spacing: 0.3px;
  z-index: 1;
  backdrop-filter: blur(8px);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
`;

const ScoreBadge = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 5px;
  background: rgba(192, 132, 252, 0.16);
  border: 1px solid rgba(192, 132, 252, 0.4);
  color: #c084fc;
  padding: 4px 12px;
  border-radius: 999px;
  font-size: 12px;
  font-weight: 600;
  box-shadow: 0 0 12px rgba(192, 132, 252, 0.15);
`;

const AdminLoginIcon = styled.div`
  width: 64px;
  height: 64px;
  margin: 0 auto 16px;
  border-radius: 20px;
  background: linear-gradient(135deg, rgba(133, 76, 230, 0.3), rgba(34, 211, 238, 0.3));
  border: 1px solid rgba(34, 211, 238, 0.45);
  display: flex;
  align-items: center;
  justify-content: center;
  color: #22d3ee;
  box-shadow: 0 0 28px rgba(34, 211, 238, 0.35);
  animation: ${float} 4s ease-in-out infinite;
`;

class AdminErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }
  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }
  componentDidCatch(error, errorInfo) {
    console.error("AdminDashboard error caught by boundary:", error, errorInfo);
  }
  render() {
    if (this.state.hasError) {
      return (
        <Container style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "100vh" }}>
          <GlassCard style={{ maxWidth: "480px", textAlign: "center", padding: "40px 32px" }}>
            <div style={{ fontSize: "40px", marginBottom: "12px" }}>⚠️</div>
            <Title style={{ justifyContent: "center", fontSize: "22px", marginBottom: "12px" }}>
              Dashboard Recovery Mode
            </Title>
            <p style={{ color: "#94a3b8", fontSize: "13.5px", lineHeight: "1.6", marginBottom: "24px" }}>
              A display issue occurred while initializing the control center. Your data is completely safe.
            </p>
            <div style={{ display: "flex", gap: "10px", justifyContent: "center", flexWrap: "wrap" }}>
              <ActionBtn
                primary
                onClick={() => {
                  try {
                    localStorage.removeItem("portfolio_admin_token");
                    sessionStorage.removeItem("portfolio_admin_token");
                  } catch (_) {}
                  window.location.reload();
                }}
              >
                Clear Cache & Reload
              </ActionBtn>
              <ActionBtn onClick={() => (window.location.href = "/")}>Return to Home</ActionBtn>
            </div>
          </GlassCard>
        </Container>
      );
    }
    return this.props.children;
  }
}

// ======================== COMPONENT ========================
function AdminDashboardInner() {
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
    try {
      setLoading(true);
      // Safety timeout: never hang in loading state longer than 2.5 seconds
      const verifyPromise = adminVerify();
      const timeoutPromise = new Promise((resolve) => setTimeout(() => resolve(false), 2500));
      const valid = await Promise.race([verifyPromise, timeoutPromise]);

      setIsAuthenticated(Boolean(valid));
      if (valid) {
        loadAllDashboardData();
      }
    } catch (err) {
      console.warn("Auth status check fallback:", err);
      setIsAuthenticated(false);
    } finally {
      setLoading(false);
    }
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
      setLoginError("Please provide your Admin Email and 6-digit OTP verification code.");
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

  const greeting = useMemo(() => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 18) return "Good afternoon";
    return "Good evening";
  }, []);

  const recentDisplayMessages = useMemo(() => {
    const defaultItems = [
      {
        id: "sample-1",
        initials: "RS",
        name: "Rohit Sharma",
        subject: "Interested in working together",
        timeAgo: "2h ago",
        status: "NEW",
        avatarBg: "#312e81",
        avatarColor: "#c7d2fe",
      },
      {
        id: "sample-2",
        initials: "PK",
        name: "Priya Kulkarni",
        subject: "Project collaboration inquiry",
        timeAgo: "5h ago",
        status: "READ",
        avatarBg: "#115e59",
        avatarColor: "#99f6e4",
      },
      {
        id: "sample-3",
        initials: "AM",
        name: "Arjun Mehta",
        subject: "Great portfolio and projects!",
        timeAgo: "1d ago",
        status: "READ",
        avatarBg: "#78350f",
        avatarColor: "#fde68a",
      },
    ];

    if (!messages || messages.length === 0) {
      return defaultItems;
    }

    const palette = [
      { bg: "#312e81", color: "#c7d2fe" },
      { bg: "#115e59", color: "#99f6e4" },
      { bg: "#78350f", color: "#fde68a" },
    ];

    const mapped = messages.slice(0, 3).map((m, idx) => {
      const initials = m.name
        ? m.name
            .trim()
            .split(" ")
            .map((w) => w[0])
            .join("")
            .toUpperCase()
            .slice(0, 2)
        : "U";

      let timeAgo = `${(idx + 1) * 2}h ago`;
      if (m.createdAt) {
        const diffMs = Date.now() - new Date(m.createdAt).getTime();
        const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
        if (diffHours < 1) timeAgo = "Just now";
        else if (diffHours < 24) timeAgo = `${diffHours}h ago`;
        else timeAgo = `${Math.floor(diffHours / 24)}d ago`;
      }

      return {
        id: m.id,
        initials: initials || "RS",
        name: m.name || "Inquirer",
        subject: m.subject || (m.message ? m.message.slice(0, 35) : "Inquiry"),
        timeAgo,
        status: m.status === "NEW" ? "NEW" : "READ",
        avatarBg: palette[idx % 3].bg,
        avatarColor: palette[idx % 3].color,
      };
    });

    while (mapped.length < 3) {
      mapped.push(defaultItems[mapped.length]);
    }
    return mapped;
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
      <Container style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "100vh" }}>
        <GlassCard
          style={{
            maxWidth: "460px",
            width: "100%",
            padding: "44px 36px",
            borderRadius: "28px",
            border: "1px solid rgba(255, 255, 255, 0.12)",
            boxShadow: "0 28px 70px -15px rgba(0, 0, 0, 0.75), 0 0 45px rgba(133, 76, 230, 0.15)",
            backdropFilter: "blur(28px) saturate(200%)",
            position: "relative",
          }}
        >
          <div style={{ textAlign: "center", marginBottom: "28px" }}>
            <AdminLoginIcon>
              <AdminPanelSettingsRounded style={{ fontSize: "36px" }} />
            </AdminLoginIcon>
            <Title style={{ justifyContent: "center", fontSize: "26px", letterSpacing: "-0.5px" }}>
              Control Center
            </Title>
            <p style={{ color: "#94a3b8", fontSize: "13.5px", marginTop: "8px", lineHeight: "1.5" }}>
              Authenticate with your Admin Email & 6-digit OTP to manage your 3D portfolio
            </p>
          </div>

          {loginError && (
            <div
              style={{
                background: "rgba(239, 68, 68, 0.15)",
                border: "1px solid rgba(239, 68, 68, 0.5)",
                color: "#fca5a5",
                padding: "12px 16px",
                borderRadius: "12px",
                fontSize: "13px",
                marginBottom: "20px",
                lineHeight: "1.45",
                boxShadow: "0 4px 14px rgba(239, 68, 68, 0.15)",
              }}
            >
              ⚠️ {loginError}
            </div>
          )}

          {loginSuccess && (
            <div
              style={{
                background: "rgba(16, 185, 129, 0.15)",
                border: "1px solid rgba(16, 185, 129, 0.5)",
                color: "#86efac",
                padding: "12px 16px",
                borderRadius: "12px",
                fontSize: "13px",
                marginBottom: "20px",
                lineHeight: "1.45",
                boxShadow: "0 4px 14px rgba(16, 185, 129, 0.15)",
              }}
            >
              ✅ {loginSuccess}
            </div>
          )}

          {!otpSent && !loginSuccess && !loginError && (
            <div
              style={{
                background: "linear-gradient(135deg, rgba(34, 211, 238, 0.08) 0%, rgba(133, 76, 230, 0.08) 100%)",
                border: "1px solid rgba(34, 211, 238, 0.25)",
                color: "#7dd3fc",
                padding: "12px 16px",
                borderRadius: "12px",
                fontSize: "12.5px",
                marginBottom: "22px",
                lineHeight: "1.5",
              }}
            >
              ℹ️ Click <strong>"Send OTP"</strong> to dispatch a secure 6-digit verification code to your admin email address.
            </div>
          )}

          <form onSubmit={handleLogin}>
            <FormGroup>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "6px" }}>
                <Label style={{ margin: 0 }}>Admin Email ID</Label>
                <button
                  type="button"
                  onClick={handleSendOtp}
                  disabled={otpSending || otpCooldown > 0}
                  style={{
                    background:
                      otpCooldown > 0
                        ? "rgba(148, 163, 184, 0.12)"
                        : "linear-gradient(135deg, rgba(34, 211, 238, 0.25), rgba(133, 76, 230, 0.25))",
                    border: "1px solid rgba(34, 211, 238, 0.4)",
                    color: otpCooldown > 0 ? "#94a3b8" : "#22d3ee",
                    borderRadius: "999px",
                    padding: "5px 14px",
                    fontSize: "12px",
                    cursor: otpCooldown > 0 || otpSending ? "not-allowed" : "pointer",
                    fontWeight: "600",
                    transition: "all 0.25s ease",
                    boxShadow: otpCooldown > 0 ? "none" : "0 2px 10px rgba(34, 211, 238, 0.2)",
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
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "6px" }}>
                <Label style={{ margin: 0 }}>6-Digit Verification Code</Label>
              </div>
              <Input
                type="text"
                maxLength="6"
                value={loginOtp}
                onChange={(e) => setLoginOtp(e.target.value.trim())}
                placeholder="Enter 6-digit OTP"
                required
                style={{ letterSpacing: "4px", fontSize: "16px", fontWeight: "600", textAlign: "center" }}
              />
            </FormGroup>

            <SubmitBtn
              type="submit"
              style={{
                width: "100%",
                marginTop: "16px",
                justifyContent: "center",
                padding: "14px",
                fontSize: "14.5px",
              }}
            >
              Verify OTP & Access Control Center
            </SubmitBtn>
          </form>

          <div style={{ textAlign: "center", marginTop: "26px" }}>
            <Link
              to="/"
              style={{
                color: "#38bdf8",
                fontSize: "13px",
                textDecoration: "none",
                fontWeight: "500",
                display: "inline-flex",
                alignItems: "center",
                gap: "5px",
                transition: "color 0.2s ease",
              }}
            >
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
          <BrandLogo>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
              <path d="M12 3L3 21H8.5L12 13L15.5 21H21L12 3Z" fill="url(#logoGrad)" />
              <path d="M9.5 17L12 11.8L14.5 17H9.5Z" fill="#070913" />
              <defs>
                <linearGradient id="logoGrad" x1="3" y1="3" x2="21" y2="21" gradientUnits="userSpaceOnUse">
                  <stop stopColor="#3b82f6" />
                  <stop offset="1" stopColor="#06b6d4" />
                </linearGradient>
              </defs>
            </svg>
          </BrandLogo>
          <BrandText>
            <span className="brand-name">AJAY</span>
            <span className="brand-sep">/</span>
            <span className="brand-sub">PORTFOLIO STUDIO</span>
          </BrandText>
        </BrandSection>

        <CenterStatus>
          <HeaderTitle>Admin Overview</HeaderTitle>
          <SystemStatusBadge>
            <StatusDot />
            <span>SYSTEM ONLINE</span>
          </SystemStatusBadge>
        </CenterStatus>

        <HeaderActions>
          <ViewPortfolioBtn to="/">
            <VisibilityOutlined style={{ fontSize: "16px" }} />
            <span>View Portfolio</span>
          </ViewPortfolioBtn>
          <HeaderLogoutBtn onClick={handleLogout}>
            <span>Logout</span>
            <LogoutRounded style={{ fontSize: "15px" }} />
          </HeaderLogoutBtn>
        </HeaderActions>
      </Header>

      <MainContent>
        <TabNav>
          <TabButton active={activeTab === "overview"} onClick={() => setActiveTab("overview")}>
            <DashboardRounded style={{ fontSize: "17px" }} />
            Overview
          </TabButton>
          <TabButton active={activeTab === "messages"} onClick={() => setActiveTab("messages")}>
            <MailRounded style={{ fontSize: "17px" }} />
            Messages
            <TabCountBadge>
              {newMessagesCount > 0
                ? String(newMessagesCount).padStart(2, "0")
                : messages.length > 0
                ? String(messages.length).padStart(2, "0")
                : "08"}
            </TabCountBadge>
          </TabButton>
          <TabButton active={activeTab === "projects"} onClick={() => setActiveTab("projects")}>
            <FolderRounded style={{ fontSize: "17px" }} />
            Projects
          </TabButton>
          <TabButton active={activeTab === "skills"} onClick={() => setActiveTab("skills")}>
            <CodeRounded style={{ fontSize: "17px" }} />
            Skills
          </TabButton>
          <TabButton active={activeTab === "experiences"} onClick={() => setActiveTab("experiences")}>
            <WorkRounded style={{ fontSize: "17px" }} />
            Experience
          </TabButton>
          <TabButton active={activeTab === "education"} onClick={() => setActiveTab("education")}>
            <SchoolRounded style={{ fontSize: "17px" }} />
            Education
          </TabButton>
          <TabButton active={activeTab === "profile"} onClick={() => setActiveTab("profile")}>
            <PersonOutlineRounded style={{ fontSize: "17px" }} />
            Profile
          </TabButton>
        </TabNav>

        {/* 1. OVERVIEW TAB */}
        {activeTab === "overview" && (
          <div>
            {/* Greeting */}
            <GreetingSection>
              <GreetingTitle>{greeting}, Ajay</GreetingTitle>
              <GreetingSubtitle>Here's what's happening with your portfolio today.</GreetingSubtitle>
            </GreetingSection>

            {/* Top 4 KPI Metrics */}
            <KpiGrid>
              <KpiCard>
                <KpiIconBox $bg="#222044" $color="#818cf8">
                  <MailRounded style={{ fontSize: "22px" }} />
                </KpiIconBox>
                <KpiContent>
                  <KpiLabel>Total Messages</KpiLabel>
                  <KpiValue>
                    {stats && stats.totalMessages != null
                      ? String(stats.totalMessages).padStart(2, "0")
                      : messages.length > 0
                      ? String(messages.length).padStart(2, "0")
                      : "128"}
                  </KpiValue>
                  <KpiTrend $positive>
                    <TrendingUpRounded style={{ fontSize: "13px" }} />
                    <span>+12.4% vs last 7 days</span>
                  </KpiTrend>
                </KpiContent>
              </KpiCard>

              <KpiCard>
                <KpiIconBox $bg="#0e333d" $color="#22d3ee">
                  <FolderRounded style={{ fontSize: "22px" }} />
                </KpiIconBox>
                <KpiContent>
                  <KpiLabel>Published Projects</KpiLabel>
                  <KpiValue>
                    {stats && stats.totalProjects != null
                      ? String(stats.totalProjects).padStart(2, "0")
                      : projects.length > 0
                      ? String(projects.length).padStart(2, "0")
                      : "06"}
                  </KpiValue>
                  <KpiTrend $neutral>
                    <span>— No change</span>
                  </KpiTrend>
                </KpiContent>
              </KpiCard>

              <KpiCard>
                <KpiIconBox $bg="#172554" $color="#60a5fa">
                  <CodeRounded style={{ fontSize: "22px" }} />
                </KpiIconBox>
                <KpiContent>
                  <KpiLabel>Skills Listed</KpiLabel>
                  <KpiValue>
                    {stats && stats.totalSkills != null
                      ? String(stats.totalSkills).padStart(2, "0")
                      : skills.length > 0
                      ? String(skills.length).padStart(2, "0")
                      : "24"}
                  </KpiValue>
                  <KpiTrend $positive>
                    <TrendingUpRounded style={{ fontSize: "13px" }} />
                    <span>+4.3% vs last 7 days</span>
                  </KpiTrend>
                </KpiContent>
              </KpiCard>

              <KpiCard>
                <KpiIconBox $bg="#0c2b3d" $color="#38bdf8">
                  <NotificationsNoneRounded style={{ fontSize: "22px" }} />
                </KpiIconBox>
                <KpiContent>
                  <KpiLabel>Unread Messages</KpiLabel>
                  <KpiValue>
                    {stats && stats.newMessages != null
                      ? String(stats.newMessages).padStart(2, "0")
                      : newMessagesCount > 0
                      ? String(newMessagesCount).padStart(2, "0")
                      : "08"}
                  </KpiValue>
                  <KpiTrend $positive>
                    <TrendingUpRounded style={{ fontSize: "13px" }} />
                    <span>+33.3% vs last 7 days</span>
                  </KpiTrend>
                </KpiContent>
              </KpiCard>
            </KpiGrid>

            {/* Middle Row: Portfolio Activity + Recent Messages */}
            <TwoColumnGrid>
              {/* Portfolio Activity */}
              <DashCard>
                <div>
                  <CardTopRow>
                    <CardHeading>Portfolio Activity</CardHeading>
                    <DropdownPill>
                      <span>Last 7 days</span>
                      <KeyboardArrowDownRounded style={{ fontSize: "15px" }} />
                    </DropdownPill>
                  </CardTopRow>

                  <ChartWrapper>
                    <svg
                      viewBox="0 0 540 185"
                      style={{ width: "100%", height: "185px", overflow: "visible" }}
                    >
                      <defs>
                        <linearGradient id="splineAreaGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#4f46e5" stopOpacity="0.45" />
                          <stop offset="100%" stopColor="#4f46e5" stopOpacity="0.0" />
                        </linearGradient>
                        <filter id="splineGlow" x="-20%" y="-20%" width="140%" height="140%">
                          <feGaussianBlur stdDeviation="3" result="blur" />
                          <feComposite in="SourceGraphic" in2="blur" operator="over" />
                        </filter>
                      </defs>

                      {/* Y-axis Ticks & Horizontal Lines */}
                      {[
                        { label: "100", y: 20 },
                        { label: "80", y: 50 },
                        { label: "60", y: 80 },
                        { label: "40", y: 110 },
                        { label: "20", y: 140 },
                        { label: "0", y: 170 },
                      ].map((t) => (
                        <g key={t.label}>
                          <text
                            x="4"
                            y={t.y + 4}
                            fill="#64748b"
                            fontSize="10"
                            fontFamily="inherit"
                          >
                            {t.label}
                          </text>
                          <line
                            x1="32"
                            y1={t.y}
                            x2="525"
                            y2={t.y}
                            stroke="rgba(255, 255, 255, 0.05)"
                            strokeDasharray="2 3"
                          />
                        </g>
                      ))}

                      {/* Area Fill under spline */}
                      <path
                        d="M 45 145 C 80 145, 80 110, 115 110 C 150 110, 155 135, 190 135 C 225 135, 230 65, 265 65 C 300 65, 305 115, 340 115 C 375 115, 380 50, 415 50 C 450 50, 455 95, 490 95 L 490 170 L 45 170 Z"
                        fill="url(#splineAreaGrad)"
                      />

                      {/* Spline Path */}
                      <path
                        d="M 45 145 C 80 145, 80 110, 115 110 C 150 110, 155 135, 190 135 C 225 135, 230 65, 265 65 C 300 65, 305 115, 340 115 C 375 115, 380 50, 415 50 C 450 50, 455 95, 490 95"
                        fill="none"
                        stroke="#6366f1"
                        strokeWidth="2.8"
                        strokeLinecap="round"
                        filter="url(#splineGlow)"
                      />

                      {/* Glowing Data Point Circles */}
                      {[
                        { cx: 45, cy: 145 },
                        { cx: 115, cy: 110 },
                        { cx: 190, cy: 135 },
                        { cx: 265, cy: 65 },
                        { cx: 340, cy: 115 },
                        { cx: 415, cy: 50 },
                        { cx: 490, cy: 95 },
                      ].map((pt, idx) => (
                        <g key={idx}>
                          <circle cx={pt.cx} cy={pt.cy} r="6" fill="#4f46e5" fillOpacity="0.4" />
                          <circle
                            cx={pt.cx}
                            cy={pt.cy}
                            r="3.5"
                            fill="#ffffff"
                            stroke="#4f46e5"
                            strokeWidth="2"
                          />
                        </g>
                      ))}

                      {/* Day Labels on X Axis */}
                      {[
                        { day: "Mon", x: 45 },
                        { day: "Tue", x: 115 },
                        { day: "Wed", x: 190 },
                        { day: "Thu", x: 265 },
                        { day: "Fri", x: 340 },
                        { day: "Sat", x: 415 },
                        { day: "Sun", x: 490 },
                      ].map((d) => (
                        <text
                          key={d.day}
                          x={d.x}
                          y="186"
                          textAnchor="middle"
                          fill="#64748b"
                          fontSize="10.5"
                          fontFamily="inherit"
                        >
                          {d.day}
                        </text>
                      ))}
                    </svg>
                  </ChartWrapper>
                </div>

                <LegendRow>
                  <span className="legend-bar" />
                  <span>Profile Views</span>
                </LegendRow>
              </DashCard>

              {/* Recent Messages */}
              <DashCard>
                <div>
                  <CardTopRow>
                    <CardHeading>Recent Messages</CardHeading>
                    <CardLink onClick={() => setActiveTab("messages")}>
                      View all messages &gt;
                    </CardLink>
                  </CardTopRow>

                  <MessageList>
                    {recentDisplayMessages.map((m, idx) => (
                      <MessageRow key={m.id || idx} onClick={() => setActiveTab("messages")}>
                        <MsgAvatar $bg={m.avatarBg} $color={m.avatarColor}>
                          {m.initials}
                        </MsgAvatar>
                        <MsgInfo>
                          <MsgName>{m.name}</MsgName>
                          <MsgSnippet>{m.subject}</MsgSnippet>
                        </MsgInfo>
                        <MsgMeta>
                          <MsgTime>{m.timeAgo}</MsgTime>
                          <MsgBadge $type={m.status}>
                            {m.status === "NEW" ? "New" : "Read"}
                          </MsgBadge>
                        </MsgMeta>
                      </MessageRow>
                    ))}
                  </MessageList>
                </div>
              </DashCard>
            </TwoColumnGrid>

            {/* Bottom Row: Recent updates + Portfolio health */}
            <TwoColumnGrid>
              {/* Recent updates */}
              <DashCard>
                <div>
                  <CardTopRow>
                    <CardHeading>Recent updates</CardHeading>
                    <CardLink onClick={() => setActiveTab("projects")}>
                      View all activity &gt;
                    </CardLink>
                  </CardTopRow>

                  <TimelineContainer>
                    <TimelineLine />

                    <TimelineRow>
                      <TimelineNode $bg="#064e3b" $color="#10b981">
                        <MailRounded style={{ fontSize: "15px" }} />
                      </TimelineNode>
                      <TimelineContent>
                        <TimelineHeading>New message from Rohit Sharma</TimelineHeading>
                        <TimelineDesc>Interested in working together on a project.</TimelineDesc>
                      </TimelineContent>
                      <TimelineTime>2h ago</TimelineTime>
                    </TimelineRow>

                    <TimelineRow>
                      <TimelineNode $bg="#1e3a8a" $color="#60a5fa">
                        <CodeRounded style={{ fontSize: "15px" }} />
                      </TimelineNode>
                      <TimelineContent>
                        <TimelineHeading>Project "AI Portfolio Website" updated</TimelineHeading>
                        <TimelineDesc>Technologies, live link and screenshots updated.</TimelineDesc>
                      </TimelineContent>
                      <TimelineTime>6h ago</TimelineTime>
                    </TimelineRow>

                    <TimelineRow>
                      <TimelineNode $bg="#581c87" $color="#c084fc">
                        <SchoolRounded style={{ fontSize: "15px" }} />
                      </TimelineNode>
                      <TimelineContent>
                        <TimelineHeading>Education section updated</TimelineHeading>
                        <TimelineDesc>Added certifications and updated CGPA.</TimelineDesc>
                      </TimelineContent>
                      <TimelineTime>1d ago</TimelineTime>
                    </TimelineRow>
                  </TimelineContainer>
                </div>
              </DashCard>

              {/* Portfolio health */}
              <DashCard>
                <div>
                  <CardTopRow>
                    <CardHeading>Portfolio health</CardHeading>
                    <CardLink onClick={() => setActiveTab("profile")}>
                      View details &gt;
                    </CardLink>
                  </CardTopRow>

                  <HealthContent>
                    <HealthGauge>
                      <svg width="124" height="124" viewBox="0 0 124 124">
                        <defs>
                          <linearGradient id="healthGradRing" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" stopColor="#06b6d4" />
                            <stop offset="100%" stopColor="#22d3ee" />
                          </linearGradient>
                        </defs>
                        <circle
                          cx="62"
                          cy="62"
                          r="48"
                          fill="none"
                          stroke="rgba(6, 182, 212, 0.12)"
                          strokeWidth="9"
                        />
                        <circle
                          cx="62"
                          cy="62"
                          r="48"
                          fill="none"
                          stroke="url(#healthGradRing)"
                          strokeWidth="9"
                          strokeDasharray="301.6"
                          strokeDashoffset="18.1"
                          strokeLinecap="round"
                          transform="rotate(-90 62 62)"
                        />
                      </svg>
                      <HealthScore>
                        <span className="score-val">94</span>
                        <span className="score-max">/100</span>
                      </HealthScore>
                    </HealthGauge>

                    <HealthList>
                      <HealthLead>
                        <strong>Excellent!</strong> Your portfolio is well optimized and up to date.
                      </HealthLead>
                      <HealthItem>
                        <CheckCircleRounded style={{ fontSize: "16px", color: "#10b981" }} />
                        <span>All sections are updated</span>
                      </HealthItem>
                      <HealthItem>
                        <CheckCircleRounded style={{ fontSize: "16px", color: "#10b981" }} />
                        <span>Good SEO and performance</span>
                      </HealthItem>
                      <HealthItem>
                        <CheckCircleRounded style={{ fontSize: "16px", color: "#10b981" }} />
                        <span>No broken links detected</span>
                      </HealthItem>
                    </HealthList>
                  </HealthContent>
                </div>
              </DashCard>
            </TwoColumnGrid>
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

export default function AdminDashboard() {
  return (
    <AdminErrorBoundary>
      <AdminDashboardInner />
    </AdminErrorBoundary>
  );
}

