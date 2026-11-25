import React from "react";
import { AbsoluteFill } from "remotion";
import { GRAIN, SKY_BACKGROUND } from "../og/constants";
import type { Sky as SkyName } from "./tokens";

/** Static film grain over a sky: one tile, never re-seeded (web .dl-grain, --grain-opacity 0.8) */
export const Grain: React.FC = () => (
  <div
    style={{
      position: "absolute",
      inset: 0,
      opacity: GRAIN.opacity,
      mixBlendMode: "overlay",
      backgroundImage: GRAIN.backgroundImage,
      pointerEvents: "none",
    }}
  />
);

/** One opaque sky, full bleed, with grain. Every scene renders its own. */
export const Sky: React.FC<{ sky: SkyName; children?: React.ReactNode }> = ({ sky, children }) => (
  <AbsoluteFill style={{ ...SKY_BACKGROUND[sky] }}>
    <Grain />
    {children}
  </AbsoluteFill>
);

/**
 * Skies cannot tween: both are stacked and the destination's opacity rises with
 * progress (web .dl-sky-stack). Grain sits once on top.
 */
export const SkyStack: React.FC<{ from: SkyName; to: SkyName; progress: number; children?: React.ReactNode }> = ({
  from,
  to,
  progress,
  children,
}) => (
  <AbsoluteFill style={{ ...SKY_BACKGROUND[from] }}>
    <div style={{ position: "absolute", inset: 0, opacity: Math.min(1, Math.max(0, progress)), ...SKY_BACKGROUND[to] }} />
    <Grain />
    {children}
  </AbsoluteFill>
);
