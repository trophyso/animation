/**
 * Trophy Daylight primitives for the social stills: the skies, grain, glass,
 * the cast and the G2 proof chip. Values come from the Trophy Daylight design
 * system (tokens.json and the dl- classes in components/bundle.css); keep the
 * two in step when a token changes.
 */
import type React from "react";
import { loadFont as loadDisplayFont } from "../fonts/FunnelDisplay";
import { loadFont as loadSansFont } from "../fonts/FunnelSans";
import { loadFont as loadMonoFont } from "../fonts/SplineSansMono";
import { G2Rating } from "../components/G2Rating";
import { BUST, HAIR, HEAD, PEOPLE, type PersonKey } from "../og/people";
import { personDots } from "../og/person-dots";
import type { Sky } from "../og/constants";

export const { fontFamily: displayFont } = loadDisplayFont("normal", {
  weights: ["400"],
  subsets: ["latin", "latin-ext"],
});
export const { fontFamily: sansFont } = loadSansFont("normal", {
  weights: ["400", "500"],
  subsets: ["latin", "latin-ext"],
});
export const { fontFamily: monoFont } = loadMonoFont("normal", {
  weights: ["400", "500"],
  subsets: ["latin", "latin-ext"],
});

/** Light-theme tokens (a published image never follows the viewer's theme) */
export const DL = {
  ink: "#16161d",
  inkMuted: "#4a4954",
  ember: "#b8401a",
  glow: "#f7b062",
  mistRaised: "#ffffff",
  glassStrong: "rgba(255,255,255,0.84)",
  glassEdge: "rgba(255,255,255,0.9)",
  shadowGlass:
    "0 30px 60px -30px rgba(60,40,70,0.35), inset 0 1px 0 rgba(255,255,255,0.8)",
  onSky: "#16161d",
  onSkyMuted: "#34333c",
  onNight: "#f2f1f6",
  onNightMuted: "#c9c8d6",
  figure: "#2a2433",
  figureNight: "#070816",
  rimDay: "#fff4e6",
  sky: {
    dawn: ["#c9c2ee", "#f8c8ae"],
    morning: ["#bcd9f4", "#f6f1e3"],
    noon: ["#92c3f3", "#eaf4fc"],
    afternoon: ["#e8d9a1", "#b6c79b"],
    dusk: ["#f7b062", "#ec8476"],
    night: ["#2b2e66", "#0f1126"],
  } satisfies Record<Sky, [string, string]>,
} as const;

/** A hex colour at an alpha: what color-mix(in oklab, X n%, transparent) gives */
const a = (hex: string, alpha: number) => {
  const n = parseInt(hex.slice(1), 16);
  return `rgba(${(n >> 16) & 255},${(n >> 8) & 255},${n & 255},${alpha})`;
};

/** The six skies, as .dl-sky--<hour> draws them */
const SKY_IMAGE: Record<Sky, string> = {
  dawn: `radial-gradient(70% 90% at 12% 8%, ${DL.sky.dawn[0]} 0%, transparent 70%), radial-gradient(80% 90% at 92% 100%, ${DL.sky.dawn[1]} 0%, transparent 70%), radial-gradient(40% 50% at 88% 12%, ${a(DL.sky.morning[0], 0.7)} 0%, transparent 70%), linear-gradient(170deg, ${DL.sky.dawn[0]}, ${DL.sky.dawn[1]})`,
  morning: `radial-gradient(70% 80% at 85% 10%, ${DL.sky.morning[0]} 0%, transparent 70%), radial-gradient(60% 70% at 8% 100%, ${a(DL.sky.dawn[1], 0.55)} 0%, transparent 70%), linear-gradient(175deg, ${DL.sky.morning[0]}, ${DL.sky.morning[1]})`,
  noon: `radial-gradient(60% 60% at 50% 55%, ${DL.sky.noon[1]} 0%, transparent 70%), radial-gradient(70% 80% at 0% 0%, ${DL.sky.noon[0]} 0%, transparent 70%), linear-gradient(180deg, ${DL.sky.noon[0]}, ${DL.sky.noon[1]})`,
  afternoon: `radial-gradient(60% 70% at 85% 5%, ${a(DL.sky.morning[0], 0.8)} 0%, transparent 70%), radial-gradient(70% 80% at 10% 15%, ${DL.sky.afternoon[0]} 0%, transparent 70%), radial-gradient(80% 80% at 90% 100%, ${DL.sky.afternoon[1]} 0%, transparent 70%), linear-gradient(165deg, ${DL.sky.afternoon[0]}, ${DL.sky.afternoon[1]})`,
  dusk: `radial-gradient(60% 70% at 85% 0%, ${a(DL.sky.dawn[1], 0.85)} 0%, transparent 70%), radial-gradient(70% 80% at 8% 20%, ${DL.sky.dusk[0]} 0%, transparent 70%), radial-gradient(80% 90% at 75% 100%, ${DL.sky.dusk[1]} 0%, transparent 70%), radial-gradient(50% 60% at 30% 90%, ${a(DL.sky.afternoon[0], 0.7)} 0%, transparent 70%), linear-gradient(160deg, ${DL.sky.dusk[0]}, ${DL.sky.dusk[1]})`,
  night: `radial-gradient(60% 50% at 80% 105%, ${a(DL.sky.dusk[1], 0.45)} 0%, transparent 70%), radial-gradient(70% 80% at 15% 0%, ${DL.sky.night[0]} 0%, transparent 70%), linear-gradient(175deg, ${DL.sky.night[0]}, ${DL.sky.night[1]})`,
};

/** The whole day, midnight to midnight, left to right (SocialAssets' personal header) */
const DAY_IMAGE = `linear-gradient(90deg, ${DL.sky.night[1]} 0%, ${DL.sky.night[0]} 17%, ${DL.sky.dawn[0]} 22%, ${DL.sky.dawn[1]} 26%, ${DL.sky.morning[0]} 34%, ${DL.sky.noon[0]} 48%, ${DL.sky.noon[1]} 55%, ${DL.sky.afternoon[0]} 68%, ${DL.sky.dusk[0]} 79%, ${DL.sky.dusk[1]} 84%, ${DL.sky.night[0]} 92%, ${DL.sky.night[1]} 100%)`;

const GRAIN = `url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='180' height='180'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2' stitchTiles='stitch'/><feColorMatrix type='saturate' values='0'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>")`;

/** Film grain over a sky (grain-opacity 0.22, overlay) */
export const Grain: React.FC = () => (
  <div
    style={{
      position: "absolute",
      inset: 0,
      opacity: 0.22,
      mixBlendMode: "overlay",
      backgroundImage: GRAIN,
      pointerEvents: "none",
    }}
  />
);

/** A full-bleed sky of one hour, or the whole day, with its grain */
export const SkyFill: React.FC<{ sky: Sky | "day" }> = ({ sky }) => (
  <>
    <div
      style={{
        position: "absolute",
        inset: 0,
        backgroundColor: DL.sky.noon[1],
        backgroundImage: sky === "day" ? DAY_IMAGE : SKY_IMAGE[sky],
      }}
    />
    <Grain />
  </>
);

/** The sun dot: the only pictorial mark, "a moment in a customer's day" */
export const Sun: React.FC<{ size?: number }> = ({ size = 10 }) => (
  <span
    style={{
      width: size,
      height: size,
      borderRadius: "50%",
      background: DL.glow,
      boxShadow: `0 0 0 ${Math.round(size * 0.375)}px ${a(DL.glow, 0.35)}`,
      flex: "none",
    }}
  />
);

/** Mono uppercase kicker, labelling the sky with its time */
export const Eyebrow: React.FC<{
  children: React.ReactNode;
  size?: number;
  color?: string;
}> = ({ children, size = 15, color = DL.onSkyMuted }) => (
  <div
    style={{
      display: "flex",
      alignItems: "center",
      gap: Math.round(size * 0.66),
      fontFamily: monoFont,
      fontWeight: 500,
      fontSize: size,
      lineHeight: `${Math.round(size * 1.33)}px`,
      letterSpacing: "0.06em",
      textTransform: "uppercase",
      color,
      whiteSpace: "nowrap",
    }}
  >
    <Sun size={Math.round(size * 0.6)} />
    {children}
  </div>
);

/** glass-strong pill: the G2 mark and its stars */
export const G2Chip: React.FC<{ rating: number; scale?: number }> = ({
  rating,
  scale = 1,
}) => (
  <div
    style={{
      display: "inline-flex",
      alignItems: "center",
      height: 48 * scale,
      padding: `0 ${18 * scale}px 0 ${12 * scale}px`,
      borderRadius: 999,
      background: DL.glassStrong,
      border: `1px solid ${DL.glassEdge}`,
      boxShadow: DL.shadowGlass,
      backdropFilter: "blur(24px) saturate(1.25)",
      boxSizing: "border-box",
    }}
  >
    <G2Rating rating={rating} starSize={22 * scale} markSize={28 * scale} />
  </div>
);

/** The site's highlight colour per sky (web: src/styles/dl/accents.css) */
export const ACCENT: Record<Sky, string> = {
  dawn: "#8a3f8f",
  morning: "#2c5f9e",
  noon: "#1d5fa8",
  afternoon: "#5c6914",
  dusk: "#b8401a",
  night: "#a9a8ff",
};

export type Treatment = "dots" | "backlit";

/**
 * One of the cast, rising from the bottom edge and facing left. "dots" is the
 * data portrait the site and OG images use; "backlit" is the figure in shadow
 * rimmed by its hour, as in the design system's SocialAssets.
 */
export const Person: React.FC<{
  who: PersonKey;
  height: number;
  right: number;
  /** Distance from the frame's bottom, where the visible area ends above it */
  bottom?: number;
  sky: Sky;
  treatment?: Treatment;
}> = ({ who, height, right, bottom = 0, sky, treatment = "dots" }) => {
  const width = (height * 120) / 140;
  const night = sky === "night";
  const style: React.CSSProperties = {
    position: "absolute",
    right,
    bottom,
    overflow: "visible",
  };

  if (treatment === "dots") {
    const ink = night ? DL.onNight : DL.onSky;
    const glow = night ? "#ffc27a" : DL.glow;
    return (
      <svg width={width} height={height} viewBox="0 0 120 140" style={style}>
        {personDots(who).map((d, i) => (
          <circle key={i} cx={d.x} cy={d.y} r={d.r} fill={ink} fillOpacity={d.o} />
        ))}
        {/* The one point lit where the agent acted */}
        <circle cx={60} cy={122} r={9} fill={glow} fillOpacity={0.12} />
        <circle cx={60} cy={122} r={5.5} fill={glow} fillOpacity={0.3} />
        <circle cx={60} cy={122} r={3} fill={glow} />
      </svg>
    );
  }

  const p = PEOPLE[who];
  const dayLight = sky === "morning" || sky === "noon";
  const body = night ? DL.figureNight : DL.figure;
  const rim = night ? DL.sky.noon[0] : dayLight ? DL.rimDay : DL.glow;
  const shape = (
    <>
      <path
        d={BUST}
        transform={`translate(66 0) scale(${p.wide} 1) translate(-66 0)`}
      />
      <g transform={`rotate(${p.tilt} 66 100)`}>
        <path d={HEAD} />
        {HAIR[p.hair].map((s, i) =>
          "d" in s ? <path key={i} d={s.d} /> : <circle key={i} {...s} />,
        )}
      </g>
    </>
  );
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 120 140"
      style={{
        ...style,
        filter: `drop-shadow(0 0 12px ${a(rim, night ? 0.55 : 0.6)})`,
      }}
    >
      <g fill={rim} transform="translate(-1.8 -1.6)" style={{ filter: "blur(1.2px)" }}>
        {shape}
      </g>
      <g fill={body}>{shape}</g>
    </svg>
  );
};

/** The Trophy mark alone (the two steps), from the logo's own paths */
export const TrophyMark: React.FC<{ size: number; color: string }> = ({
  size,
  color,
}) => (
  <svg width={size} height={size} viewBox="10 27.5 100 100">
    <path
      fill={color}
      d="M11.382 72.316H65.185V126.119H41.685V95.816H11.382ZM54.816 28.882H108.619V82.685H85.119V52.381H54.816Z"
    />
  </svg>
);
