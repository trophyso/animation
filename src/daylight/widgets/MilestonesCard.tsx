import React from "react";
import { displayFont, sansFont } from "../fonts";
import { GlassCard, RaisedTile } from "../Glass";
import { Ph } from "../icons";
import { Label, Sun } from "../Text";
import { alpha, RADIUS, type Theme } from "../tokens";

export type MilestoneBadge = { name: string; meta: string; earned: boolean; pct: number };

/** Earned badge: raised tile, 36px icon tile on muted with a filled SealCheck */
const EarnedBadge: React.FC<{ badge: MilestoneBadge; theme: Theme; s: number }> = ({ badge, theme, s }) => (
  <RaisedTile theme={theme} radius={RADIUS.well * s} padding={12 * s} style={{ display: "flex", flexDirection: "column", gap: 10 * s }}>
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        width: 36 * s,
        height: 36 * s,
        borderRadius: 10 * s,
        background: theme.muted,
        color: theme.ink,
      }}
    >
      <Ph name="SealCheck" size={22 * s} weight="fill" />
    </span>
    <div>
      <div style={{ fontFamily: sansFont, fontWeight: 600, fontSize: 14 * s, lineHeight: `${18 * s}px`, color: theme.ink }}>{badge.name}</div>
      <Label color={theme.inkSubtle} s={s} style={{ display: "block" }}>
        {badge.meta}
      </Label>
    </div>
  </RaisedTile>
);

/** Todo badge: dashed border-strong ring, 4px meter (ink fill), progress label */
const TodoBadge: React.FC<{ badge: MilestoneBadge; meter: number; metaOpacity: number; theme: Theme; s: number }> = ({
  badge,
  meter,
  metaOpacity,
  theme,
  s,
}) => (
  <div
    style={{
      boxSizing: "border-box",
      display: "flex",
      flexDirection: "column",
      gap: 10 * s,
      padding: 12 * s,
      borderRadius: RADIUS.well * s,
      border: `${1.5 * s}px dashed ${theme.borderStrong}`,
    }}
  >
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        width: 36 * s,
        height: 36 * s,
        borderRadius: 10 * s,
        background: theme.muted,
        color: theme.inkMuted,
      }}
    >
      <Ph name="SealCheck" size={22 * s} weight="regular" />
    </span>
    <div>
      <div style={{ fontFamily: sansFont, fontWeight: 600, fontSize: 14 * s, lineHeight: `${18 * s}px`, color: theme.ink }}>{badge.name}</div>
      <div style={{ position: "relative", height: 4 * s, borderRadius: 2 * s, background: alpha(theme.ink, 0.08), marginTop: 6 * s, overflow: "hidden" }}>
        <div style={{ position: "absolute", inset: 0, width: `${(meter * 100).toFixed(3)}%`, borderRadius: 2 * s, background: theme.ink }} />
      </div>
      <Label color={theme.inkSubtle} s={s} style={{ display: "block", marginTop: 6 * s, opacity: metaOpacity }}>
        {badge.meta}
      </Label>
    </div>
  </div>
);

/**
 * Milestones widget: the lit "new" row (accent-muted wash, ink icon tile) over a
 * three-column badge grid. `meter` is the todo badge's eased fill (0→1 of its
 * pct), `metaOpacity` its progress label, `sunOpacity` the glow dot on the lit row.
 */
export const MilestonesCard: React.FC<{
  lit: { name: string; detail: string; note: string };
  badges: readonly MilestoneBadge[];
  meter: number;
  metaOpacity?: number;
  theme: Theme;
  accentMuted: string;
  s?: number;
  sunOpacity?: number;
  style?: React.CSSProperties;
}> = ({ lit, badges, meter, metaOpacity = 1, theme, accentMuted, s = 1, sunOpacity = 0, style }) => (
  <GlassCard theme={theme} radius={RADIUS.widget} padding={`${22 * s}px ${24 * s}px`} style={{ display: "flex", flexDirection: "column", gap: 18 * s, ...style }}>
    <div
      style={{
        position: "relative",
        display: "grid",
        gridTemplateColumns: `${56 * s}px minmax(0, 1fr) auto`,
        gap: 14 * s,
        alignItems: "center",
        padding: 14 * s,
        borderRadius: RADIUS.week * s,
        background: accentMuted,
      }}
    >
      <Sun size={8} glow={theme.glow} style={{ position: "absolute", left: -4, top: "50%", translate: "0px -4px", opacity: sunOpacity }} />
      <span
        style={{
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          width: 56 * s,
          height: 56 * s,
          borderRadius: RADIUS.week * s,
          background: theme.ink,
          color: theme.bg,
        }}
      >
        <Ph name="SealCheck" size={30 * s} weight="fill" />
      </span>
      <div style={{ minWidth: 0 }}>
        <div style={{ fontFamily: displayFont, fontWeight: 500, fontSize: 19 * s, lineHeight: `${24 * s}px`, letterSpacing: "-0.01em", color: theme.ink }}>
          {lit.name}
        </div>
        <div style={{ fontFamily: sansFont, fontWeight: 400, fontSize: 13 * s, lineHeight: `${18 * s}px`, color: theme.inkMuted, marginTop: 2 * s }}>
          {lit.detail}
        </div>
      </div>
      <Label color={theme.inkSubtle} s={s} style={{ whiteSpace: "nowrap", alignSelf: "start", marginTop: 4 * s }}>
        {lit.note}
      </Label>
    </div>
    <div style={{ display: "grid", gridTemplateColumns: "repeat(3, minmax(0, 1fr))", gap: 10 * s }}>
      {badges.map((badge) =>
        badge.earned ? (
          <EarnedBadge key={badge.name} badge={badge} theme={theme} s={s} />
        ) : (
          <TodoBadge key={badge.name} badge={badge} meter={(meter * badge.pct) / 100} metaOpacity={metaOpacity} theme={theme} s={s} />
        ),
      )}
    </div>
  </GlassCard>
);
