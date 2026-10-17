import React, { useState, useRef, useEffect, useMemo, useCallback } from "react";
import styled, { keyframes, css } from "styled-components";
import { sendChatMessage } from "../../utils/api";
import {
  AutoAwesomeRounded,
  SmartToyRounded,
  SendRounded,
  CloseRounded,
  DeleteOutlineRounded,
  ContentCopyRounded,
  CheckRounded,
  VolumeUpRounded,
  OpenInFullRounded,
  CloseFullscreenRounded,
  LaunchRounded,
  ArrowForwardRounded,
} from "@mui/icons-material";

// ======================== KEYFRAMES & ANIMATIONS ========================
const pulseGlow = keyframes`
  0% { box-shadow: 0 0 0 0 rgba(139, 92, 246, 0.5); }
  70% { box-shadow: 0 0 0 16px rgba(139, 92, 246, 0); }
  100% { box-shadow: 0 0 0 0 rgba(139, 92, 246, 0); }
`;

const shimmer = keyframes`
  0% { background-position: -200% 0; }
  100% { background-position: 200% 0; }
`;

const blinkCursor = keyframes`
  0%, 100% { opacity: 1; }
  50% { opacity: 0; }
`;

const rotateGlow = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`;

const fadeInScale = keyframes`
  from { opacity: 0; transform: translateY(14px) scale(0.96); }
  to { opacity: 1; transform: translateY(0) scale(1); }
`;

const soundWave = keyframes`
  0%, 100% { height: 4px; }
  50% { height: 14px; }
`;

// ======================== STYLED CONTAINERS ========================
const WidgetContainer = styled.div`
  position: fixed;
  bottom: 24px;
  right: 24px;
  z-index: 9999;
  font-family: "Poppins", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  pointer-events: none;

  @media (max-width: 480px) {
    bottom: 16px;
    right: 16px;
  }
`;

const LauncherContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  pointer-events: auto;
`;

const LauncherTooltip = styled.div`
  background: rgba(15, 23, 42, 0.94);
  border: 1px solid rgba(34, 211, 238, 0.55);
  color: #22d3ee;
  font-size: 13px;
  font-weight: 600;
  padding: 8px 16px;
  border-radius: 999px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5), 0 0 20px rgba(34, 211, 238, 0.25);
  backdrop-filter: blur(14px);
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  transition: all 0.25s ease;
  user-select: none;
  animation: ${pulseGlow} 3.2s infinite;

  &:hover {
    background: rgba(15, 23, 42, 1);
    border-color: #22d3ee;
    transform: translateX(-4px) scale(1.03);
    box-shadow: 0 12px 35px rgba(0, 0, 0, 0.6), 0 0 25px rgba(34, 211, 238, 0.4);
  }

  @media (max-width: 600px) {
    display: none;
  }
`;

const LauncherButton = styled.button`
  position: relative;
  pointer-events: auto;
  width: 58px;
  height: 58px;
  border-radius: 999px;
  border: 1px solid rgba(255, 255, 255, 0.25);
  background: linear-gradient(135deg, ${({ theme }) => theme.primary}, ${({ theme }) => theme.accent});
  color: #ffffff;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  box-shadow: 0 12px 32px rgba(139, 92, 246, 0.45);
  transition: transform 0.22s ease, box-shadow 0.22s ease;
  animation: ${pulseGlow} 2.8s infinite;

  &:hover {
    transform: scale(1.08);
    box-shadow: 0 16px 40px rgba(34, 211, 238, 0.45);
  }
`;

const AiBadge = styled.span`
  position: absolute;
  top: -4px;
  right: -5px;
  background: linear-gradient(135deg, #22d3ee, #854ce6);
  color: #0b0b1a;
  font-size: 10px;
  font-weight: 800;
  letter-spacing: 0.6px;
  padding: 2px 6px;
  border-radius: 999px;
  border: 2px solid #0f172a;
  box-shadow: 0 0 12px rgba(34, 211, 238, 0.9);
  display: flex;
  align-items: center;
  gap: 2px;
  pointer-events: none;
`;

const ChatWindow = styled.div`
  pointer-events: auto;
  width: ${({ $isExpanded }) => ($isExpanded ? "530px" : "390px")};
  max-width: calc(100vw - 32px);
  height: ${({ $isExpanded }) => ($isExpanded ? "660px" : "550px")};
  max-height: calc(100vh - 100px);
  margin-bottom: 14px;
  background: linear-gradient(180deg, rgba(15, 23, 42, 0.97) 0%, rgba(10, 15, 30, 0.98) 100%);
  border: 1px solid rgba(139, 92, 246, 0.35);
  border-radius: 22px;
  box-shadow: 0 24px 80px rgba(0, 0, 0, 0.65), 0 0 40px rgba(139, 92, 246, 0.22);
  backdrop-filter: blur(20px);
  display: flex;
  flex-direction: column;
  overflow: hidden;
  animation: ${fadeInScale} 0.26s cubic-bezier(0.16, 1, 0.3, 1);
  transition: width 0.3s cubic-bezier(0.16, 1, 0.3, 1), height 0.3s cubic-bezier(0.16, 1, 0.3, 1);
`;

const ChatHeader = styled.div`
  padding: 14px 18px;
  background: rgba(255, 255, 255, 0.035);
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
  display: flex;
  align-items: center;
  justify-content: space-between;
  user-select: none;
`;

const HeaderInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

const AvatarWrapper = styled.div`
  position: relative;
  width: 38px;
  height: 38px;
  border-radius: 50%;
  padding: 2px;
  background: linear-gradient(135deg, #22d3ee, #854ce6);
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 0 16px rgba(34, 211, 238, 0.35);
`;

const AvatarInner = styled.div`
  width: 100%;
  height: 100%;
  border-radius: 50%;
  background: #0f172a;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #22d3ee;
`;

const TitleBlock = styled.div`
  display: flex;
  flex-direction: column;
`;

const HeaderTitle = styled.div`
  font-size: 15px;
  font-weight: 700;
  color: #f8fafc;
  display: flex;
  align-items: center;
  gap: 6px;
`;

const HeaderStatus = styled.div`
  font-size: 11.5px;
  color: #22d3ee;
  display: flex;
  align-items: center;
  gap: 5px;
  font-weight: 500;

  &::before {
    content: "";
    display: inline-block;
    width: 7px;
    height: 7px;
    border-radius: 50%;
    background-color: #10b981;
    box-shadow: 0 0 8px #10b981;
  }
`;

const HeaderActions = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
`;

const ActionIconButton = styled.button`
  background: transparent;
  border: none;
  color: #94a3b8;
  cursor: pointer;
  padding: 6px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;

  &:hover {
    background: rgba(255, 255, 255, 0.08);
    color: #f8fafc;
  }
`;

const MessagesArea = styled.div`
  flex: 1;
  padding: 16px;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 14px;

  &::-webkit-scrollbar {
    width: 5px;
  }
  &::-webkit-scrollbar-thumb {
    background: rgba(148, 163, 184, 0.22);
    border-radius: 999px;
  }
`;

// ======================== MESSAGE BUBBLE & MARKDOWN ========================
const MessageRow = styled.div`
  display: flex;
  flex-direction: column;
  align-items: ${({ $sender }) => ($sender === "user" ? "flex-end" : "flex-start")};
  animation: ${fadeInScale} 0.22s ease-out;
  max-width: 100%;
`;

const MessageBubble = styled.div`
  max-width: 88%;
  padding: 12px 16px;
  border-radius: 18px;
  font-size: 13.5px;
  line-height: 1.62;
  word-break: break-word;
  position: relative;

  ${({ $sender, theme }) =>
    $sender === "user"
      ? css`
          align-self: flex-end;
          background: linear-gradient(135deg, ${theme.primary || "#854ce6"}, ${theme.accent || "#22d3ee"});
          color: #ffffff;
          border-bottom-right-radius: 4px;
          box-shadow: 0 6px 18px rgba(139, 92, 246, 0.3);
        `
      : css`
          align-self: flex-start;
          background: rgba(255, 255, 255, 0.045);
          border: 1px solid rgba(139, 92, 246, 0.25);
          color: #e2e8f0;
          border-bottom-left-radius: 4px;
          backdrop-filter: blur(10px);
          box-shadow: 0 4px 18px rgba(0, 0, 0, 0.25);
        `}
`;

const BlinkingCursor = styled.span`
  display: inline-block;
  width: 7px;
  height: 14px;
  background-color: #22d3ee;
  margin-left: 3px;
  vertical-align: -1px;
  border-radius: 1px;
  animation: ${blinkCursor} 0.8s infinite;
  box-shadow: 0 0 8px #22d3ee;
`;

const CodeBlockContainer = styled.div`
  margin: 10px 0;
  background: #090d16;
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 10px;
  overflow: hidden;
  font-family: "Fira Code", monospace;
  font-size: 12.5px;
`;

const CodeHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: rgba(255, 255, 255, 0.04);
  padding: 6px 12px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.06);
  color: #94a3b8;
  font-size: 11px;
  text-transform: uppercase;
  font-weight: 600;
`;

const CodeBody = styled.pre`
  margin: 0;
  padding: 12px;
  overflow-x: auto;
  color: #38bdf8;
  line-height: 1.5;
`;

const InlineCode = styled.code`
  background: rgba(34, 211, 238, 0.12);
  border: 1px solid rgba(34, 211, 238, 0.25);
  color: #22d3ee;
  padding: 2px 6px;
  border-radius: 6px;
  font-size: 12px;
  font-family: monospace;
`;

const DeepLinkPill = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 4px;
  background: rgba(34, 211, 238, 0.12);
  border: 1px solid rgba(34, 211, 238, 0.35);
  color: #22d3ee;
  font-size: 12px;
  font-weight: 600;
  padding: 3px 9px;
  border-radius: 999px;
  cursor: pointer;
  margin: 3px 2px;
  transition: all 0.2s ease;

  &:hover {
    background: rgba(34, 211, 238, 0.25);
    border-color: #22d3ee;
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(34, 211, 238, 0.3);
  }
`;

const MessageActionBar = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  margin-top: 5px;
  padding: 0 4px;
  font-size: 11px;
  color: #64748b;
`;

const ActionPillBtn = styled.button`
  background: none;
  border: none;
  color: #94a3b8;
  cursor: pointer;
  padding: 3px 6px;
  border-radius: 6px;
  display: inline-flex;
  align-items: center;
  gap: 4px;
  font-size: 11px;
  transition: all 0.2s ease;

  &:hover {
    background: rgba(255, 255, 255, 0.08);
    color: #22d3ee;
  }
`;

const EqualizerIcon = styled.div`
  display: inline-flex;
  align-items: flex-end;
  gap: 2px;
  height: 12px;
  span {
    display: inline-block;
    width: 2px;
    background: #22d3ee;
    border-radius: 999px;
    animation: ${soundWave} 0.8s ease-in-out infinite;
    &:nth-child(1) { animation-delay: 0.1s; }
    &:nth-child(2) { animation-delay: 0.3s; }
    &:nth-child(3) { animation-delay: 0.2s; }
  }
`;

// ======================== THINKING INDICATOR ========================
const ThinkingCard = styled.div`
  align-self: flex-start;
  max-width: 85%;
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(139, 92, 246, 0.3);
  border-radius: 16px;
  border-bottom-left-radius: 4px;
  padding: 12px 16px;
  display: flex;
  flex-direction: column;
  gap: 8px;
  animation: ${fadeInScale} 0.2s ease-out;
`;

const ThinkingTop = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const SpinningSparkle = styled.div`
  color: #22d3ee;
  display: flex;
  align-items: center;
  animation: ${rotateGlow} 4s linear infinite;
`;

const ThinkingText = styled.span`
  font-size: 12.5px;
  color: #94a3b8;
  font-weight: 500;
`;

const ShimmerBar = styled.div`
  height: 3px;
  width: 100%;
  border-radius: 999px;
  background: linear-gradient(90deg, rgba(34, 211, 238, 0.2) 0%, rgba(139, 92, 246, 0.8) 50%, rgba(34, 211, 238, 0.2) 100%);
  background-size: 200% 100%;
  animation: ${shimmer} 1.6s infinite;
`;

// ======================== SUGGESTIONS & PROMPTS ========================
const SuggestionsContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 7px;
  margin-top: 4px;
  animation: ${fadeInScale} 0.3s ease-out;
`;

const SuggestionLabel = styled.span`
  font-size: 11.5px;
  color: #94a3b8;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 5px;
`;

const SuggestionsGrid = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 7px;
`;

const SuggestionChip = styled.button`
  background: rgba(139, 92, 246, 0.1);
  border: 1px solid rgba(139, 92, 246, 0.3);
  color: #cbd5e1;
  padding: 7px 12px;
  border-radius: 999px;
  font-size: 12px;
  text-align: left;
  cursor: pointer;
  transition: all 0.2s ease;
  font-family: inherit;
  display: inline-flex;
  align-items: center;
  gap: 6px;

  &:hover {
    background: rgba(34, 211, 238, 0.16);
    border-color: #22d3ee;
    color: #ffffff;
    transform: translateX(2px) translateY(-1px);
    box-shadow: 0 4px 14px rgba(34, 211, 238, 0.22);
  }
`;

// ======================== INPUT CONTAINER ========================
const InputContainer = styled.form`
  padding: 12px 14px;
  background: rgba(0, 0, 0, 0.3);
  border-top: 1px solid rgba(255, 255, 255, 0.08);
  display: flex;
  gap: 8px;
  align-items: center;
`;

const ChatInput = styled.input`
  flex: 1;
  background: rgba(255, 255, 255, 0.045);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 999px;
  padding: 11px 18px;
  font-size: 13.5px;
  color: #f8fafc;
  outline: none;
  font-family: inherit;
  transition: all 0.2s ease;

  &:focus {
    border-color: #22d3ee;
    background: rgba(255, 255, 255, 0.075);
    box-shadow: 0 0 0 3px rgba(34, 211, 238, 0.12);
  }

  &::placeholder {
    color: #64748b;
  }
`;

const SendButton = styled.button`
  width: 42px;
  height: 42px;
  border-radius: 50%;
  border: none;
  background: linear-gradient(135deg, ${({ theme }) => theme.primary || "#854ce6"}, ${({ theme }) => theme.accent || "#22d3ee"});
  color: #ffffff;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
  flex-shrink: 0;

  &:disabled {
    opacity: 0.45;
    cursor: not-allowed;
    transform: none;
  }

  &:not(:disabled):hover {
    transform: scale(1.06);
    box-shadow: 0 0 16px rgba(34, 211, 238, 0.5);
  }
`;

const ErrorBanner = styled.div`
  padding: 8px 12px;
  background: rgba(239, 68, 68, 0.15);
  border: 1px solid rgba(239, 68, 68, 0.35);
  color: #fca5a5;
  font-size: 12px;
  border-radius: 10px;
  margin: 4px 16px;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

// ======================== HELPER COMPONENTS ========================
const THINKING_STEPS = [
  "Consulting Ajay's live portfolio database...",
  "Analyzing Java & Spring Boot architecture...",
  "Synthesizing personalized response...",
];

const STARTER_PROMPTS = [
  "What are your top projects?",
  "Tell me about your Spring Boot skills",
  "Where did you intern and what did you build?",
  "How can I contact Ajay?",
];

// Initial welcoming assistant prompt
const initialMessage = {
  id: "msg_init",
  sender: "assistant",
  text: `Hi! I'm Ajay Sapkale's AI portfolio assistant powered by Spring Boot & Spring AI.\n\nAsk me anything about Ajay's projects, skills in Java & React, work experience, or how to reach him!`,
  timestamp: "Online",
  isStreaming: false,
};

// Contextual smart suggestions generator
function getDynamicFollowUps(lastText, isInitial) {
  if (isInitial || !lastText) {
    return STARTER_PROMPTS;
  }
  const lower = lastText.toLowerCase();
  if (lower.includes("project") || lower.includes("eazy logistics") || lower.includes("wanderlust")) {
    return [
      "Tell me about Eazy Logistics tech stack",
      "What are Ajay's Spring Boot skills?",
      "Can I see his resume?",
    ];
  }
  if (lower.includes("skill") || lower.includes("java") || lower.includes("spring") || lower.includes("react")) {
    return [
      "What projects did Ajay build with Spring Boot?",
      "Tell me about his internships",
      "How can I contact Ajay?",
    ];
  }
  if (lower.includes("experience") || lower.includes("intern") || lower.includes("education") || lower.includes("college")) {
    return [
      "What did Ajay build at Growfinix?",
      "Show top featured projects",
      "Download Ajay's resume",
    ];
  }
  return [
    "What are your top projects?",
    "Tell me about your Spring Boot skills",
    "Where did you intern?",
    "How can I contact Ajay?",
  ];
}

/**
 * Smooth markdown renderer with code copy buttons, section deep links, and highlighted bold text
 */
function MarkdownRenderer({ content, isStreaming }) {
  const handleCopyCode = (code, e) => {
    e.stopPropagation();
    navigator.clipboard.writeText(code);
    const target = e.currentTarget;
    target.textContent = "Copied!";
    setTimeout(() => {
      target.textContent = "Copy";
    }, 2000);
  };

  const handleJump = (sectionHash, e) => {
    e.preventDefault();
    const id = sectionHash.replace(/^#/, "");
    const elem = document.getElementById(id);
    if (elem) {
      elem.scrollIntoView({ behavior: "smooth" });
    }
  };

  const parts = content.split(/(```[\s\S]*?```)/g);

  return (
    <div>
      {parts.map((part, partIdx) => {
        if (part.startsWith("```") && part.endsWith("```")) {
          const raw = part.slice(3, -3);
          const firstLineBreak = raw.indexOf("\n");
          let lang = "code";
          let codeText = raw;
          if (firstLineBreak !== -1) {
            lang = raw.slice(0, firstLineBreak).trim() || "code";
            codeText = raw.slice(firstLineBreak + 1);
          }
          return (
            <CodeBlockContainer key={partIdx}>
              <CodeHeader>
                <span>{lang}</span>
                <button
                  type="button"
                  onClick={(e) => handleCopyCode(codeText, e)}
                  style={{ background: "none", border: "none", color: "#38bdf8", cursor: "pointer", fontSize: "11px" }}
                >
                  Copy
                </button>
              </CodeHeader>
              <CodeBody>{codeText}</CodeBody>
            </CodeBlockContainer>
          );
        }

        const lines = part.split("\n");
        return (
          <div key={partIdx}>
            {lines.map((line, lineIdx) => {
              if (line.startsWith("### ")) {
                return (
                  <div
                    key={lineIdx}
                    style={{
                      fontSize: "14.5px",
                      fontWeight: "700",
                      color: "#f8fafc",
                      margin: "8px 0 4px",
                      borderBottom: "1px solid rgba(34, 211, 238, 0.2)",
                      paddingBottom: "3px",
                    }}
                  >
                    {line.replace("### ", "")}
                  </div>
                );
              }

              const renderFormattedLine = (text) => {
                const sectionLinkMatch = text.match(/\[#(.*?)\]\(#(.*?)\)/);
                if (sectionLinkMatch) {
                  const before = text.substring(0, sectionLinkMatch.index);
                  const label = sectionLinkMatch[1];
                  const target = sectionLinkMatch[2];
                  const after = text.substring(sectionLinkMatch.index + sectionLinkMatch[0].length);
                  return (
                    <span>
                      {renderFormattedLine(before)}
                      <DeepLinkPill type="button" onClick={(e) => handleJump(target, e)}>
                        🚀 {label}
                      </DeepLinkPill>
                      {renderFormattedLine(after)}
                    </span>
                  );
                }

                const boldParts = text.split(/(\*\*.*?\*\*)/g);
                return boldParts.map((bPart, bIdx) => {
                  if (bPart.startsWith("**") && bPart.endsWith("**")) {
                    return (
                      <strong key={bIdx} style={{ color: "#38bdf8", fontWeight: 700 }}>
                        {bPart.slice(2, -2)}
                      </strong>
                    );
                  }

                  const codeParts = bPart.split(/(`.*?`)/g);
                  return codeParts.map((cPart, cIdx) => {
                    if (cPart.startsWith("`") && cPart.endsWith("`")) {
                      return <InlineCode key={cIdx}>{cPart.slice(1, -1)}</InlineCode>;
                    }
                    if (cPart.startsWith("http://") || cPart.startsWith("https://")) {
                      return (
                        <a
                          key={cIdx}
                          href={cPart}
                          target="_blank"
                          rel="noreferrer"
                          style={{ color: "#38bdf8", textDecoration: "underline", wordBreak: "break-all" }}
                        >
                          {cPart} <LaunchRounded style={{ fontSize: "11px", verticalAlign: "middle" }} />
                        </a>
                      );
                    }
                    return cPart;
                  });
                });
              };

              if (line.trim().startsWith("• ") || line.trim().startsWith("- ")) {
                const clean = line.trim().replace(/^[•-]\s*/, "");
                return (
                  <div key={lineIdx} style={{ display: "flex", gap: "8px", margin: "4px 0", alignItems: "flex-start" }}>
                    <span style={{ color: "#22d3ee", fontSize: "14px", lineHeight: "1.4" }}>•</span>
                    <div style={{ flex: 1 }}>{renderFormattedLine(clean)}</div>
                  </div>
                );
              }

              if (!line.trim()) {
                return <div key={lineIdx} style={{ height: "6px" }} />;
              }

              return <div key={lineIdx}>{renderFormattedLine(line)}</div>;
            })}
          </div>
        );
      })}
      {isStreaming && <BlinkingCursor />}
    </div>
  );
}

// ======================== MAIN COMPONENT ========================
export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([initialMessage]);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [copiedId, setCopiedId] = useState(null);
  const [speakingId, setSpeakingId] = useState(null);
  const [thinkingStep, setThinkingStep] = useState(0);

  const messagesEndRef = useRef(null);
  const streamingTimerRef = useRef(null);

  // Cycling thinking status
  useEffect(() => {
    let interval;
    if (isLoading) {
      setThinkingStep(0);
      interval = setInterval(() => {
        setThinkingStep((prev) => (prev + 1) % THINKING_STEPS.length);
      }, 1400);
    }
    return () => clearInterval(interval);
  }, [isLoading]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen, isLoading]);

  // Clean up speech synthesis on unmount
  useEffect(() => {
    return () => {
      if (window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
      if (streamingTimerRef.current) {
        clearInterval(streamingTimerRef.current);
      }
    };
  }, []);

  // Handler for text-to-speech
  const handleToggleSpeak = (msgId, text) => {
    if (!window.speechSynthesis) return;

    if (speakingId === msgId) {
      window.speechSynthesis.cancel();
      setSpeakingId(null);
      return;
    }

    window.speechSynthesis.cancel();
    // Clean markdown characters for voice
    const cleanSpeech = text
      .replace(/[*#•`_]/g, "")
      .replace(/https?:\/\/[^\s]+/g, "link")
      .trim();

    const utterance = new SpeechSynthesisUtterance(cleanSpeech);
    utterance.rate = 1.05;
    utterance.pitch = 1.0;
    utterance.onend = () => setSpeakingId(null);
    utterance.onerror = () => setSpeakingId(null);

    setSpeakingId(msgId);
    window.speechSynthesis.speak(utterance);
  };

  // Copy to clipboard
  const handleCopy = (msgId, text) => {
    const cleanText = text.replace(/[*#`_]/g, "").trim();
    navigator.clipboard.writeText(cleanText);
    setCopiedId(msgId);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Stream in the assistant message character-by-character for a natural typing feel
  const streamAssistantMessage = useCallback((fullText) => {
    const newId = "msg_" + Date.now();
    const timeString = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

    // Insert message initially empty with isStreaming true
    const newMsg = {
      id: newId,
      sender: "assistant",
      text: "",
      fullText: fullText,
      timestamp: timeString,
      isStreaming: true,
    };

    setMessages((prev) => [...prev, newMsg]);

    let currentIndex = 0;
    const chunkSize = 2; // Stream 2 chars per tick for fluid natural speed
    const totalChars = fullText.length;

    streamingTimerRef.current = setInterval(() => {
      currentIndex += chunkSize;
      if (currentIndex >= totalChars) {
        clearInterval(streamingTimerRef.current);
        setMessages((prev) =>
          prev.map((m) => (m.id === newId ? { ...m, text: fullText, isStreaming: false } : m))
        );
      } else {
        const partial = fullText.slice(0, currentIndex);
        setMessages((prev) =>
          prev.map((m) => (m.id === newId ? { ...m, text: partial } : m))
        );
      }
      scrollToBottom();
    }, 14);
  }, []);

  const handleSend = async (queryText) => {
    const textToSend = (queryText || input).trim();
    if (!textToSend || isLoading) return;

    setInput("");
    setErrorMessage("");

    const userMsg = {
      id: "usr_" + Date.now(),
      sender: "user",
      text: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setIsLoading(true);

    try {
      const response = await sendChatMessage(textToSend);
      setIsLoading(false);
      streamAssistantMessage(response.reply);
    } catch (err) {
      setIsLoading(false);
      setErrorMessage(err.message || "Failed to reach AI assistant. Please try again.");
    }
  };

  const handleClear = () => {
    if (window.speechSynthesis) window.speechSynthesis.cancel();
    setSpeakingId(null);
    setMessages([initialMessage]);
    setErrorMessage("");
  };

  const handleDeepJump = (sectionId) => {
    const el = document.getElementById(sectionId);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  // Compute follow-up questions from the last assistant message
  const lastAssistantMsg = useMemo(() => {
    const assistantMsgs = messages.filter((m) => m.sender === "assistant" && !m.isStreaming);
    return assistantMsgs[assistantMsgs.length - 1] || null;
  }, [messages]);

  const followUpSuggestions = useMemo(() => {
    if (isLoading) return [];
    const isInitial = messages.length === 1;
    return getDynamicFollowUps(lastAssistantMsg ? lastAssistantMsg.text : null, isInitial);
  }, [lastAssistantMsg, isLoading, messages.length]);

  return (
    <WidgetContainer>
      {isOpen && (
        <ChatWindow $isExpanded={isExpanded} role="dialog" aria-label="Ajay's AI Assistant">
          {/* Header */}
          <ChatHeader>
            <HeaderInfo>
              <AvatarWrapper>
                <AvatarInner>
                  <AutoAwesomeRounded style={{ fontSize: "20px" }} />
                </AvatarInner>
              </AvatarWrapper>
              <TitleBlock>
                <HeaderTitle>Ajay's AI Assistant</HeaderTitle>
                <HeaderStatus>Spring AI • GPT-4o Online</HeaderStatus>
              </TitleBlock>
            </HeaderInfo>

            <HeaderActions>
              <ActionIconButton
                onClick={() => setIsExpanded(!isExpanded)}
                title={isExpanded ? "Collapse to regular size" : "Expand widescreen"}
                aria-label="Toggle Expand"
              >
                {isExpanded ? (
                  <CloseFullscreenRounded style={{ fontSize: "17px" }} />
                ) : (
                  <OpenInFullRounded style={{ fontSize: "17px" }} />
                )}
              </ActionIconButton>

              <ActionIconButton onClick={handleClear} title="Clear conversation" aria-label="Clear chat">
                <DeleteOutlineRounded style={{ fontSize: "18px" }} />
              </ActionIconButton>

              <ActionIconButton onClick={() => setIsOpen(false)} title="Close chat" aria-label="Close chat">
                <CloseRounded style={{ fontSize: "19px" }} />
              </ActionIconButton>
            </HeaderActions>
          </ChatHeader>

          {/* Messages Feed */}
          <MessagesArea>
            {messages.map((msg) => (
              <MessageRow key={msg.id} $sender={msg.sender}>
                <MessageBubble $sender={msg.sender}>
                  {msg.sender === "assistant" ? (
                    <MarkdownRenderer content={msg.text} isStreaming={msg.isStreaming} />
                  ) : (
                    msg.text
                  )}

                  {/* Contextual Section CTAs for assistant responses */}
                  {msg.sender === "assistant" && !msg.isStreaming && (
                    <div style={{ marginTop: "10px", display: "flex", gap: "6px", flexWrap: "wrap" }}>
                      {msg.text.toLowerCase().includes("project") && (
                        <DeepLinkPill onClick={() => handleDeepJump("Projects")}>
                          🚀 Go to Projects
                        </DeepLinkPill>
                      )}
                      {(msg.text.toLowerCase().includes("resume") || msg.text.toLowerCase().includes("cv")) && (
                        <DeepLinkPill
                          as="a"
                          href="https://drive.google.com/file/d/1odgxEt0eeU7uhBg_VZsNFWzq1PjEY-Cr/view?usp=sharing"
                          target="_blank"
                          rel="noreferrer"
                        >
                          📄 Open Resume <LaunchRounded style={{ fontSize: "11px", marginLeft: "2px" }} />
                        </DeepLinkPill>
                      )}
                      {(msg.text.toLowerCase().includes("contact") || msg.text.toLowerCase().includes("hire") || msg.text.toLowerCase().includes("email")) && (
                        <DeepLinkPill onClick={() => handleDeepJump("Contact")}>
                          ✉️ Contact Form
                        </DeepLinkPill>
                      )}
                      {(msg.text.toLowerCase().includes("experience") || msg.text.toLowerCase().includes("intern")) && (
                        <DeepLinkPill onClick={() => handleDeepJump("Experience")}>
                          💼 Experience Timeline
                        </DeepLinkPill>
                      )}
                      {(msg.text.toLowerCase().includes("education") || msg.text.toLowerCase().includes("college")) && (
                        <DeepLinkPill onClick={() => handleDeepJump("Education")}>
                          🎓 Education
                        </DeepLinkPill>
                      )}
                    </div>
                  )}
                </MessageBubble>

                {/* Assistant Action Bar (Copy, Voice TTS, Timestamp) */}
                {msg.sender === "assistant" && !msg.isStreaming && (
                  <MessageActionBar>
                    <span>{msg.timestamp || "Just now"}</span>
                    <ActionPillBtn onClick={() => handleCopy(msg.id, msg.text)}>
                      {copiedId === msg.id ? (
                        <>
                          <CheckRounded style={{ fontSize: "12px", color: "#10b981" }} /> Copied!
                        </>
                      ) : (
                        <>
                          <ContentCopyRounded style={{ fontSize: "12px" }} /> Copy
                        </>
                      )}
                    </ActionPillBtn>

                    <ActionPillBtn onClick={() => handleToggleSpeak(msg.id, msg.text)}>
                      {speakingId === msg.id ? (
                        <>
                          <EqualizerIcon>
                            <span />
                            <span />
                            <span />
                          </EqualizerIcon>
                          Stop
                        </>
                      ) : (
                        <>
                          <VolumeUpRounded style={{ fontSize: "13px" }} /> Listen
                        </>
                      )}
                    </ActionPillBtn>
                  </MessageActionBar>
                )}
              </MessageRow>
            ))}

            {/* Thinking / Reasoning Animation */}
            {isLoading && (
              <ThinkingCard>
                <ThinkingTop>
                  <SpinningSparkle>
                    <AutoAwesomeRounded style={{ fontSize: "16px" }} />
                  </SpinningSparkle>
                  <ThinkingText>{THINKING_STEPS[thinkingStep]}</ThinkingText>
                </ThinkingTop>
                <ShimmerBar />
              </ThinkingCard>
            )}

            {/* Smart Suggestions Chips */}
            {!isLoading && followUpSuggestions.length > 0 && (
              <SuggestionsContainer>
                <SuggestionLabel>
                  <AutoAwesomeRounded style={{ fontSize: "13px", color: "#22d3ee" }} />
                  {messages.length === 1 ? "Quick questions you can ask:" : "Suggested follow-ups:"}
                </SuggestionLabel>
                <SuggestionsGrid>
                  {followUpSuggestions.map((prompt, i) => (
                    <SuggestionChip key={i} onClick={() => handleSend(prompt)} type="button">
                      <span>{prompt}</span>
                      <ArrowForwardRounded style={{ fontSize: "12px", opacity: 0.7 }} />
                    </SuggestionChip>
                  ))}
                </SuggestionsGrid>
              </SuggestionsContainer>
            )}

            <div ref={messagesEndRef} />
          </MessagesArea>

          {/* Error Banner */}
          {errorMessage && (
            <ErrorBanner>
              <span>{errorMessage}</span>
              <ActionIconButton onClick={() => setErrorMessage("")} style={{ padding: 2 }} aria-label="Dismiss error">
                ✕
              </ActionIconButton>
            </ErrorBanner>
          )}

          {/* Form Input */}
          <InputContainer
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
          >
            <ChatInput
              type="text"
              placeholder="Ask about Ajay's skills, projects, experience..."
              value={input}
              maxLength={1000}
              onChange={(e) => setInput(e.target.value)}
              disabled={isLoading}
              aria-label="Type your message"
            />
            <SendButton type="submit" disabled={!input.trim() || isLoading} aria-label="Send message">
              <SendRounded style={{ fontSize: "18px" }} />
            </SendButton>
          </InputContainer>
        </ChatWindow>
      )}

      {/* Floating Launcher Button */}
      <LauncherContainer>
        {!isOpen && (
          <LauncherTooltip onClick={() => setIsOpen(true)}>
            <span>Ask Ajay's AI</span>
            <span style={{ fontSize: "14px" }}>✨</span>
          </LauncherTooltip>
        )}
        <LauncherButton
          onClick={() => setIsOpen(!isOpen)}
          aria-label={isOpen ? "Close AI Chat" : "Open AI Chat"}
          title={isOpen ? "Close Chat" : "Ask Ajay's Portfolio AI Assistant"}
        >
          {isOpen ? (
            <CloseRounded style={{ fontSize: "28px" }} />
          ) : (
            <>
              <SmartToyRounded style={{ fontSize: "30px" }} />
              <AiBadge>AI ✨</AiBadge>
            </>
          )}
        </LauncherButton>
      </LauncherContainer>
    </WidgetContainer>
  );
}
