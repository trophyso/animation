import React from "react";
import { spring, useCurrentFrame, useVideoConfig } from "remotion";
import { sansFont } from "../fonts";
import { COLORS } from "../script";

export const StepCaption: React.FC<{
  eyebrow: string;
  title: string;
  align?: "center" | "left";
  delay?: number;
  style?: React.CSSProperties;
}> = ({ eyebrow, title, align = "center", delay = 0, style }) => {
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

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: align === "center" ? "center" : "flex-start",
        textAlign: align,
        gap: 18,
        fontFamily: sansFont,
        ...style,
      }}
    >
      <div
        style={{
          padding: "12px 24px",
          borderRadius: 999,
          backgroundColor: "#fff",
          border: `1px solid ${COLORS.border}`,
          boxShadow: "0 2px 8px rgba(15, 23, 42, 0.05)",
          opacity: pill,
          transform: `translateY(${(1 - pill) * 16}px)`,
        }}
      >
        <span
          style={{
            fontSize: 26,
            fontWeight: 700,
            color: "#475467",
            letterSpacing: "0.01em",
          }}
        >
          {eyebrow}
        </span>
      </div>
      <div
        style={{
          fontSize: 76,
          fontWeight: 700,
          lineHeight: 1.08,
          letterSpacing: "-0.03em",
          color: COLORS.ink,
          opacity: heading,
          transform: `translateY(${(1 - heading) * 24}px)`,
        }}
      >
        {title}
      </div>
    </div>
  );
};
