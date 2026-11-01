import React from "react";
import { interpolate, random } from "remotion";

const COLORS = ["#4CC74A", "#f5a524", "#ff5a36", "#3b82f6", "#7a5af8", "#ff8fb1"];
const PARTICLES = 70;
const GRAVITY = 0.55;

/** Deterministic burst from (x, y); `frame` counts from the moment of the burst. */
export const Confetti: React.FC<{ frame: number; x: number; y: number }> = ({
  frame,
  x,
  y,
}) => {
  if (frame < 0) return null;

  return (
    <>
      {new Array(PARTICLES).fill(0).map((_, i) => {
        const angle = -Math.PI / 2 + (random(`a${i}`) - 0.5) * Math.PI * 1.5;
        const speed = 9 + random(`s${i}`) * 13;
        const drag = Math.pow(0.97, frame);
        const travel = (1 - drag) / (1 - 0.97);
        const px = x + Math.cos(angle) * speed * travel;
        const py = y + Math.sin(angle) * speed * travel + GRAVITY * frame * frame * 0.25;
        const spin = frame * (6 + random(`r${i}`) * 14) * (i % 2 ? 1 : -1);
        const isStrip = i % 3 === 0;
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: px,
              top: py,
              width: isStrip ? 6 : 10,
              height: isStrip ? 16 : 10,
              borderRadius: isStrip ? 2 : 999,
              backgroundColor: COLORS[i % COLORS.length],
              opacity: interpolate(frame, [50, 90], [1, 0], {
                extrapolateLeft: "clamp",
                extrapolateRight: "clamp",
              }),
              transform: `rotate(${spin}deg)`,
            }}
          />
        );
      })}
    </>
  );
};
