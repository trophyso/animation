import React from "react";
import { monoFont, sansFont } from "../fonts";
import { GlassCard } from "../Glass";
import { Ph } from "../icons";
import { Figure } from "../Text";
import { RADIUS, type Theme } from "../tokens";

/**
 * The web .dl-metric at video scale: figure + unit, the delta pushed to the
 * right on the same baseline, the metric's title, a legend row, then the chart
 * (children). Figure text and delta opacity are passed in per frame; the
 * figure sits in a fixed-width box so counting never shifts the layout.
 */
export const MetricCard: React.FC<{
  theme: Theme;
  figureText: string;
  /** Box width in ch; the figure's widest string must fit (4.2ch holds "+14.2" at Funnel Display 64) */
  figureWidthCh?: number;
  unit: string;
  delta: string;
  deltaOpacity?: number;
  title: string;
  legend?: readonly { name: string; color: string }[];
  width: number;
  style?: React.CSSProperties;
  children?: React.ReactNode;
}> = ({ theme, figureText, figureWidthCh = 4.2, unit, delta, deltaOpacity = 1, title, legend, width, style, children }) => (
  <GlassCard theme={theme} strong radius={RADIUS.card} padding="28px 32px 24px" style={{ width, ...style }}>
    <div style={{ display: "flex", alignItems: "baseline", gap: 6 }}>
      <Figure value={figureText} widthCh={figureWidthCh} size={64} color={theme.ink} lineHeight={1} tracking="-0.04em" align="left" />
      <span style={{ fontFamily: sansFont, fontWeight: 400, fontSize: 22, lineHeight: 1, color: theme.inkMuted }}>{unit}</span>
      <span style={{ flex: 1 }} />
      <span
        style={{
          display: "inline-flex",
          alignItems: "baseline",
          gap: 5,
          fontFamily: monoFont,
          fontWeight: 400,
          fontSize: 16,
          lineHeight: 1,
          color: theme.positive,
          opacity: deltaOpacity,
        }}
      >
        <Ph name="TrendUp" size={18} color={theme.positive} />
        {delta}
      </span>
    </div>
    <div style={{ marginTop: 6, fontFamily: sansFont, fontWeight: 400, fontSize: 18, lineHeight: "24px", color: theme.inkMuted }}>{title}</div>
    {legend ? (
      <div style={{ display: "flex", alignItems: "center", gap: 16, marginTop: 20, fontFamily: sansFont, fontSize: 14, lineHeight: "20px", color: theme.inkMuted }}>
        {legend.map((l) => (
          <span key={l.name} style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
            <i style={{ display: "inline-block", width: 12, height: 2, background: l.color, borderRadius: 1 }} />
            {l.name}
          </span>
        ))}
      </div>
    ) : null}
    {children ? <div style={{ marginTop: 16 }}>{children}</div> : null}
  </GlassCard>
);
