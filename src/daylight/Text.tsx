import React from "react";
import { displayFont, monoFont, sansFont } from "./fonts";
import { alpha, type Theme } from "./tokens";

/** Renders ==marked== words in the accent (web Marked / .dl-w-marks) */
export const Marked: React.FC<{ text: string; accent: string; markWeight?: number }> = ({ text, accent, markWeight }) => {
  const parts = text.split(/(==[^=]+==)/g);
  return (
    <>
      {parts.map((part, i) =>
        part.indexOf("==") === 0 ? (
          <span key={i} style={{ color: accent, fontWeight: markWeight }}>
            {part.slice(2, -2)}
          </span>
        ) : (
          <React.Fragment key={i}>{part}</React.Fragment>
        ),
      )}
    </>
  );
};

/** Funnel Display 400 headline; ==marks== take the sky's accent. Wrap in a motion style from motion.ts. */
export const Headline: React.FC<{
  text: string;
  accent: string;
  color: string;
  size?: number;
  lineHeight?: number;
  maxWidth?: number;
  tracking?: string;
  align?: "left" | "center";
  style?: React.CSSProperties;
}> = ({ text, accent, color, size = 88, lineHeight = 1.04, maxWidth, tracking = "-0.045em", align = "left", style }) => (
  <div
    style={{
      fontFamily: displayFont,
      fontWeight: 400,
      fontSize: size,
      lineHeight,
      letterSpacing: tracking,
      color,
      maxWidth,
      textAlign: align,
      textWrap: "balance",
      ...style,
    }}
  >
    <Marked text={text} accent={accent} />
  </div>
);

/** Funnel Sans 400 lead / support line */
export const Support: React.FC<{
  text: string;
  color: string;
  accent?: string;
  size?: number;
  lineHeight?: number;
  maxWidth?: number;
  align?: "left" | "center";
  style?: React.CSSProperties;
}> = ({ text, color, accent = color, size = 28, lineHeight = 1.3, maxWidth, align = "left", style }) => (
  <div style={{ fontFamily: sansFont, fontWeight: 400, fontSize: size, lineHeight, color, maxWidth, textAlign: align, ...style }}>
    <Marked text={text} accent={accent} />
  </div>
);

/** .dl-label: mono 12/16, sentence case, muted (scaled by s) */
export const Label: React.FC<{ children: React.ReactNode; color: string; s?: number; style?: React.CSSProperties }> = ({
  children,
  color,
  s = 1,
  style,
}) => (
  <span
    style={{
      fontFamily: monoFont,
      fontWeight: 400,
      fontSize: 12 * s,
      lineHeight: `${16 * s}px`,
      fontVariantNumeric: "tabular-nums",
      color,
      ...style,
    }}
  >
    {children}
  </span>
);

/** The sun dot: glow with a 3px ring at glow/0.35 */
export const Sun: React.FC<{ size?: number; glow: string; style?: React.CSSProperties }> = ({ size = 8, glow, style }) => (
  <span
    style={{
      display: "inline-block",
      width: size,
      height: size,
      borderRadius: "50%",
      background: glow,
      boxShadow: `0 0 0 ${Math.round(size * 0.375)}px ${alpha(glow, 0.35)}`,
      flex: "none",
      ...style,
    }}
  />
);

/** Mono uppercase kicker with the sun dot, labelling the sky with its hour */
export const Kicker: React.FC<{ hour: string; theme: Theme; size?: number; style?: React.CSSProperties }> = ({
  hour,
  theme,
  size = 18,
  style,
}) => (
  <div
    style={{
      display: "flex",
      alignItems: "center",
      gap: Math.round(size * 0.66),
      fontFamily: monoFont,
      fontWeight: 500,
      fontSize: size,
      lineHeight: `${Math.round(size * 1.33)}px`,
      letterSpacing: "0.06em",
      textTransform: "uppercase",
      color: theme.skyInkMuted,
      whiteSpace: "nowrap",
      ...style,
    }}
  >
    <Sun size={Math.round(size * 0.6)} glow={theme.glow} />
    {hour}
  </div>
);

/**
 * A number in a fixed-width, right-aligned box so a count-up never changes
 * layout (Funnel Display tabular support is unverified; the box is the guarantee).
 */
export const Figure: React.FC<{
  value: string;
  widthCh: number;
  size: number;
  color: string;
  lineHeight?: number;
  tracking?: string;
  family?: "display" | "mono" | "sans";
  weight?: number;
  align?: "left" | "right";
  style?: React.CSSProperties;
}> = ({ value, widthCh, size, color, lineHeight = 1, tracking = "-0.04em", family = "display", weight = 400, align = "right", style }) => (
  <span
    style={{
      display: "inline-block",
      minWidth: `${widthCh}ch`,
      textAlign: align,
      fontFamily: family === "display" ? displayFont : family === "mono" ? monoFont : sansFont,
      fontWeight: weight,
      fontSize: size,
      lineHeight,
      letterSpacing: tracking,
      fontVariantNumeric: "tabular-nums",
      color,
      whiteSpace: "nowrap",
      ...style,
    }}
  >
    {value}
  </span>
);
