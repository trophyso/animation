import React from "react";
import { interpolate } from "remotion";
import { PULSE, PULSE_CARD } from "./pulseTheme";

const ROW_HEIGHT = 48;

type Player = {
  name: string;
  initials: string;
  tint: string;
  ink: string;
  workouts: number;
  fromSlot: number;
  toSlot: number;
  isYou?: boolean;
};

const PLAYERS: Player[] = [
  {
    name: "Sam Carter",
    initials: "SC",
    tint: "#e8f1ff",
    ink: "#2f6bd8",
    workouts: 9,
    fromSlot: 0,
    toSlot: 0,
  },
  {
    name: "Priya Patel",
    initials: "PP",
    tint: "#fde9f3",
    ink: "#c2387f",
    workouts: 8,
    fromSlot: 1,
    toSlot: 1,
  },
  {
    name: "Jordan Lee",
    initials: "JL",
    tint: "#e3f6ef",
    ink: "#1f8a61",
    workouts: 6,
    fromSlot: 2,
    toSlot: 3,
  },
  {
    name: "Mia Rossi",
    initials: "MR",
    tint: "#fff3dc",
    ink: "#b7791f",
    workouts: 6,
    fromSlot: 3,
    toSlot: 4,
  },
  {
    name: "You",
    initials: "AM",
    tint: PULSE.brand,
    ink: "#fff",
    workouts: 6,
    fromSlot: 4,
    toSlot: 2,
    isYou: true,
  },
];

/**
 * @param move 0 → 1 as the user climbs the weekly leaderboard.
 * @param scored whether the user's new workout has been counted.
 */
export const LeaderboardCard: React.FC<{ move: number; scored: boolean }> = ({
  move,
  scored,
}) => {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
      <div
        style={{
          display: "flex",
          alignItems: "baseline",
          justifyContent: "space-between",
          padding: "0 4px",
        }}
      >
        <span
          style={{
            fontSize: 20,
            fontWeight: 700,
            letterSpacing: "-0.02em",
            color: PULSE.ink,
          }}
        >
          Weekly Leaderboard
        </span>
        <span style={{ fontSize: 15, fontWeight: 500, color: PULSE.brand }}>
          See All
        </span>
      </div>
      <div style={{ ...PULSE_CARD, padding: "4px 0" }}>
        <div
          style={{ position: "relative", height: ROW_HEIGHT * PLAYERS.length }}
        >
          {PLAYERS.slice(0, -1).map((_, index) => (
            <div
              key={index}
              style={{
                position: "absolute",
                left: 92,
                right: 0,
                top: (index + 1) * ROW_HEIGHT,
                height: 0.75,
                backgroundColor: PULSE.separator,
              }}
            />
          ))}
          {PLAYERS.map((player) => {
            const slot = interpolate(
              move,
              [0, 1],
              [player.fromSlot, player.toSlot],
            );
            const rank = Math.round(slot) + 1;
            const workouts =
              player.isYou && scored ? player.workouts + 1 : player.workouts;
            const moving = player.isYou && move > 0.02 && move < 0.98;
            return (
              <div
                key={player.name}
                style={{
                  position: "absolute",
                  left: 6,
                  right: 6,
                  top: slot * ROW_HEIGHT + 2,
                  height: ROW_HEIGHT - 4,
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                  padding: "0 12px",
                  borderRadius: 14,
                  backgroundColor: player.isYou
                    ? PULSE.brandSoft
                    : "transparent",
                  zIndex: player.isYou ? 2 : 1,
                  boxShadow: moving
                    ? "0 8px 20px rgba(17, 17, 20, 0.12)"
                    : "none",
                  transform: `scale(${moving ? 1.02 : 1})`,
                }}
              >
                <span
                  style={{
                    width: 18,
                    fontSize: 15,
                    fontWeight: 700,
                    color: player.isYou ? PULSE.brand : PULSE.secondary,
                    fontVariantNumeric: "tabular-nums",
                  }}
                >
                  {rank}
                </span>
                <div
                  style={{
                    width: 32,
                    height: 32,
                    borderRadius: 999,
                    backgroundColor: player.tint,
                    color: player.ink,
                    fontSize: 12,
                    fontWeight: 700,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  {player.initials}
                </div>
                <span
                  style={{
                    flex: 1,
                    fontSize: 16,
                    fontWeight: player.isYou ? 700 : 500,
                    color: PULSE.ink,
                  }}
                >
                  {player.name}
                </span>
                <span
                  style={{
                    fontSize: 15,
                    fontWeight: 600,
                    color: player.isYou ? PULSE.ink : PULSE.secondary,
                    fontVariantNumeric: "tabular-nums",
                  }}
                >
                  {workouts}
                  <span style={{ fontWeight: 500, color: PULSE.secondary }}>
                    {" "}
                    workouts
                  </span>
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
