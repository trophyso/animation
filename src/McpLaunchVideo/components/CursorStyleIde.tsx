import React from "react";
import { ArrowUp, ChevronDown, FileCode2, Infinity as InfinityIcon } from "lucide-react";
import { monoFont, sansFont } from "../fonts";
import { CARD_SHADOW } from "../script";

export const IDE_COLORS = {
  background: "#181818",
  chrome: "#1f1f1f",
  panel: "#1b1b1b",
  border: "#2b2b2b",
  text: "#d4d4d4",
  muted: "#8b8b8b",
  bubble: "#2a2a2a",
  accent: "#e8e8e8",
};

export const IDE_EXPLORER_WIDTH = 270;
export const IDE_AGENT_WIDTH = 590;
export const IDE_TITLE_HEIGHT = 52;
export const IDE_TAB_HEIGHT = 50;

/** Cursor-style IDE chrome: title bar, file explorer, editor pane and agent side panel. */
export const CursorStyleIde: React.FC<{
  explorer: React.ReactNode;
  editor: React.ReactNode;
  editorTab: string;
  agent: React.ReactNode;
  agentComposer: React.ReactNode;
  style?: React.CSSProperties;
}> = ({ explorer, editor, editorTab, agent, agentComposer, style }) => {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        backgroundColor: IDE_COLORS.background,
        borderRadius: 22,
        border: "1px solid #333",
        boxShadow: CARD_SHADOW,
        overflow: "hidden",
        fontFamily: sansFont,
        color: IDE_COLORS.text,
        ...style,
      }}
    >
      <div
        style={{
          position: "relative",
          flexShrink: 0,
          height: IDE_TITLE_HEIGHT,
          boxSizing: "border-box",
          display: "flex",
          alignItems: "center",
          padding: "0 20px",
          backgroundColor: IDE_COLORS.chrome,
          borderBottom: `1px solid ${IDE_COLORS.border}`,
        }}
      >
        <div style={{ display: "flex", gap: 10 }}>
          {["#FF5F56", "#FFBD2E", "#27C93F"].map((color) => (
            <div
              key={color}
              style={{
                width: 15,
                height: 15,
                borderRadius: 999,
                backgroundColor: color,
              }}
            />
          ))}
        </div>
        <div
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            textAlign: "center",
            fontSize: 20,
            color: IDE_COLORS.muted,
            fontWeight: 500,
          }}
        >
          pulse-app — Cursor
        </div>
      </div>

      <div style={{ flex: 1, minHeight: 0, display: "flex" }}>
        <div
          style={{
            width: IDE_EXPLORER_WIDTH,
            flexShrink: 0,
            backgroundColor: IDE_COLORS.panel,
            borderRight: `1px solid ${IDE_COLORS.border}`,
            padding: "18px 0",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <div
            style={{
              padding: "0 22px 14px",
              fontSize: 12,
              fontWeight: 700,
              letterSpacing: "0.08em",
              color: IDE_COLORS.muted,
            }}
          >
            EXPLORER
          </div>
          {explorer}
        </div>

        <div
          style={{
            flex: 1,
            minWidth: 0,
            display: "flex",
            flexDirection: "column",
            backgroundColor: IDE_COLORS.background,
          }}
        >
          <div
            style={{
              flexShrink: 0,
              height: IDE_TAB_HEIGHT,
              boxSizing: "border-box",
              display: "flex",
              alignItems: "stretch",
              backgroundColor: IDE_COLORS.chrome,
              borderBottom: `1px solid ${IDE_COLORS.border}`,
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                padding: "0 22px",
                backgroundColor: IDE_COLORS.background,
                borderRight: `1px solid ${IDE_COLORS.border}`,
                fontFamily: monoFont,
                fontSize: 14,
                color: IDE_COLORS.accent,
              }}
            >
              <FileCode2 size={20} color="#4fc1ff" />
              {editorTab}
            </div>
          </div>
          <div style={{ flex: 1, minHeight: 0, position: "relative" }}>
            {editor}
          </div>
        </div>

        <div
          style={{
            width: IDE_AGENT_WIDTH,
            flexShrink: 0,
            display: "flex",
            flexDirection: "column",
            backgroundColor: IDE_COLORS.panel,
            borderLeft: `1px solid ${IDE_COLORS.border}`,
          }}
        >
          <div
            style={{
              flexShrink: 0,
              height: 44,
              display: "flex",
              alignItems: "center",
              padding: "0 22px",
              borderBottom: `1px solid ${IDE_COLORS.border}`,
              fontSize: 16,
              fontWeight: 500,
              color: IDE_COLORS.muted,
            }}
          >
            Add Trophy gamification
          </div>
          <div
            style={{
              flex: 1,
              minHeight: 0,
              overflow: "hidden",
              position: "relative",
              maskImage: "linear-gradient(to bottom, transparent 0, black 48px)",
              WebkitMaskImage:
                "linear-gradient(to bottom, transparent 0, black 48px)",
            }}
          >
            {agent}
          </div>
          <div style={{ flexShrink: 0, padding: 18 }}>
            <div
              style={{
                borderRadius: 16,
                border: "1px solid #3a3a3a",
                backgroundColor: "#222",
                padding: "16px 18px 12px",
                display: "flex",
                flexDirection: "column",
                gap: 12,
              }}
            >
              <div
                style={{
                  minHeight: 60,
                  fontSize: 21,
                  lineHeight: 1.4,
                  color: IDE_COLORS.text,
                }}
              >
                {agentComposer}
              </div>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <div style={{ display: "flex", gap: 10 }}>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 6,
                      height: 32,
                      padding: "0 12px",
                      borderRadius: 999,
                      backgroundColor: "#2f2f2f",
                      fontSize: 17,
                      fontWeight: 600,
                      color: IDE_COLORS.accent,
                    }}
                  >
                    <InfinityIcon size={18} />
                    Agent
                    <ChevronDown size={16} color={IDE_COLORS.muted} />
                  </div>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 6,
                      height: 32,
                      padding: "0 12px",
                      fontSize: 17,
                      color: IDE_COLORS.muted,
                    }}
                  >
                    Auto
                    <ChevronDown size={16} />
                  </div>
                </div>
                <div
                  style={{
                    width: 34,
                    height: 34,
                    borderRadius: 999,
                    backgroundColor: IDE_COLORS.accent,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <ArrowUp size={20} color="#111" strokeWidth={2.6} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
