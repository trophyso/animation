import React from "react";
import { Flame } from "lucide-react";
import { interpolate } from "remotion";
import { PULSE, PULSE_CARD } from "./pulseTheme";

const DAYS = ["M", "T", "W", "T", "F", "S", "S"];
const WORKOUT_DAYS = [0, 2];
const TODAY_INDEX = 3;
const WEEKLY_TARGET = 3;

export const RollingNumber: React.FC<{
  from: number | string;
  to: number | string;
  progress: number;
  height: number;
  style?: React.CSSProperties;
}> = ({ from, to, progress, height, style }) => (
  <div
    style={{ height, overflow: "hidden", lineHeight: `${height}px`, ...style }}
  >
    <div
      style={{
        transform: `translateY(${interpolate(progress, [0, 1], [0, -height])}px)`,
      }}
    >
      <div>{from}</div>
      <div>{to}</div>
    </div>
  </div>
);

/**
 * Weekly streak tile: 3 workouts in a week extends it.
 * @param progress 0 → 1 as today's workout completes this week's target.
 */
export const StreakCard: React.FC<{
  from: number;
  progress: number;
}> = ({ from, progress }) => {
  const flameScale = 1 + Math.sin(Math.min(progress, 1) * Math.PI) * 0.4;

  return (
    <div
      style={{
        ...PULSE_CARD,
        flex: 1,
        padding: "16px 16px 14px",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <Flame
            size={18}
            color={PULSE.brand}
            fill={PULSE.brand}
            strokeWidth={1.6}
            style={{ transform: `scale(${flameScale})` }}
          />
          <span style={{ fontSize: 15, fontWeight: 600, color: PULSE.ink }}>
            Streak
          </span>
        </div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            padding: "2px 8px",
            borderRadius: 999,
            backgroundColor: PULSE.brandSoft,
            color: PULSE.brand,
            fontSize: 12,
            fontWeight: 700,
            fontVariantNumeric: "tabular-nums",
          }}
        >
          <RollingNumber
            from={WEEKLY_TARGET - 1}
            to={WEEKLY_TARGET}
            progress={progress}
            height={16}
          />
          /{WEEKLY_TARGET}
        </div>
      </div>

      <div
        style={{
          display: "flex",
          alignItems: "baseline",
          gap: 5,
          marginTop: 10,
        }}
      >
        <RollingNumber
          from={from}
          to={from + 1}
          progress={progress}
          height={44}
          style={{
            fontSize: 42,
            fontWeight: 800,
            letterSpacing: "-0.04em",
            color: PULSE.ink,
            fontVariantNumeric: "tabular-nums",
          }}
        />
        <span style={{ fontSize: 16, fontWeight: 700, color: PULSE.secondary }}>
          weeks
        </span>
      </div>

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginTop: 14,
        }}
      >
        {DAYS.map((day, index) => {
          const isToday = index === TODAY_INDEX;
          const fill = isToday
            ? progress
            : WORKOUT_DAYS.includes(index)
              ? 1
              : 0;
          return (
            <div
              key={`${day}-${index}`}
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 5,
              }}
            >
              <div
                style={{
                  position: "relative",
                  width: 16,
                  height: 16,
                  borderRadius: 999,
                  backgroundColor: PULSE.fill,
                  boxShadow: isToday
                    ? `0 0 0 1.5px ${PULSE.brand} inset`
                    : "none",
                }}
              >
                <div
                  style={{
                    position: "absolute",
                    inset: 0,
                    borderRadius: 999,
                    backgroundColor: PULSE.brand,
                    transform: `scale(${fill})`,
                  }}
                />
              </div>
              <span
                style={{
                  fontSize: 11,
                  fontWeight: isToday ? 700 : 500,
                  color: isToday ? PULSE.ink : PULSE.secondary,
                }}
              >
                {day}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
