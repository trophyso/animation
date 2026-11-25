import React from "react";
import { Avatar } from "../Avatar";
import { monoFont, sansFont } from "../fonts";
import { GlassCard } from "../Glass";
import { Ph } from "../icons";
import { Label, Sun } from "../Text";
import { SegControl } from "../SegControl";
import { alpha, RADIUS, type Theme } from "../tokens";

export type LeaderboardRow = { rank: number; name: string; initial: string; sub: string; score: string; move: string; you: boolean };

const Move: React.FC<{ move: string; theme: Theme; s: number }> = ({ move, theme, s }) => {
  const up = move.startsWith("+");
  const down = move.startsWith("−") || move.startsWith("-");
  const color = up ? theme.positive : down ? theme.negative : theme.inkSubtle;
  return (
    <span
      style={{
        position: "relative",
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "flex-end",
        gap: 2 * s,
        fontFamily: monoFont,
        fontSize: 12 * s,
        lineHeight: `${16 * s}px`,
        fontVariantNumeric: "tabular-nums",
        color,
        whiteSpace: "nowrap",
      }}
    >
      {up ? <Ph name="CaretUp" size={12 * s} weight="bold" /> : down ? <Ph name="CaretDown" size={12 * s} weight="bold" /> : null}
      {up || down ? move.slice(1) : move}
    </span>
  );
};

/**
 * Leaderboard widget: segmented control + period label over five ranked rows.
 * `rowEnter` holds one eased 0→1 per row (fade + rise); `youWash` fades the You
 * row's accent wash and ring in; `sunOpacity` the glow dot on the You row.
 */
export const LeaderboardCard: React.FC<{
  tabs: readonly string[];
  active: number;
  period: string;
  rows: readonly LeaderboardRow[];
  rowEnter: readonly number[];
  youWash: number;
  theme: Theme;
  accent: string;
  accentMuted: string;
  s?: number;
  sunOpacity?: number;
  style?: React.CSSProperties;
}> = ({ tabs, active, period, rows, rowEnter, youWash, theme, accent, accentMuted, s = 1, sunOpacity = 0, style }) => (
  <GlassCard theme={theme} radius={RADIUS.widget} padding={`${22 * s}px ${24 * s}px`} style={{ display: "flex", flexDirection: "column", gap: 14 * s, ...style }}>
    <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start", gap: 8 * s }}>
      <SegControl options={[...tabs]} active={active} theme={theme} s={s} optionWidth={92} />
      <Label color={theme.inkSubtle} s={s}>
        {period}
      </Label>
    </div>
    <div style={{ display: "flex", flexDirection: "column", gap: 2 * s, marginInline: -10 * s }}>
      {rows.map((row, i) => {
        const p = rowEnter[i] ?? 1;
        const wash = row.you ? youWash : 0;
        return (
          <div
            key={row.rank}
            style={{
              position: "relative",
              display: "grid",
              gridTemplateColumns: `${22 * s}px ${36 * s}px minmax(0, 1fr) auto ${44 * s}px`,
              gap: 12 * s,
              alignItems: "center",
              height: 44 * s,
              padding: `0 ${10 * s}px`,
              borderRadius: RADIUS.well * s,
              boxSizing: "border-box",
              opacity: p,
              translate: `0px ${((1 - p) * 12 * s).toFixed(3)}px`,
            }}
          >
            {row.you ? (
              <>
                <div
                  style={{
                    position: "absolute",
                    inset: 0,
                    borderRadius: RADIUS.well * s,
                    background: accentMuted,
                    boxShadow: `0 0 0 1px ${alpha(accent, 0.35)}`,
                    opacity: wash,
                  }}
                />
                <Sun size={8} glow={theme.glow} style={{ position: "absolute", left: -4, top: "50%", translate: "0px -4px", opacity: sunOpacity }} />
              </>
            ) : null}
            <span
              style={{
                position: "relative",
                fontFamily: monoFont,
                fontSize: 13 * s,
                lineHeight: `${16 * s}px`,
                fontVariantNumeric: "tabular-nums",
                color: theme.inkSubtle,
                textAlign: "right",
              }}
            >
              {row.rank}
            </span>
            <Avatar initials={row.initial} theme={theme} s={s} inverted={row.you} style={{ position: "relative" }} />
            <div style={{ position: "relative", minWidth: 0 }}>
              <div style={{ fontFamily: sansFont, fontWeight: 600, fontSize: 15 * s, lineHeight: `${20 * s}px`, color: theme.ink, whiteSpace: "nowrap" }}>
                {row.name}
              </div>
              <div
                style={{
                  fontFamily: monoFont,
                  fontSize: 11 * s,
                  lineHeight: `${14 * s}px`,
                  fontVariantNumeric: "tabular-nums",
                  color: theme.inkSubtle,
                  whiteSpace: "nowrap",
                }}
              >
                {row.sub}
              </div>
            </div>
            <span
              style={{
                position: "relative",
                fontFamily: monoFont,
                fontSize: 14 * s,
                lineHeight: `${18 * s}px`,
                fontVariantNumeric: "tabular-nums",
                color: theme.ink,
                whiteSpace: "nowrap",
              }}
            >
              {row.score}
            </span>
            <Move move={row.move} theme={theme} s={s} />
          </div>
        );
      })}
    </div>
  </GlassCard>
);
