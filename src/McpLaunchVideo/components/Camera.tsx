import React from "react";
import { AbsoluteFill, interpolate } from "remotion";

const CENTER_X = 1920 / 2;
const CENTER_Y = 1080 / 2;

/**
 * Pans and zooms its children like a camera.
 * `progress` 0 = zoomed to `scale` with `focus` at the centre of the frame, 1 = untransformed.
 */
export const Camera: React.FC<{
  children: React.ReactNode;
  progress?: number;
  focus: { x: number; y: number };
  scale: number;
}> = ({ children, progress = 0, focus, scale }) => {
  const s = interpolate(progress, [0, 1], [scale, 1]);
  const fx = interpolate(progress, [0, 1], [focus.x, CENTER_X]);
  const fy = interpolate(progress, [0, 1], [focus.y, CENTER_Y]);

  return (
    <AbsoluteFill
      style={{
        transformOrigin: "0 0",
        transform: `translate(${CENTER_X - fx * s}px, ${CENTER_Y - fy * s}px) scale(${s})`,
      }}
    >
      {children}
    </AbsoluteFill>
  );
};
