import React from "react";
import { interpolate } from "remotion";
import { sansFont } from "../fonts";
import { GlassCard } from "../Glass";
import { Ph } from "../icons";
import { Figure, Sun } from "../Text";
import { alpha, RADIUS, type Theme } from "../tokens";

export type StreakDay = { letter: string; state: "kept" | "today" | "ahead" };

/** One 40px week dot: kept = sky gradient with a bold check; today/ahead = hairline outline */
const Dot: React.FC<{ day: StreakDay; fill: number; gradient: readonly [string, string]; theme: Theme; s: number }> = ({
  day,
  fill,
  gradient,
  theme,
  s,
}) => {
  const size = 40 * s;
  const kept = day.state === "kept";
  const p = kept ? fill : 0;
  const scale = interpolate(p, [0, 1], [0.8, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", output: "perceptual-scale" });
  return (
    <div style={{ position: "relative", width: size, height: size }}>
      <div
        style={{
          position: "absolute",
          inset: 0,
          borderRadius: "50%",
          border: `${1.5 * s}px solid ${theme.border}`,
          boxSizing: "border-box",
          opacity: 1 - p,
        }}
      />
      {kept ? (
        <>
          <div
            style={{
              position: "absolute",
              inset: 0,
              borderRadius: "50%",
              background: `linear-gradient(170deg, ${gradient[0]}, ${gradient[1]})`,
              opacity: p,
            }}
          />
          <div
            style={{
              position: "absolute",
              inset: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: theme.ink,
              opacity: p,
              scale: `${scale.toFixed(4)}`,
            }}
          >
            <Ph name="Check" size={18 * s} weight="bold" />
          </div>
        </>
      ) : null}
    </div>
  );
};

/**
 * Streak widget: BigFigure (count + unit) over the 7-day week. `figure` is the
 * already-formatted count, `dotFill` one eased 0→1 per kept day (in order),
 * `sunOpacity` the glow dot marking the figure as data the agent reads.
 */
export const StreakCard: React.FC<{
  figure: string;
  unit: string;
  days: readonly StreakDay[];
  dotFill: readonly number[];
  gradient: readonly [string, string];
  theme: Theme;
  s?: number;
  sunOpacity?: number;
  style?: React.CSSProperties;
}> = ({ figure, unit, days, dotFill, gradient, theme, s = 1, sunOpacity = 0, style }) => {
  let keptIndex = 0;
  return (
    <GlassCard theme={theme} radius={RADIUS.widget} padding={`${22 * s}px ${24 * s}px`} style={{ display: "flex", flexDirection: "column", gap: 18 * s, ...style }}>
      <div style={{ position: "relative", display: "flex", alignItems: "baseline", gap: 10 * s }}>
        <Sun
          size={8}
          glow={theme.glow}
          style={{ position: "absolute", left: -(10 * s + 8), top: "50%", translate: "0px -4px", opacity: sunOpacity }}
        />
        <Figure value={figure} widthCh={2} size={56 * s} color={theme.ink} lineHeight={1} tracking="-0.045em" />
        <span style={{ fontFamily: sansFont, fontWeight: 400, fontSize: 16 * s, lineHeight: `${22 * s}px`, color: theme.inkSubtle }}>{unit}</span>
      </div>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(7, minmax(0, 1fr))",
          gap: 4 * s,
          padding: `${14 * s}px ${6 * s}px ${12 * s}px`,
          borderRadius: RADIUS.week * s,
          background: alpha(theme.ink, 0.04),
        }}
      >
        {days.map((day, i) => {
          const fill = day.state === "kept" ? (dotFill[keptIndex++] ?? 1) : 0;
          return (
            <div key={i} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 5 * s }}>
              <Dot day={day} fill={fill} gradient={gradient} theme={theme} s={s} />
              <span
                style={{
                  fontFamily: sansFont,
                  fontWeight: 600,
                  fontSize: 13 * s,
                  lineHeight: `${16 * s}px`,
                  color: day.state === "ahead" ? theme.inkSubtle : theme.ink,
                }}
              >
                {day.letter}
              </span>
            </div>
          );
        })}
      </div>
    </GlassCard>
  );
};
