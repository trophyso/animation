import React from "react";
import { Chip } from "../Chip";
import { sansFont } from "../fonts";
import { GlassCard, Well } from "../Glass";
import { Ph, type IconName } from "../icons";
import { Label } from "../Text";
import { alpha, RADIUS, type Theme } from "../tokens";
import { PersonHead } from "./LegacyCard";

/**
 * The agent run card (web AgentUserRunWidget, `.dl-form`): glass-strong,
 * radius 16, padding 20/20/18, gap 16. Rows: head (avatar · name · stage,
 * "Trophy agent" chip) → "What the agent knows" well → decision trio →
 * optional message tile (`push`) → optional verified footer.
 *
 * Every px value is multiplied by `s`; the scene drives all motion through
 * the opacity/rise props (no frame access here). Opacities default to 1 and
 * rises to 0, so a static card needs none of them.
 */
export const AgentRunCard: React.FC<{
  theme: Theme;
  s?: number;
  width: number;
  user: { name: string; initials: string; stage: string };
  chip: string;
  knowsLabel: string;
  signals: readonly string[];
  trio: { objective: string; channel: string; send: string };
  /** Channel icon: BellSimple for push (default), EnvelopeSimple for email */
  channelIcon?: IconName;
  /** Backdrop blur: only when something sits behind the card, never toggled mid-scene */
  blur?: boolean;
  headOpacity?: number;
  labelOpacity?: number;
  /** Per-signal text opacity and rise (px); the glow dot has its own opacity */
  signalOpacities?: readonly number[];
  signalRises?: readonly number[];
  dotOpacities?: readonly number[];
  /** Per-tile opacity and rise (px), in order Objective · Channel · Send */
  tileOpacities?: readonly number[];
  tileRises?: readonly number[];
  /** The message tile slot (PushTile 'daylight' or an email preview) */
  push?: React.ReactNode;
  /** ShieldCheck + "Verified against your brand guidelines" */
  footer?: boolean;
  footerOpacity?: number;
  style?: React.CSSProperties;
}> = ({
  theme,
  s = 1,
  width,
  user,
  chip,
  knowsLabel,
  signals,
  trio,
  channelIcon = "BellSimple",
  blur = false,
  headOpacity = 1,
  labelOpacity = 1,
  signalOpacities,
  signalRises,
  dotOpacities,
  tileOpacities,
  tileRises,
  push,
  footer = false,
  footerOpacity = 1,
  style,
}) => {
  const tiles: { label: string; value: string; icon: IconName }[] = [
    { label: "Objective", value: trio.objective, icon: "Target" },
    { label: "Channel", value: trio.channel, icon: channelIcon },
    { label: "Send", value: trio.send, icon: "Clock" },
  ];
  const px = (v: number) => `${(v * s).toFixed(3)}px`;

  return (
    <GlassCard
      theme={theme}
      radius={RADIUS.card}
      strong
      blur={blur}
      edge="glass"
      shadow
      padding={`${20 * s}px ${20 * s}px ${18 * s}px`}
      style={{ width, display: "flex", flexDirection: "column", gap: 16 * s, ...style }}
    >
      {/* Head: avatar · name · stage, chip on the right */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12 * s, opacity: headOpacity }}>
        <PersonHead initials={user.initials} name={user.name} context={user.stage} theme={theme} s={s} />
        <Chip theme={theme} s={s} icon="Path" style={{ flex: "none" }}>
          {chip}
        </Chip>
      </div>

      {/* What the agent knows: sunken well */}
      <Well theme={theme} radius={RADIUS.card} padding={`${12 * s}px ${14 * s}px`} style={{ display: "flex", flexDirection: "column", gap: 8 * s }}>
        <Label color={theme.inkMuted} s={s} style={{ opacity: labelOpacity }}>
          {knowsLabel}
        </Label>
        <div style={{ display: "flex", flexDirection: "column", gap: 6 * s }}>
          {signals.map((signal, i) => {
            const textOpacity = signalOpacities?.[i] ?? 1;
            const rise = signalRises?.[i] ?? 0;
            const dotOpacity = dotOpacities?.[i] ?? textOpacity;
            return (
              <div
                key={signal}
                style={{
                  display: "flex",
                  alignItems: "flex-start",
                  gap: 8 * s,
                  fontFamily: sansFont,
                  fontWeight: 400,
                  fontSize: 13 * s,
                  lineHeight: `${18 * s}px`,
                  color: theme.ink,
                  translate: `0px ${px(rise)}`,
                }}
              >
                <span
                  style={{
                    display: "inline-block",
                    width: 6 * s,
                    height: 6 * s,
                    marginTop: 6 * s,
                    borderRadius: "50%",
                    background: theme.glow,
                    flex: "none",
                    opacity: dotOpacity,
                  }}
                />
                <span style={{ opacity: textOpacity }}>{signal}</span>
              </div>
            );
          })}
        </div>
      </Well>

      {/* Decision trio: solid tiles on a hairline */}
      <div style={{ display: "grid", gridTemplateColumns: "minmax(0,1fr) minmax(0,1fr) minmax(0,1.35fr)", gap: 8 * s }}>
        {tiles.map((tile, i) => (
          <div
            key={tile.label}
            style={{
              boxSizing: "border-box",
              display: "flex",
              flexDirection: "column",
              gap: 4 * s,
              minWidth: 0,
              borderRadius: RADIUS.card,
              border: `1px solid ${theme.border}`,
              background: alpha(theme.raised, 0.6),
              padding: `${10 * s}px ${12 * s}px`,
              opacity: tileOpacities?.[i] ?? 1,
              translate: `0px ${px(tileRises?.[i] ?? 0)}`,
            }}
          >
            <Label color={theme.inkMuted} s={s}>
              {tile.label}
            </Label>
            <span
              style={{
                display: "flex",
                alignItems: "center",
                gap: 6 * s,
                minWidth: 0,
                fontFamily: sansFont,
                fontWeight: 500,
                fontSize: 14 * s,
                lineHeight: `${20 * s}px`,
                color: theme.ink,
                whiteSpace: "nowrap",
              }}
            >
              <Ph name={tile.icon} size={16 * s} />
              <span style={{ overflow: "hidden", textOverflow: "ellipsis" }}>{tile.value}</span>
            </span>
          </div>
        ))}
      </div>

      {push}

      {footer ? (
        <div style={{ display: "flex", alignItems: "center", gap: 6 * s, color: theme.inkMuted, opacity: footerOpacity }}>
          <Ph name="ShieldCheck" size={14 * s} />
          <Label color={theme.inkMuted} s={s}>
            Verified against your brand guidelines
          </Label>
        </div>
      ) : null}
    </GlassCard>
  );
};
