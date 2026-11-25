import React from "react";
import { displayFont, monoFont, sansFont } from "../fonts";
import { GlassCard } from "../Glass";
import { Figure, Label } from "../Text";
import { alpha, RADIUS, type Theme } from "../tokens";

/**
 * The split-screen Outcomes card (web StoryPicture outcome card + compact
 * OutcomeMetricBars): strong glass, radius 28, padding 16/14, mono 'Outcomes'
 * label, a 13px muted metric line, then two 24px bars labelled 'Sequence'
 * (ink/30) and 'Trophy' (accent). Fill widths run from the web's 3% floor to
 * their final share as `progress` goes 0→1; the values are passed in as
 * strings so the scene can count them up with countUp.
 */
export const OutcomesCard: React.FC<{
  theme: Theme;
  accent: string;
  s?: number;
  label: string;
  metric: string;
  legacyPct: number;
  trophyPct: number;
  progress: number;
  legacyValue: string;
  trophyValue: string;
  style?: React.CSSProperties;
}> = ({ theme, accent, s = 1, label, metric, legacyPct, trophyPct, progress, legacyValue, trophyValue, style }) => {
  const p = Math.min(1, Math.max(0, progress));
  const widthOf = (pct: number) => `${(3 + (Math.max(3, pct) - 3) * p).toFixed(3)}%`;
  const rows: { name: string; fill: string; width: string; value: string; color: string }[] = [
    { name: "Sequence", fill: alpha(theme.ink, 0.3), width: widthOf(legacyPct), value: legacyValue, color: theme.ink },
    { name: "Trophy", fill: accent, width: widthOf(trophyPct), value: trophyValue, color: accent },
  ];
  return (
    <GlassCard
      theme={theme}
      radius={RADIUS.hero}
      padding={`${14 * s}px ${16 * s}px`}
      style={{ display: "flex", flexDirection: "column", gap: 16 * s, ...style }}
    >
      <Label color={theme.inkMuted} s={s}>
        {label}
      </Label>
      <div>
        <div style={{ fontFamily: sansFont, fontWeight: 400, fontSize: 13 * s, lineHeight: `${18 * s}px`, color: theme.inkMuted, marginBottom: 8 * s }}>
          {metric}
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 8 * s }}>
          {rows.map((r) => (
            <div key={r.name} style={{ display: "flex", alignItems: "center", gap: 12 * s }}>
              <span
                style={{
                  flex: "none",
                  width: 64 * s,
                  fontFamily: monoFont,
                  fontWeight: 400,
                  fontSize: 11 * s,
                  lineHeight: `${16 * s}px`,
                  color: theme.inkMuted,
                  whiteSpace: "nowrap",
                }}
              >
                {r.name}
              </span>
              <div style={{ flex: 1, height: 24 * s, borderRadius: RADIUS.tile, background: alpha(theme.ink, 0.05), overflow: "hidden" }}>
                <div style={{ height: "100%", width: r.width, borderRadius: RADIUS.tile, background: r.fill }} />
              </div>
              <span
                style={{
                  flex: "none",
                  width: 56 * s,
                  textAlign: "right",
                  fontFamily: displayFont,
                  fontWeight: 400,
                  fontSize: 20 * s,
                  lineHeight: `${26 * s}px`,
                  letterSpacing: "-0.02em",
                  fontVariantNumeric: "tabular-nums",
                  color: r.color,
                  whiteSpace: "nowrap",
                }}
              >
                <Figure value={r.value} widthCh={2} size={20 * s} color={r.color} lineHeight={1.3} tracking="-0.02em" />%
              </span>
            </div>
          ))}
        </div>
      </div>
    </GlassCard>
  );
};
