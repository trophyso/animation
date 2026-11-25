import React from "react";
import { RADIUS, type Theme } from "./tokens";

/**
 * Frosted glass card on a sky. Default is the composited glass colour with NO
 * backdrop blur (jitter-safe and cheap); pass blur only when something sits
 * behind the card, and never toggle it mid-scene.
 */
export const GlassCard: React.FC<{
  theme: Theme;
  radius?: number;
  strong?: boolean;
  blur?: boolean;
  edge?: "glass" | "strong" | "none";
  shadow?: boolean;
  padding?: number | string;
  style?: React.CSSProperties;
  children?: React.ReactNode;
}> = ({ theme, radius = RADIUS.card, strong = true, blur = false, edge = "glass", shadow = true, padding, style, children }) => (
  <div
    style={{
      position: "relative",
      boxSizing: "border-box",
      background: strong ? theme.glassStrong : theme.glass,
      border: edge === "none" ? undefined : `1px solid ${edge === "strong" ? theme.borderStrong : theme.glassEdge}`,
      boxShadow: shadow ? theme.shadowGlass : undefined,
      backdropFilter: blur ? "blur(24px)" : undefined,
      WebkitBackdropFilter: blur ? "blur(24px)" : undefined,
      borderRadius: radius,
      padding,
      ...style,
    }}
  >
    {children}
  </div>
);

/** Sunken well inside glass (bg muted), e.g. "What the agent knows" */
export const Well: React.FC<{ theme: Theme; radius?: number; padding?: number | string; style?: React.CSSProperties; children?: React.ReactNode }> = ({
  theme,
  radius = RADIUS.card,
  padding,
  style,
  children,
}) => <div style={{ boxSizing: "border-box", background: theme.muted, borderRadius: radius, padding, ...style }}>{children}</div>;

/** Solid raised tile inside glass (mist-raised with a hairline) */
export const RaisedTile: React.FC<{ theme: Theme; radius?: number; padding?: number | string; style?: React.CSSProperties; children?: React.ReactNode }> = ({
  theme,
  radius = RADIUS.card,
  padding,
  style,
  children,
}) => (
  <div
    style={{ boxSizing: "border-box", background: theme.raised, border: `1px solid ${theme.border}`, borderRadius: radius, padding, ...style }}
  >
    {children}
  </div>
);
