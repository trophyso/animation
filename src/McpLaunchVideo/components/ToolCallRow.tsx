import React from "react";
import { Check, Wrench } from "lucide-react";
import { spring, useCurrentFrame, useVideoConfig } from "remotion";
import { monoFont, sansFont } from "../fonts";
import { SERVER_LABELS, type McpServer } from "../script";

export const Spinner: React.FC<{
  size: number;
  track: string;
  head: string;
}> = ({ size, track, head }) => {
  const frame = useCurrentFrame();
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      style={{ transform: `rotate(${frame * 12}deg)` }}
    >
      <circle cx="12" cy="12" r="9" fill="none" stroke={track} strokeWidth="2.6" />
      <path
        d="M12 3 a9 9 0 0 1 9 9"
        fill="none"
        stroke={head}
        strokeWidth="2.6"
        strokeLinecap="round"
      />
    </svg>
  );
};

/** Cursor-style MCP tool call: "Called <tool> · <server>" in muted text. */
export const ToolCallRow: React.FC<{
  server: McpServer;
  tool: string;
  startFrame: number;
  doneFrame: number;
  fontSize?: number;
}> = ({ server, tool, startFrame, doneFrame, fontSize = 18 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const enter = spring({
    frame: frame - startFrame,
    fps,
    config: { damping: 20, mass: 0.5, stiffness: 140 },
  });
  const done = frame >= doneFrame;
  const iconSize = Math.round(fontSize * 1.05);

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 10,
        opacity: enter,
        transform: `translateY(${(1 - enter) * 10}px)`,
        fontFamily: sansFont,
        fontSize,
        color: "#8b8b8b",
        whiteSpace: "nowrap",
      }}
    >
      <div
        style={{
          width: iconSize,
          height: iconSize,
          flexShrink: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {done ? (
          <Check size={iconSize} color="#9d9d9d" strokeWidth={2.4} />
        ) : (
          <Spinner size={iconSize} track="#333" head="#bdbdbd" />
        )}
      </div>
      <Wrench size={iconSize * 0.85} color="#6f6f6f" />
      <span>{done ? "Called" : "Calling"}</span>
      <span style={{ fontFamily: monoFont, color: "#d6d6d6" }}>{tool}</span>
      <span style={{ color: "#6f6f6f" }}>· {SERVER_LABELS[server]}</span>
    </div>
  );
};
