import React from "react";
import { spring, useCurrentFrame, useVideoConfig } from "remotion";

/** Grows from zero height so bottom-anchored content above it scrolls up smoothly. */
export const Reveal: React.FC<{
  startFrame: number;
  maxHeight: number;
  children: React.ReactNode;
  style?: React.CSSProperties;
}> = ({ startFrame, maxHeight, children, style }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const progress = spring({
    frame: frame - startFrame,
    fps,
    config: { damping: 20, mass: 0.6, stiffness: 120 },
  });

  return (
    <div
      style={{
        maxHeight: progress * maxHeight,
        overflow: "hidden",
        opacity: progress,
        transform: `translateY(${(1 - progress) * 16}px)`,
        flexShrink: 0,
        ...style,
      }}
    >
      {children}
    </div>
  );
};
