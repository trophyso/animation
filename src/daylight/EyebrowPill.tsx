import React from "react";
import { Ph } from "./icons";
import { monoFont, sansFont } from "./fonts";
import { alpha, type Theme } from "./tokens";

/** The homepage "New" badge: Sparkle + mono "New" on primary-muted */
export const NewBadge: React.FC<{ accent: string; accentMuted: string; s?: number }> = ({ accent, accentMuted, s = 1 }) => (
  <span
    style={{
      display: "inline-flex",
      alignItems: "center",
      gap: 6 * s,
      height: 30 * s,
      padding: `0 ${12 * s}px`,
      borderRadius: 9999,
      background: accentMuted,
      border: `1px solid ${alpha(accent, 0.1)}`,
      color: accent,
      fontFamily: monoFont,
      fontSize: 14 * s,
      whiteSpace: "nowrap",
    }}
  >
    <Ph name="Sparkle" size={14 * s} color={accent} />
    New
  </span>
);

/** The launch eyebrow: a glass pill holding the New badge and the introducing line */
export const EyebrowPill: React.FC<{ text: string; theme: Theme; accent: string; accentMuted: string; s?: number; style?: React.CSSProperties }> = ({
  text,
  theme,
  accent,
  accentMuted,
  s = 1,
  style,
}) => (
  <span
    style={{
      display: "inline-flex",
      alignItems: "center",
      gap: 12 * s,
      height: 52 * s,
      padding: `0 ${22 * s}px 0 ${11 * s}px`,
      borderRadius: 9999,
      background: theme.glass,
      border: `1px solid ${theme.glassEdge}`,
      boxShadow: theme.shadowGlass,
      fontFamily: sansFont,
      fontWeight: 400,
      fontSize: 22 * s,
      color: theme.inkMuted,
      whiteSpace: "nowrap",
      boxSizing: "border-box",
      ...style,
    }}
  >
    <NewBadge accent={accent} accentMuted={accentMuted} s={s} />
    {text}
  </span>
);
