import React from "react";
import { AbsoluteFill } from "remotion";
import { alpha } from "../../daylight/tokens";
import { H, W } from "../script";
import { useVideo } from "../video";

/**
 * Film grain like the website's, static (never re-seeded) as on the site, and
 * inline SVG rather than a background image so it is drawn before the frame
 * is captured. On the skies it is the website's own overlay grain. The site's
 * overlay all but vanishes on the pale flat ground, so there the same noise is
 * contrast-boosted and laid on with a plain blend at low opacity, centred
 * light so the ground keeps its colour.
 */
const FINE = { opacity: 0.2, slope: 2.6, intercept: -0.5, frequency: 0.7 };
const OVERLAY = { opacity: 0.8, slope: 1, intercept: 0, frequency: 0.85 };

const Grain: React.FC<{ kind: "fine" | "overlay" }> = ({ kind }) => {
  const g = kind === "fine" ? FINE : OVERLAY;
  const id = `backdrop-grain-${kind}`;
  return (
    <svg
      width={W}
      height={H}
      viewBox={`0 0 ${W} ${H}`}
      style={{ position: "absolute", inset: 0, opacity: g.opacity, mixBlendMode: kind === "overlay" ? "overlay" : undefined, pointerEvents: "none" }}
    >
      <filter id={id} x="0" y="0" width="100%" height="100%">
        <feTurbulence type="fractalNoise" baseFrequency={g.frequency} numOctaves={2} stitchTiles="stitch" />
        <feColorMatrix type="saturate" values="0" />
        <feComponentTransfer>
          <feFuncR type="linear" slope={g.slope} intercept={g.intercept} />
          <feFuncG type="linear" slope={g.slope} intercept={g.intercept} />
          <feFuncB type="linear" slope={g.slope} intercept={g.intercept} />
          <feFuncA type="linear" slope={0} intercept={1} />
        </feComponentTransfer>
      </filter>
      <rect width={W} height={H} filter={`url(#${id})`} />
    </svg>
  );
};

/**
 * The video's ground (the flat light blue or a sky), with grain over it;
 * content sits above the grain, as on the site. `glow` fades in the outro's
 * top-right halo.
 */
export const Backdrop: React.FC<{ glow?: number; style?: React.CSSProperties; children?: React.ReactNode }> = ({ glow = 0, style, children }) => {
  const { ground } = useVideo();
  return (
    <AbsoluteFill style={{ background: ground.background, ...style }}>
      {glow > 0 ? (
        <div
          style={{
            position: "absolute",
            inset: 0,
            opacity: glow * ground.glowStrength,
            background: `radial-gradient(circle 780px at 1635px 105px, ${ground.glow} 0%, ${alpha(ground.glow, 0.55)} 38%, ${alpha(ground.glow, 0)} 100%)`,
          }}
        />
      ) : null}
      <Grain kind={ground.grain} />
      {children}
    </AbsoluteFill>
  );
};
