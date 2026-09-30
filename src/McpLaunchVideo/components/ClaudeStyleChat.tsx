import React from "react";
import {
  ArrowUp,
  Asterisk,
  ChevronDown,
  ChevronRight,
  FolderClosed,
  MessagesSquare,
  Plus,
  SlidersHorizontal,
  SquarePen,
  Trophy,
} from "lucide-react";
import { useCurrentFrame } from "remotion";
import { sansFont, serifFont } from "../fonts";
import { CARD_SHADOW } from "../script";

export const CLAUDE_COLORS = {
  background: "#FAF9F5",
  rail: "#F5F4EE",
  bubble: "#F0EEE6",
  border: "#E8E6DC",
  text: "#3D3929",
  muted: "#8A8575",
  faint: "#B7B2A3",
  accent: "#D97757",
};

export const CLAUDE_COLUMN_WIDTH = 1040;
const RAIL_WIDTH = 72;

export const ClaudeMark: React.FC<{ size?: number }> = ({ size = 34 }) => (
  <Asterisk size={size} color={CLAUDE_COLORS.accent} strokeWidth={2.6} />
);

const IconButton: React.FC<{ children: React.ReactNode; size?: number }> = ({
  children,
  size = 40,
}) => (
  <div
    style={{
      width: size,
      height: size,
      borderRadius: 10,
      border: `1px solid ${CLAUDE_COLORS.border}`,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    }}
  >
    {children}
  </div>
);

/** Claude-style chat window: slim rail, conversation header, message column and composer. */
export const ClaudeStyleChat: React.FC<{
  children: React.ReactNode;
  composer: React.ReactNode;
  title: string;
  sendPulse?: number;
  style?: React.CSSProperties;
}> = ({ children, composer, title, sendPulse = 0, style }) => {
  return (
    <div
      style={{
        position: "relative",
        display: "flex",
        backgroundColor: CLAUDE_COLORS.background,
        borderRadius: 24,
        border: `1px solid ${CLAUDE_COLORS.border}`,
        boxShadow: CARD_SHADOW,
        overflow: "hidden",
        fontFamily: sansFont,
        color: CLAUDE_COLORS.text,
        ...style,
      }}
    >
      <div
        style={{
          width: RAIL_WIDTH,
          flexShrink: 0,
          backgroundColor: CLAUDE_COLORS.rail,
          borderRight: `1px solid ${CLAUDE_COLORS.border}`,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          padding: "22px 0",
          gap: 26,
        }}
      >
        <ClaudeMark size={30} />
        <SquarePen size={22} color={CLAUDE_COLORS.muted} />
        <MessagesSquare size={22} color={CLAUDE_COLORS.muted} />
        <FolderClosed size={22} color={CLAUDE_COLORS.muted} />
        <div style={{ flex: 1 }} />
        <div
          style={{
            width: 34,
            height: 34,
            borderRadius: 999,
            backgroundColor: "#3D3929",
            color: "#fff",
            fontSize: 15,
            fontWeight: 700,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          C
        </div>
      </div>

      <div style={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column" }}>
        <div
          style={{
            flexShrink: 0,
            height: 68,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "0 28px",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              fontSize: 21,
              fontWeight: 500,
              color: CLAUDE_COLORS.text,
            }}
          >
            {title}
            <ChevronDown size={18} color={CLAUDE_COLORS.muted} />
          </div>
          <div
            style={{
              padding: "8px 16px",
              borderRadius: 10,
              border: `1px solid ${CLAUDE_COLORS.border}`,
              fontSize: 18,
              fontWeight: 500,
              color: CLAUDE_COLORS.text,
            }}
          >
            Share
          </div>
        </div>

        <div
          style={{
            position: "relative",
            flex: 1,
            minHeight: 0,
            overflow: "hidden",
            display: "flex",
            justifyContent: "center",
            maskImage: "linear-gradient(to bottom, transparent 0, black 56px)",
            WebkitMaskImage: "linear-gradient(to bottom, transparent 0, black 56px)",
          }}
        >
          <div style={{ width: CLAUDE_COLUMN_WIDTH, position: "relative" }}>
            {children}
          </div>
        </div>

        <div
          style={{
            flexShrink: 0,
            display: "flex",
            justifyContent: "center",
            padding: "8px 0 26px",
          }}
        >
          <div
            style={{
              width: CLAUDE_COLUMN_WIDTH,
              borderRadius: 22,
              backgroundColor: "#fff",
              border: `1px solid ${CLAUDE_COLORS.border}`,
              boxShadow: "0 4px 18px rgba(61, 57, 41, 0.06)",
              padding: "18px 20px 14px",
              display: "flex",
              flexDirection: "column",
              gap: 14,
            }}
          >
            <div
              style={{
                minHeight: 66,
                fontSize: 25,
                lineHeight: 1.35,
                color: CLAUDE_COLORS.text,
              }}
            >
              {composer}
            </div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <div style={{ display: "flex", gap: 10 }}>
                <IconButton>
                  <Plus size={20} color={CLAUDE_COLORS.muted} />
                </IconButton>
                <IconButton>
                  <SlidersHorizontal size={18} color={CLAUDE_COLORS.muted} />
                </IconButton>
              </div>
              <div
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: 10,
                  backgroundColor: CLAUDE_COLORS.accent,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  transform: `scale(${1 - sendPulse * 0.15})`,
                }}
              >
                <ArrowUp size={22} color="#fff" strokeWidth={2.6} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

/** Moving highlight across text, like Claude's in-progress tool labels. */
const Shimmer: React.FC<{ children: React.ReactNode; active: boolean }> = ({
  children,
  active,
}) => {
  const frame = useCurrentFrame();
  if (!active) {
    return <>{children}</>;
  }
  const position = ((frame * 2.4) % 240) - 70;
  return (
    <span
      style={{
        backgroundImage: `linear-gradient(90deg, ${CLAUDE_COLORS.faint} ${position - 30}%, ${CLAUDE_COLORS.text} ${position}%, ${CLAUDE_COLORS.faint} ${position + 30}%)`,
        backgroundClip: "text",
        WebkitBackgroundClip: "text",
        color: "transparent",
      }}
    >
      {children}
    </span>
  );
};

export const ConnectorIcon: React.FC<{ size?: number }> = ({ size = 30 }) => (
  <div
    style={{
      width: size,
      height: size,
      borderRadius: 8,
      backgroundColor: "#fff",
      border: `1px solid ${CLAUDE_COLORS.border}`,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      flexShrink: 0,
    }}
  >
    <Trophy size={size * 0.55} color={CLAUDE_COLORS.text} strokeWidth={2.2} />
  </div>
);

/** A single tool use line as Claude renders it: connector icon, label, chevron. */
export const ClaudeToolRow: React.FC<{
  label: string;
  detail: string;
  running: boolean;
}> = ({ label, detail, running }) => (
  <div
    style={{
      display: "flex",
      alignItems: "center",
      gap: 14,
      fontSize: 21,
      color: CLAUDE_COLORS.muted,
      whiteSpace: "nowrap",
    }}
  >
    <ConnectorIcon />
    <span style={{ color: CLAUDE_COLORS.text, fontWeight: 500 }}>
      <Shimmer active={running}>{label}</Shimmer>
    </span>
    <span style={{ opacity: running ? 0 : 1 }}>{detail}</span>
    <ChevronRight
      size={18}
      color={CLAUDE_COLORS.faint}
      style={{ opacity: running ? 0 : 1 }}
    />
  </div>
);

export const ClaudeSerifText: React.FC<{
  children: React.ReactNode;
  style?: React.CSSProperties;
}> = ({ children, style }) => (
  <div
    style={{
      fontFamily: serifFont,
      fontSize: 26,
      lineHeight: 1.5,
      color: CLAUDE_COLORS.text,
      ...style,
    }}
  >
    {children}
  </div>
);
