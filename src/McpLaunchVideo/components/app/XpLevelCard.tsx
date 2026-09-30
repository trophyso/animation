import React from "react";
import { Zap } from "lucide-react";
import { interpolate } from "remotion";
import { PULSE, PULSE_CARD } from "./pulseTheme";
import { RollingNumber } from "./StreakCard";

const LEVEL_TARGET = 250;
const NEXT_LEVEL_TARGET = 400;
const RING_SIZE = 64;
const RING_STROKE = 7;
const RING_RADIUS = (RING_SIZE - RING_STROKE) / 2;
const RING_CIRCUMFERENCE = 2 * Math.PI * RING_RADIUS;

/**
 * Level tile with an XP ring.
 * @param fill 0 → 1 as XP goes from `fromXp` to `toXp`.
 * @param levelUp 0 → 1 once the new level is reached.
 */
export const XpLevelCard: React.FC<{
  fromXp: number;
  toXp: number;
  fill: number;
  levelUp: number;
}> = ({ fromXp, toXp, fill, levelUp }) => {
  const xp = Math.round(interpolate(fill, [0, 1], [fromXp, toXp]));
  const leveled = levelUp > 0.5;
  const drain = interpolate(levelUp, [0.45, 0.8], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const ringProgress = levelUp > 0.45 ? drain : xp / LEVEL_TARGET;
  const numberRoll = interpolate(levelUp, [0.3, 0.7], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const chip = interpolate(levelUp, [0.5, 0.8], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const flash = levelUp > 0 && levelUp < 1 ? Math.sin(levelUp * Math.PI) : 0;

  return (
    <div
      style={{
        ...PULSE_CARD,
        position: "relative",
        flex: 1,
        padding: "16px 16px 14px",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundColor: PULSE.purpleSoft,
          opacity: flash,
        }}
      />
      <div
        style={{
          position: "relative",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <Zap
            size={18}
            color={PULSE.purple}
            fill={PULSE.purple}
            strokeWidth={1.6}
          />
          <span style={{ fontSize: 15, fontWeight: 600, color: PULSE.ink }}>
            Level
          </span>
        </div>
        <span
          style={{
            padding: "2px 8px",
            borderRadius: 999,
            backgroundColor: PULSE.purple,
            color: "#fff",
            fontSize: 11,
            fontWeight: 800,
            letterSpacing: "0.04em",
            opacity: chip,
            transform: `scale(${0.6 + chip * 0.4})`,
          }}
        >
          LEVEL UP
        </span>
      </div>

      <div
        style={{
          position: "relative",
          flex: 1,
          display: "flex",
          alignItems: "center",
          gap: 12,
          marginTop: 8,
        }}
      >
        <div
          style={{
            position: "relative",
            width: RING_SIZE,
            height: RING_SIZE,
            flexShrink: 0,
            transform: `scale(${1 + flash * 0.12})`,
          }}
        >
          <svg
            width={RING_SIZE}
            height={RING_SIZE}
            style={{ transform: "rotate(-90deg)" }}
          >
            <circle
              cx={RING_SIZE / 2}
              cy={RING_SIZE / 2}
              r={RING_RADIUS}
              fill="none"
              stroke={PULSE.purpleSoft}
              strokeWidth={RING_STROKE}
            />
            <circle
              cx={RING_SIZE / 2}
              cy={RING_SIZE / 2}
              r={RING_RADIUS}
              fill="none"
              stroke={PULSE.purple}
              strokeWidth={RING_STROKE}
              strokeLinecap="round"
              strokeDasharray={RING_CIRCUMFERENCE}
              strokeDashoffset={RING_CIRCUMFERENCE * (1 - ringProgress)}
            />
          </svg>
          <div
            style={{
              position: "absolute",
              inset: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <RollingNumber
              from={2}
              to={3}
              progress={numberRoll}
              height={30}
              style={{
                fontSize: 26,
                fontWeight: 800,
                letterSpacing: "-0.03em",
                color: PULSE.ink,
                textAlign: "center",
              }}
            />
          </div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
          <span style={{ fontSize: 16, fontWeight: 700, color: PULSE.ink }}>
            {leveled ? "Committed" : "Regular"}
          </span>
          <span
            style={{
              fontSize: 13,
              fontWeight: 500,
              color: PULSE.secondary,
              fontVariantNumeric: "tabular-nums",
            }}
          >
            {leveled
              ? `0 / ${NEXT_LEVEL_TARGET} XP`
              : `${xp} / ${LEVEL_TARGET} XP`}
          </span>
        </div>
      </div>
    </div>
  );
};
