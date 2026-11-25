import React from "react";
import { AbsoluteFill } from "remotion";
import { alpha } from "../../daylight/tokens";
import { C } from "../script";

/** The flat light-blue ground every light scene shares; `glow` fades in the outro's top-right halo */
export const Backdrop: React.FC<{ color?: string; glow?: number; style?: React.CSSProperties; children?: React.ReactNode }> = ({
  color = C.bg,
  glow = 0,
  style,
  children,
}) => (
  <AbsoluteFill style={{ background: color, ...style }}>
    {glow > 0 ? (
      <div
        style={{
          position: "absolute",
          inset: 0,
          opacity: glow,
          background: `radial-gradient(circle 780px at 1635px 105px, ${C.glow} 0%, ${alpha(C.glow, 0.55)} 38%, ${alpha(C.glow, 0)} 100%)`,
        }}
      />
    ) : null}
    {children}
  </AbsoluteFill>
);
