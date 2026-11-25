import React from "react";
import { Avatar } from "../Avatar";
import { Chip, DecisionChip } from "../Chip";
import { monoFont, sansFont } from "../fonts";
import { GlassCard } from "../Glass";
import { Ph } from "../icons";
import { alpha, RADIUS, type Theme } from "../tokens";

/**
 * The sequence tool's story card (web HeroStory LEGACY_CARD): glass-strong,
 * radius 28, greyscale and 75% opacity over everything in it. Pass `opacity`
 * to animate its entrance (0 → 0.75); the greyscale is constant from frame one.
 */
export const LegacyCard: React.FC<{
  theme: Theme;
  s?: number;
  width: number;
  title: string;
  decision: string;
  opacity?: number;
  style?: React.CSSProperties;
  children?: React.ReactNode;
}> = ({ theme, s = 1, width, title, decision, opacity = 0.75, style, children }) => (
  <GlassCard
    theme={theme}
    radius={RADIUS.hero}
    padding={`${20 * s}px ${56 * s}px ${20 * s}px ${20 * s}px`}
    style={{ width, opacity, filter: "grayscale(1)", display: "flex", flexDirection: "column", gap: 12 * s, ...style }}
  >
    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12 * s }}>
      <Chip theme={theme} s={s} icon="FlowArrow">
        Sequence-based CEP
      </Chip>
      <DecisionChip theme={theme} kind="legacy" s={s}>
        {decision}
      </DecisionChip>
    </div>
    <div style={{ fontFamily: sansFont, fontWeight: 600, fontSize: 15 * s, lineHeight: `${20 * s}px`, color: theme.ink }}>{title}</div>
    {children}
  </GlassCard>
);

/**
 * The agent's story card (web TROPHY_CARD): full colour, 1px line-strong edge,
 * radius 28, drawn above the legacy card. `decision` renders a DecisionChip.
 */
export const TrophySideCard: React.FC<{
  theme: Theme;
  s?: number;
  width: number;
  title: string;
  decision?: { kind: "sent" | "restraint"; label: string; opacity?: number };
  style?: React.CSSProperties;
  children?: React.ReactNode;
}> = ({ theme, s = 1, width, title, decision, style, children }) => (
  <GlassCard
    theme={theme}
    radius={RADIUS.hero}
    edge="strong"
    padding={20 * s}
    style={{ width, display: "flex", flexDirection: "column", gap: 12 * s, ...style }}
  >
    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12 * s, minHeight: 28 * s }}>
      <Chip theme={theme} s={s} icon="Path">
        Trophy agent
      </Chip>
      {decision ? (
        <DecisionChip theme={theme} kind={decision.kind} s={s} style={{ opacity: decision.opacity ?? 1 }}>
          {decision.label}
        </DecisionChip>
      ) : null}
    </div>
    <div style={{ fontFamily: sansFont, fontWeight: 600, fontSize: 15 * s, lineHeight: `${20 * s}px`, color: theme.ink }}>{title}</div>
    {children}
  </GlassCard>
);

export type CheckState = "ok" | "changed" | "flag";

/** Raised list of what a side read: Check (positive), ArrowsClockwise (accent), Warning (caution) */
export const ChecksList: React.FC<{
  rows: { label: string; state: CheckState; opacity?: number }[];
  theme: Theme;
  accent: string;
  s?: number;
  style?: React.CSSProperties;
}> = ({ rows, theme, accent, s = 1, style }) => (
  <div style={{ background: theme.raised, border: `1px solid ${theme.border}`, borderRadius: RADIUS.card, overflow: "hidden", ...style }}>
    {rows.map((r, i) => {
      const icon = r.state === "ok" ? "Check" : r.state === "changed" ? "ArrowsClockwise" : "Warning";
      const color = r.state === "ok" ? theme.positive : r.state === "changed" ? accent : theme.caution;
      return (
        <div
          key={r.label}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10 * s,
            padding: `${8 * s}px ${14 * s}px`,
            borderTop: i === 0 ? undefined : `1px solid ${alpha(theme.ink, 0.1)}`,
            fontFamily: sansFont,
            fontSize: 13 * s,
            lineHeight: `${18 * s}px`,
            color: theme.ink,
            opacity: r.opacity ?? 1,
          }}
        >
          <span
            style={{
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              width: 24 * s,
              height: 24 * s,
              borderRadius: "50%",
              background: alpha(theme.ink, 0.05),
              flex: "none",
            }}
          >
            <Ph name={icon} size={14 * s} color={color} weight={r.state === "ok" ? "bold" : "regular"} />
          </span>
          {r.label}
        </div>
      );
    })}
  </div>
);

/** A week of sends piling up, by day: columns of wells with pills and mono source tags */
export const WeekPile: React.FC<{
  days: string[];
  sends: { day: string; label: string; from?: string; opacity?: number; dy?: number }[];
  theme: Theme;
  s?: number;
  style?: React.CSSProperties;
}> = ({ days, sends, theme, s = 1, style }) => (
  <div style={{ display: "grid", gridTemplateColumns: `repeat(${days.length}, minmax(0, 1fr))`, gap: 6 * s, ...style }}>
    {days.map((d) => (
      <div key={d} style={{ display: "flex", flexDirection: "column", gap: 6 * s }}>
        <span style={{ fontFamily: monoFont, fontSize: 11 * s, lineHeight: `${14 * s}px`, color: theme.inkMuted, textAlign: "center" }}>{d}</span>
        <div
          style={{
            minHeight: 112 * s,
            borderRadius: RADIUS.card,
            background: alpha(theme.ink, 0.05),
            padding: 4 * s,
            display: "flex",
            flexDirection: "column",
            gap: 4 * s,
          }}
        >
          {sends
            .filter((x) => x.day === d)
            .map((x) => (
              <div
                key={x.label}
                style={{
                  borderRadius: RADIUS.tile,
                  background: alpha(theme.ink, 0.15),
                  padding: `${4 * s}px ${6 * s}px`,
                  fontFamily: sansFont,
                  fontSize: 11 * s,
                  lineHeight: `${14 * s}px`,
                  color: theme.ink,
                  opacity: x.opacity ?? 1,
                  translate: `0px ${(x.dy ?? 0).toFixed(3)}px`,
                }}
              >
                {x.label}
                {x.from ? (
                  <div style={{ fontFamily: monoFont, fontSize: 10 * s, lineHeight: `${13 * s}px`, color: theme.inkMuted, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{x.from}</div>
                ) : null}
              </div>
            ))}
        </div>
      </div>
    ))}
  </div>
);

/** Head row used by the agent card and run rows: avatar, name, context */
export const PersonHead: React.FC<{ initials: string; name: string; context: string; theme: Theme; s?: number; style?: React.CSSProperties }> = ({
  initials,
  name,
  context,
  theme,
  s = 1,
  style,
}) => (
  <div style={{ display: "flex", alignItems: "center", gap: 12 * s, minWidth: 0, ...style }}>
    <Avatar initials={initials} theme={theme} s={s} font="sans" />
    <div style={{ minWidth: 0 }}>
      <div style={{ fontFamily: sansFont, fontWeight: 600, fontSize: 15 * s, lineHeight: `${20 * s}px`, color: theme.ink, whiteSpace: "nowrap" }}>{name}</div>
      <div style={{ fontFamily: sansFont, fontSize: 13 * s, lineHeight: `${18 * s}px`, color: theme.inkMuted, whiteSpace: "nowrap" }}>{context}</div>
    </div>
  </div>
);
