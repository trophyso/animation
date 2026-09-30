import React from "react";
import { Check, Timer } from "lucide-react";
import { interpolate } from "remotion";
import { PULSE, PULSE_CARD } from "./pulseTheme";

const EXERCISES = 6;

/**
 * Live workout card whose primary button is tapped to log the workout.
 * @param press 0 → 1 → 0 around the tap.
 * @param ripple 0 → 1 after the tap.
 * @param xpFloat 0 → 1 as the "+10 XP" label floats up.
 */
export const WorkoutCard: React.FC<{
  tapped: boolean;
  press: number;
  ripple: number;
  fingerOpacity: number;
  xpFloat: number;
  elapsed: string;
}> = ({ tapped, press, ripple, fingerOpacity, xpFloat, elapsed }) => {
  return (
    <div
      style={{
        ...PULSE_CARD,
        padding: 18,
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
        <span
          style={{
            fontSize: 12,
            fontWeight: 700,
            letterSpacing: "0.06em",
            color: PULSE.brand,
          }}
        >
          {tapped ? "COMPLETED" : "IN PROGRESS"}
        </span>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 4,
            fontSize: 14,
            fontWeight: 600,
            color: PULSE.secondary,
            fontVariantNumeric: "tabular-nums",
          }}
        >
          <Timer size={15} strokeWidth={2.4} />
          {elapsed}
        </div>
      </div>

      <span
        style={{
          marginTop: 4,
          fontSize: 24,
          fontWeight: 800,
          letterSpacing: "-0.03em",
          color: PULSE.ink,
        }}
      >
        Push Day
      </span>

      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 10,
          marginTop: 10,
        }}
      >
        <div style={{ display: "flex", gap: 4, flex: 1 }}>
          {Array.from({ length: EXERCISES }).map((_, index) => (
            <div
              key={index}
              style={{
                flex: 1,
                height: 6,
                borderRadius: 999,
                backgroundColor: PULSE.brand,
              }}
            />
          ))}
        </div>
        <span style={{ fontSize: 13, fontWeight: 600, color: PULSE.secondary }}>
          {EXERCISES}/{EXERCISES} exercises
        </span>
      </div>

      <div style={{ position: "relative", marginTop: 16 }}>
        <div
          style={{
            position: "relative",
            height: 52,
            borderRadius: 14,
            backgroundColor: tapped ? PULSE.ink : PULSE.brand,
            color: "#fff",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 8,
            fontSize: 17,
            fontWeight: 700,
            letterSpacing: "-0.01em",
            transform: `scale(${1 - press * 0.04})`,
            overflow: "hidden",
          }}
        >
          {tapped ? <Check size={20} strokeWidth={3} /> : null}
          {tapped ? "Workout Logged" : "Finish Workout"}
          <div
            style={{
              position: "absolute",
              left: "50%",
              top: "50%",
              width: 420,
              height: 420,
              marginLeft: -210,
              marginTop: -210,
              borderRadius: 999,
              backgroundColor: "rgba(255,255,255,0.3)",
              transform: `scale(${ripple})`,
              opacity: 1 - ripple,
            }}
          />
        </div>

        <div
          style={{
            position: "absolute",
            left: "50%",
            top: -2,
            width: 56,
            height: 56,
            marginLeft: -28,
            borderRadius: 999,
            backgroundColor: "rgba(17, 17, 20, 0.22)",
            border: "3px solid rgba(255,255,255,0.85)",
            opacity: fingerOpacity,
            transform: `scale(${1 - press * 0.2})`,
          }}
        />

        <div
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            top: -30,
            textAlign: "center",
            fontSize: 30,
            fontWeight: 800,
            letterSpacing: "-0.02em",
            color: PULSE.purple,
            textShadow: "0 4px 12px rgba(122, 90, 248, 0.3)",
            opacity: interpolate(xpFloat, [0, 0.15, 0.75, 1], [0, 1, 1, 0]),
            transform: `translateY(${xpFloat * -90}px) scale(${0.8 + xpFloat * 0.4})`,
          }}
        >
          +10 XP
        </div>
      </div>
    </div>
  );
};
