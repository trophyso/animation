import React from "react";
import { Ph, type IconName, type IconWeight } from "./icons";
import { monoFont } from "./fonts";
import { alpha, type Theme } from "./tokens";

/** .dl-chip: 28px mono pill, glass-strong (or solid raised with a hairline) */
export const Chip: React.FC<{
  theme: Theme;
  s?: number;
  solid?: boolean;
  icon?: IconName | "Points";
  iconWeight?: IconWeight;
  color?: string;
  style?: React.CSSProperties;
  children?: React.ReactNode;
}> = ({ theme, s = 1, solid = false, icon, iconWeight, color, style, children }) => (
  <span
    style={{
      display: "inline-flex",
      alignItems: "center",
      gap: 8 * s,
      height: 28 * s,
      padding: `0 ${12 * s}px`,
      borderRadius: 9999,
      background: solid ? theme.raised : theme.glassStrong,
      border: `1px solid ${solid ? theme.border : theme.glassEdge}`,
      fontFamily: monoFont,
      fontWeight: 400,
      fontSize: 12 * s,
      lineHeight: `${16 * s}px`,
      fontVariantNumeric: "tabular-nums",
      color: color ?? theme.ink,
      whiteSpace: "nowrap",
      boxSizing: "border-box",
      ...style,
    }}
  >
    {icon ? <Ph name={icon} size={14 * s} weight={iconWeight} /> : null}
    {children}
  </span>
);

/**
 * The decision chip on a story card: 'sent' = solid ink pill (Trophy sent),
 * 'legacy' = ink/10 pill (the sequence sent), 'restraint' = hollow ring (Nothing sent).
 */
export const DecisionChip: React.FC<{
  theme: Theme;
  kind: "sent" | "legacy" | "restraint";
  s?: number;
  style?: React.CSSProperties;
  children?: React.ReactNode;
}> = ({ theme, kind, s = 1, style, children }) => {
  const base: React.CSSProperties = {
    display: "inline-flex",
    alignItems: "center",
    padding: `${2 * s}px ${10 * s}px`,
    borderRadius: 9999,
    fontFamily: monoFont,
    fontSize: 11 * s,
    lineHeight: `${16 * s}px`,
    whiteSpace: "nowrap",
    boxSizing: "border-box",
  };
  const kinds: Record<typeof kind, React.CSSProperties> = {
    sent: { background: theme.ink, color: theme.bg },
    legacy: { background: alpha(theme.ink, 0.1), color: theme.ink },
    restraint: { color: theme.inkMuted, boxShadow: `inset 0 0 0 1px ${alpha(theme.ink, 0.25)}` },
  };
  return <span style={{ ...base, ...kinds[kind], ...style }}>{children}</span>;
};
