import React, { useMemo } from "react";
import { personDots } from "../og/person-dots";
import type { PersonKey } from "../og/people";
import { type Theme } from "./tokens";

const clamp01 = (v: number) => Math.min(1, Math.max(0, v));

/**
 * The data portrait: a faceless head-and-shoulders profile facing left, drawn
 * as a dot grid in the sky's ink, with one point lit in glow where the agent
 * acted. `lit` 0..1 fades the lit point; `reveal` 0..1 reveals dots bottom-up.
 */
export const Person: React.FC<{
  who: PersonKey;
  height: number;
  theme: Theme;
  lit?: number;
  reveal?: number;
  style?: React.CSSProperties;
}> = ({ who, height, theme, lit = 1, reveal = 1, style }) => {
  const dots = useMemo(() => personDots(who), [who]);
  const width = (height * 120) / 140;
  return (
    <svg width={width} height={height} viewBox="0 0 120 140" style={{ display: "block", overflow: "visible", ...style }}>
      {dots.map((d, i) => {
        const h = 1 - d.y / 140;
        const k = reveal >= 1 ? 1 : clamp01((reveal * 1.25 - h) / 0.25);
        if (k <= 0) return null;
        return <circle key={i} cx={d.x} cy={d.y} r={d.r} fill={theme.skyInk} fillOpacity={d.o * k} />;
      })}
      {lit > 0 ? (
        <g opacity={lit}>
          <circle cx={60} cy={122} r={9} fill={theme.glow} fillOpacity={0.12} />
          <circle cx={60} cy={122} r={5.5} fill={theme.glow} fillOpacity={0.3} />
          <circle cx={60} cy={122} r={3} fill={theme.glow} />
        </g>
      ) : null}
    </svg>
  );
};
