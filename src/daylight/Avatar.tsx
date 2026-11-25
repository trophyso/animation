import React from "react";
import { displayFont, sansFont } from "./fonts";
import { type Theme } from "./tokens";

/** Initials tile: 36px circle on muted; `inverted` = the You row (ink with mist text) */
export const Avatar: React.FC<{
  initials: string;
  theme: Theme;
  s?: number;
  inverted?: boolean;
  font?: "display" | "sans";
  style?: React.CSSProperties;
}> = ({ initials, theme, s = 1, inverted = false, font = "display", style }) => (
  <span
    style={{
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      width: 36 * s,
      height: 36 * s,
      borderRadius: "50%",
      background: inverted ? theme.ink : theme.muted,
      color: inverted ? theme.raised : theme.ink,
      fontFamily: font === "display" ? displayFont : sansFont,
      fontWeight: font === "display" ? 500 : 600,
      fontSize: (font === "display" ? 15 : 13) * s,
      flex: "none",
      ...style,
    }}
  >
    {initials}
  </span>
);
