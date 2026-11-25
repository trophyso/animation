import React from "react";
import { sansFont } from "./fonts";
import { type Theme } from "./tokens";

/** The primary button: an ink pill with shadow-pill. Never the accent. */
export const InkPill: React.FC<{ children: React.ReactNode; theme: Theme; height?: number; fontSize?: number; style?: React.CSSProperties }> = ({
  children,
  theme,
  height = 60,
  fontSize = 22,
  style,
}) => (
  <span
    style={{
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      height,
      padding: `0 ${Math.round(height * 0.5)}px`,
      borderRadius: 9999,
      background: theme.ink,
      color: theme.bg,
      fontFamily: sansFont,
      fontWeight: 500,
      fontSize,
      boxShadow: theme.shadowPill,
      whiteSpace: "nowrap",
      ...style,
    }}
  >
    {children}
  </span>
);
