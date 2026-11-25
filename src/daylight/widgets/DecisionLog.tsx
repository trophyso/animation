import React from "react";
import { Chip } from "../Chip";
import { sansFont } from "../fonts";
import { GlassCard } from "../Glass";
import { Ph, type IconName } from "../icons";
import { Figure, Label } from "../Text";
import { alpha, RADIUS, type Theme } from "../tokens";
import { formatNumber } from "../motion";

export type DecisionChannel = "push" | "email" | "none";

export type DecisionOption = {
  label: string;
  /** p(objective) */
  p: number;
  channel: DecisionChannel;
  chosen: boolean;
};

const CHANNEL_ICON: Record<DecisionChannel, IconName> = {
  push: "BellSimple",
  email: "EnvelopeSimple",
  none: "Prohibit",
};

/** Web anatomy at 1x (DecisionLog.tsx): grid 20 | 1fr | 88 | 36, gap 12, radius 10, padding 6/10 */
const ROW = { icon: 20, track: 88, score: 36, gap: 12, radius: 10, py: 6, px: 10, text: 14, line: 20, iconSize: 18, bar: 6 };

/**
 * One row of the decision log, drawn as up to three stacked grids with identical
 * columns so every layer lines up: the base (muted) row, a chosen overlay that
 * crossfades in (wash + accent recolour, no colour tweening), and the dashed
 * "do nothing" line on top of both.
 */
const OptionRow: React.FC<{
  option: DecisionOption;
  base: number;
  theme: Theme;
  accent: string;
  accentMuted: string;
  s: number;
  opacity: number;
  rise: number;
  barProgress: number;
  dashOpacity: number;
  chosenOpacity: number;
}> = ({ option, base, theme, accent, accentMuted, s, opacity, rise, barProgress, dashOpacity, chosenOpacity }) => {
  const grid: React.CSSProperties = {
    display: "grid",
    gridTemplateColumns: `${ROW.icon * s}px minmax(0, 1fr) ${ROW.track * s}px ${ROW.score * s}px`,
    alignItems: "center",
    columnGap: ROW.gap * s,
    borderRadius: ROW.radius * s,
    padding: `${ROW.py * s}px ${ROW.px * s}px`,
    boxSizing: "border-box",
    fontFamily: sansFont,
    fontSize: ROW.text * s,
    lineHeight: `${ROW.line * s}px`,
  };
  const overlayGrid: React.CSSProperties = { ...grid, position: "absolute", inset: 0 };
  const shown = option.p * barProgress;
  const fillWidth = `${(shown * 100).toFixed(3)}%`;
  const track: React.CSSProperties = { position: "relative", height: ROW.bar * s, borderRadius: 9999 };
  const fill = (color: string): React.CSSProperties => ({
    position: "absolute",
    top: 0,
    bottom: 0,
    left: 0,
    width: fillWidth,
    borderRadius: 9999,
    background: color,
  });
  const score = (color: string) => (
    <Figure
      value={formatNumber(shown, 2)}
      widthCh={4}
      size={13 * s}
      color={color}
      family="mono"
      tracking="0"
      lineHeight={ROW.line / 13}
      style={{ justifySelf: "end" }}
    />
  );
  const name = (weight: number, color: string) => (
    <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", fontWeight: weight, color }}>{option.label}</span>
  );

  return (
    <li style={{ position: "relative", listStyle: "none", opacity, translate: `0px ${rise.toFixed(3)}px` }}>
      {/* Base: every option scored in muted ink */}
      <div style={grid}>
        <Ph name={CHANNEL_ICON[option.channel]} size={ROW.iconSize * s} color={theme.inkMuted} />
        {name(400, theme.ink)}
        <span style={{ ...track, background: alpha(theme.ink, 0.1) }}>
          <span style={fill(alpha(theme.ink, 0.4))} />
        </span>
        {score(theme.inkMuted)}
      </div>

      {/* Chosen overlay: the wash and the accent, crossfaded over the base */}
      {option.chosen ? (
        <div style={{ ...overlayGrid, background: accentMuted, opacity: chosenOpacity }}>
          <Ph name={CHANNEL_ICON[option.channel]} size={ROW.iconSize * s} color={accent} />
          {name(500, theme.ink)}
          <span style={track}>
            <span style={fill(accent)} />
          </span>
          {score(accent)}
        </div>
      ) : null}

      {/* Doing nothing: the line every option has to beat (6px above and below the bar) */}
      <div style={{ ...overlayGrid, opacity: dashOpacity, pointerEvents: "none" }}>
        <span />
        <span />
        <span style={track}>
          <span
            style={{
              position: "absolute",
              top: -ROW.bar * s,
              bottom: -ROW.bar * s,
              left: `${(base * 100).toFixed(3)}%`,
              borderLeft: `1px dashed ${alpha(theme.ink, 0.45)}`,
            }}
          />
        </span>
        <span />
      </div>
    </li>
  );
};

/**
 * The agent's decision log for one user: every option scored as p(objective)
 * against a dashed "do nothing" line, the pick in the accent with its lift.
 * Pure: the scene computes every progress value from the frame.
 */
export const DecisionLog: React.FC<{
  theme: Theme;
  accent: string;
  accentMuted: string;
  /** px multiplier (web is 460px wide at 1x) */
  s?: number;
  user: string;
  objective: string;
  options: readonly DecisionOption[];
  footer: string;
  /** The counting lift figure, e.g. "+0.30" */
  lift: string;
  /** Text after the lift figure, e.g. "over doing nothing" */
  liftSuffix: string;
  headerOpacity?: number;
  /** One per option */
  rowOpacities?: readonly number[];
  /** One per option, px of rise still to travel */
  rowRises?: readonly number[];
  /** 0..1: bars grow to p and scores count up together */
  barProgress?: number;
  dashOpacity?: number;
  chosenOpacity?: number;
  footerOpacity?: number;
  style?: React.CSSProperties;
}> = ({
  theme,
  accent,
  accentMuted,
  s = 1,
  user,
  objective,
  options,
  footer,
  lift,
  liftSuffix,
  headerOpacity = 1,
  rowOpacities,
  rowRises,
  barProgress = 1,
  dashOpacity = 1,
  chosenOpacity = 1,
  footerOpacity = 1,
  style,
}) => {
  const base = options.find((o) => o.channel === "none")?.p ?? 0;
  return (
    <GlassCard
      theme={theme}
      radius={RADIUS.widget}
      strong
      blur={false}
      padding={`${24 * s}px ${20 * s}px ${20 * s}px`}
      style={{ width: 460 * s, display: "flex", flexDirection: "column", gap: 12 * s, color: theme.ink, ...style }}
    >
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8 * s, opacity: headerOpacity }}>
        <Label color={theme.ink} s={s}>
          {user}
        </Label>
        <Chip theme={theme} s={s} solid>
          {objective}
        </Chip>
      </div>

      <ul style={{ display: "flex", flexDirection: "column", gap: 4 * s, margin: 0, padding: 0 }}>
        {options.map((o, i) => (
          <OptionRow
            key={o.label}
            option={o}
            base={base}
            theme={theme}
            accent={accent}
            accentMuted={accentMuted}
            s={s}
            opacity={rowOpacities?.[i] ?? 1}
            rise={rowRises?.[i] ?? 0}
            barProgress={barProgress}
            dashOpacity={dashOpacity}
            chosenOpacity={o.chosen ? chosenOpacity : 0}
          />
        ))}
      </ul>

      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 8 * s,
          borderTop: `1px solid ${alpha(theme.ink, 0.1)}`,
          paddingTop: 12 * s,
          opacity: footerOpacity,
        }}
      >
        <Label color={theme.inkMuted} s={s}>
          {footer}
        </Label>
        <Label color={accent} s={s} style={{ display: "inline-flex", alignItems: "baseline", whiteSpace: "nowrap" }}>
          <Figure value={lift} widthCh={5} size={12 * s} color={accent} family="mono" tracking="0" lineHeight={16 / 12} />
          {" "}
          {liftSuffix}
        </Label>
      </div>
    </GlassCard>
  );
};
