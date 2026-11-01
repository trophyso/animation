import React from "react";
import { spring, useCurrentFrame, useVideoConfig } from "remotion";
import { sansFont } from "../../McpLaunchVideo/fonts";
import { COLORS } from "../script";

/** Eyebrow pill + headline, sized for 1920×1080 social playback. */
export const Caption: React.FC<{
  eyebrow: string;
  title: React.ReactNode;
  subtitle?: string;
  align?: "center" | "left";
  delay?: number;
  style?: React.CSSProperties;
}> = ({ eyebrow, title, subtitle, align = "center", delay = 0, style }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const pill = spring({
    frame: frame - delay,
    fps,
    config: { damping: 16, mass: 0.5, stiffness: 120 },
  });
  const heading = spring({
    frame: frame - delay - 6,
    fps,
    config: { damping: 16, mass: 0.5, stiffness: 110 },
  });
  const sub = spring({
    frame: frame - delay - 16,
    fps,
    config: { damping: 18, mass: 0.5 },
  });

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: align === "center" ? "center" : "flex-start",
        textAlign: align,
        gap: 22,
        fontFamily: sansFont,
        ...style,
      }}
    >
      <div
        style={{
          padding: "12px 26px",
          borderRadius: 999,
          backgroundColor: "#fff",
          border: `1px solid ${COLORS.border}`,
          boxShadow: "0 2px 8px rgba(15, 23, 42, 0.05)",
          fontSize: 30,
          fontWeight: 700,
          color: "#475467",
          letterSpacing: "0.01em",
          opacity: pill,
          transform: `translateY(${(1 - pill) * 16}px)`,
        }}
      >
        {eyebrow}
      </div>
      <div
        style={{
          fontSize: 96,
          fontWeight: 800,
          lineHeight: 1.04,
          letterSpacing: "-0.04em",
          color: COLORS.ink,
          opacity: heading,
          transform: `translateY(${(1 - heading) * 24}px)`,
        }}
      >
        {title}
      </div>
      {subtitle ? (
        <div
          style={{
            fontSize: 44,
            fontWeight: 500,
            lineHeight: 1.25,
            color: COLORS.muted,
            opacity: sub,
            transform: `translateY(${(1 - sub) * 16}px)`,
          }}
        >
          {subtitle}
        </div>
      ) : null}
    </div>
  );
};
