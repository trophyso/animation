import React from "react";
import { AppIcon, type AppName } from "../AppIcon";
import { monoFont, sansFont } from "../fonts";
import { GlassCard, RaisedTile } from "../Glass";
import { Ph } from "../icons";
import { Label, Marked } from "../Text";
import { alpha, RADIUS, type Theme } from "../tokens";

const Why: React.FC<{ why: string; theme: Theme; s: number; opacity: number }> = ({ why, theme, s, opacity }) => (
  <div
    style={{
      display: "inline-flex",
      alignItems: "center",
      gap: 6 * s,
      marginTop: 8 * s,
      fontFamily: monoFont,
      fontSize: 11 * s,
      lineHeight: `${14 * s}px`,
      color: theme.inkMuted,
      opacity,
    }}
  >
    <Ph name="Sparkle" size={14 * s} />
    {why}
  </div>
);

/**
 * A push notification as it lands. 'glass' = the .dl-push glass card (radius
 * 20, 40px icon, optional why line); 'daylight' = the flat raised tile inside
 * the agent card. `legacyEdge` swaps the glass edge for ink/15 (sequence side).
 */
export const PushTile: React.FC<{
  variant: "glass" | "daylight";
  app: AppName;
  time: string;
  title: string;
  body: string;
  why?: string;
  theme: Theme;
  accent: string;
  s?: number;
  legacyEdge?: boolean;
  isNew?: boolean;
  blur?: boolean;
  whyOpacity?: number;
  style?: React.CSSProperties;
}> = ({ variant, app, time, title, body, why, theme, accent, s = 1, legacyEdge = false, isNew = false, blur = false, whyOpacity = 1, style }) => {
  if (variant === "daylight") {
    return (
      <RaisedTile theme={theme} radius={RADIUS.card} padding={14 * s} style={{ display: "flex", gap: 12 * s, alignItems: "flex-start", ...style }}>
        <AppIcon app={app} size={36 * s} />
        <div style={{ minWidth: 0, flex: 1 }}>
          <div style={{ display: "flex", justifyContent: "space-between", gap: 8 * s }}>
            <Label color={theme.inkMuted} s={s}>
              {app}
            </Label>
            <Label color={theme.inkMuted} s={s}>
              {time}
            </Label>
          </div>
          <div style={{ marginTop: 2 * s, fontFamily: sansFont, fontWeight: 600, fontSize: 14 * s, lineHeight: `${20 * s}px`, color: theme.ink }}>
            <Marked text={title} accent={accent} />
          </div>
          <div style={{ fontFamily: sansFont, fontSize: 13 * s, lineHeight: `${18 * s}px`, color: theme.inkMuted }}>{body}</div>
          {why ? <Why why={why} theme={theme} s={s} opacity={whyOpacity} /> : null}
        </div>
      </RaisedTile>
    );
  }
  return (
    <GlassCard
      theme={theme}
      radius={RADIUS.widget}
      blur={blur}
      edge={legacyEdge ? "none" : "glass"}
      padding={`${14 * s}px ${16 * s}px`}
      style={{
        display: "grid",
        gridTemplateColumns: `${40 * s}px minmax(0, 1fr)`,
        gap: 12 * s,
        border: legacyEdge ? `1px solid ${alpha(theme.ink, 0.15)}` : undefined,
        boxShadow: isNew ? `${theme.shadowGlass}, 0 0 0 1px ${theme.border}` : theme.shadowGlass,
        color: theme.ink,
        ...style,
      }}
    >
      <AppIcon app={app} size={40 * s} />
      <div style={{ minWidth: 0 }}>
        <div style={{ display: "flex", justifyContent: "space-between", gap: 8 * s, alignItems: "baseline" }}>
          <span style={{ fontFamily: sansFont, fontWeight: 500, fontSize: 13 * s, lineHeight: `${18 * s}px`, color: theme.inkMuted }}>{app}</span>
          <Label color={theme.inkMuted} s={s}>
            {time}
          </Label>
        </div>
        <div style={{ fontFamily: sansFont, fontWeight: 600, fontSize: 15 * s, lineHeight: `${20 * s}px` }}>
          <Marked text={title} accent={accent} />
        </div>
        <div style={{ fontFamily: sansFont, fontSize: 14 * s, lineHeight: `${20 * s}px` }}>{body}</div>
        {why ? <Why why={why} theme={theme} s={s} opacity={whyOpacity} /> : null}
      </div>
    </GlassCard>
  );
};
