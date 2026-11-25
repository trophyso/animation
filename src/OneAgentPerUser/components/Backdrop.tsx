import React from "react";
import { AbsoluteFill } from "remotion";
import { alpha } from "../../daylight/tokens";
import { C, H, W } from "../script";

/**
 * Film grain like the website's. The site's grain is an overlay blend, which
 * all but vanishes on a ground this pale, so here the same fractal noise is
 * contrast-boosted and laid on with a plain blend at low opacity, centred
 * light so the ground keeps its colour. It is static (never re-seeded), as on
 * the site. Inline SVG rather than a background image, so it is drawn before
 * the frame is captured.
 */
const GRAIN_OPACITY = 0.2;
const GRAIN_CONTRAST = { slope: 2.6, intercept: -0.5 };

const Grain: React.FC = () => (
  <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} style={{ position: "absolute", inset: 0, opacity: GRAIN_OPACITY, pointerEvents: "none" }}>
    <filter id="backdrop-grain" x="0" y="0" width="100%" height="100%">
      <feTurbulence type="fractalNoise" baseFrequency="0.7" numOctaves={2} stitchTiles="stitch" />
      <feColorMatrix type="saturate" values="0" />
      <feComponentTransfer>
        <feFuncR type="linear" {...GRAIN_CONTRAST} />
        <feFuncG type="linear" {...GRAIN_CONTRAST} />
        <feFuncB type="linear" {...GRAIN_CONTRAST} />
        <feFuncA type="linear" slope={0} intercept={1} />
      </feComponentTransfer>
    </filter>
    <rect width={W} height={H} filter="url(#backdrop-grain)" />
  </svg>
);

/**
 * The light-blue ground every scene shares, with film grain over it (content
 * sits above the grain, as on the site); `glow` fades in the outro's
 * top-right halo.
 */
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
    <Grain />
    {children}
  </AbsoluteFill>
);
