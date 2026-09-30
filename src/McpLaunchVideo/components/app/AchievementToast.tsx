import React from "react";
import { Dumbbell } from "lucide-react";
import { PULSE } from "./pulseTheme";

const Medal: React.FC = () => (
  <div
    style={{
      position: "relative",
      width: 54,
      height: 54,
      borderRadius: 999,
      background:
        "linear-gradient(145deg, #ffd978 0%, #f5a524 55%, #d9820b 100%)",
      boxShadow: "0 4px 10px -2px rgba(217, 130, 11, 0.45)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      flexShrink: 0,
    }}
  >
    <div
      style={{
        position: "absolute",
        inset: 4,
        borderRadius: 999,
        border: "2px solid rgba(255, 255, 255, 0.55)",
      }}
    />
    <Dumbbell size={24} color="#fff" strokeWidth={2.6} />
  </div>
);

/** In-app banner that slides down from the top; `progress` 0 = hidden, 1 = fully shown. */
export const AchievementToast: React.FC<{ progress: number }> = ({
  progress,
}) => {
  return (
    <div
      style={{
        position: "absolute",
        top: 58,
        left: 12,
        right: 12,
        zIndex: 80,
        display: "flex",
        alignItems: "center",
        gap: 14,
        padding: "14px 16px",
        borderRadius: 24,
        backgroundColor: "rgba(255, 255, 255, 0.97)",
        boxShadow:
          "0 16px 40px -10px rgba(17, 17, 20, 0.3), 0 0 0 0.5px rgba(17, 17, 20, 0.06)",
        opacity: Math.min(1, progress * 1.5),
        transform: `translateY(${(1 - progress) * -160}px) scale(${0.94 + progress * 0.06})`,
      }}
    >
      <Medal />
      <div
        style={{ display: "flex", flexDirection: "column", gap: 1, flex: 1 }}
      >
        <span style={{ fontSize: 13, fontWeight: 600, color: PULSE.secondary }}>
          Achievement unlocked
        </span>
        <span
          style={{
            fontSize: 18,
            fontWeight: 700,
            letterSpacing: "-0.01em",
            color: PULSE.ink,
          }}
        >
          25 Workouts
        </span>
        <span style={{ fontSize: 14, fontWeight: 500, color: PULSE.secondary }}>
          Top 18% of Pulse members
        </span>
      </div>
      <span
        style={{
          alignSelf: "flex-start",
          fontSize: 13,
          fontWeight: 500,
          color: PULSE.tertiary,
        }}
      >
        now
      </span>
    </div>
  );
};
