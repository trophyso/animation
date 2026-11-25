/**
 * Trophy Daylight tokens for video. Values are copied 1:1 from the web repo's
 * src/styles/dl/tokens.css and accents.css (2026-11-20). Day is the light
 * theme; Night applies only to content sitting on the night sky.
 */
export type Sky = "dawn" | "morning" | "noon" | "afternoon" | "dusk" | "night";
export type ThemeName = "day" | "night";

export const SKIES: readonly Sky[] = ["dawn", "morning", "noon", "afternoon", "dusk", "night"];

/** The design system's hour for each sky */
export const SKY_HOUR: Record<Sky, string> = {
  dawn: "05:40",
  morning: "08:10",
  noon: "12:30",
  afternoon: "16:50",
  dusk: "19:40",
  night: "22:10",
};

/** Each sky's two gradient stops (from, to) */
export const SKY_PAIRS: Record<Sky, readonly [string, string]> = {
  dawn: ["#c9c2ee", "#f8c8ae"],
  morning: ["#bcd9f4", "#f6f1e3"],
  noon: ["#92c3f3", "#eaf4fc"],
  afternoon: ["#e8d9a1", "#b6c79b"],
  dusk: ["#f7b062", "#ec8476"],
  night: ["#2b2e66", "#0f1126"],
};

export type Theme = {
  name: ThemeName;
  bg: string;
  raised: string;
  ink: string;
  inkMuted: string;
  inkSubtle: string;
  muted: string;
  border: string;
  borderStrong: string;
  glow: string;
  positive: string;
  negative: string;
  caution: string;
  onPrimary: string;
  glass: string;
  glassStrong: string;
  glassEdge: string;
  shadowGlass: string;
  shadowPill: string;
  skyInk: string;
  skyInkMuted: string;
  data: readonly [string, string, string];
};

export const THEME: Record<ThemeName, Theme> = {
  day: {
    name: "day",
    bg: "#f6f5f1",
    raised: "#ffffff",
    ink: "#16161d",
    inkMuted: "#4a4954",
    inkSubtle: "#676670",
    muted: "#eceae4",
    border: "#e1ded7",
    borderStrong: "#8b8882",
    glow: "#f7b062",
    positive: "#0f7a63",
    negative: "#b53a2b",
    caution: "#8a6200",
    onPrimary: "#ffffff",
    glass: "rgba(255,255,255,0.64)",
    glassStrong: "rgba(255,255,255,0.84)",
    glassEdge: "rgba(255,255,255,0.9)",
    shadowGlass: "0 30px 60px -30px rgba(60,40,70,0.35), inset 0 1px 0 rgba(255,255,255,0.8)",
    shadowPill: "0 6px 16px -8px rgba(22,22,29,0.35)",
    skyInk: "#16161d",
    skyInkMuted: "#34333c",
    data: ["#2f3487", "#6168c4", "#9ea3e3"],
  },
  night: {
    name: "night",
    bg: "#0e0f1a",
    raised: "#171927",
    ink: "#f2f1f6",
    inkMuted: "#b5b4c3",
    inkSubtle: "#8e8da0",
    muted: "#090a12",
    border: "#272a3c",
    borderStrong: "#6b6f88",
    glow: "#ffc27a",
    positive: "#5ed1b3",
    negative: "#ff8473",
    caution: "#e8b850",
    onPrimary: "#16161d",
    glass: "rgba(23,25,39,0.78)",
    glassStrong: "rgba(23,25,39,0.9)",
    glassEdge: "rgba(255,255,255,0.14)",
    shadowGlass: "0 30px 60px -30px rgba(0,0,0,0.7), inset 0 1px 0 rgba(255,255,255,0.08)",
    shadowPill: "0 6px 16px -8px rgba(0,0,0,0.6)",
    skyInk: "#f2f1f6",
    skyInkMuted: "#c9c8d6",
    data: ["#c7cbff", "#8d93e6", "#5a60b4"],
  },
};

/** The accent follows the sky: [primary, primaryMuted] per hour, Day and Night shades */
export const ACCENTS: Record<ThemeName, Record<Sky, readonly [string, string]>> = {
  day: {
    dawn: ["#8a3f8f", "#f3e6f4"],
    morning: ["#2c5f9e", "#e2ecf7"],
    noon: ["#1d5fa8", "#deebf8"],
    afternoon: ["#5c6914", "#ecefd6"],
    dusk: ["#b8401a", "#fbe5da"],
    night: ["#4a47b0", "#e7e6f7"],
  },
  night: {
    dawn: ["#e4a6e8", "#3a2140"],
    morning: ["#8fbdf2", "#1a2a40"],
    noon: ["#7fbaf5", "#172b44"],
    afternoon: ["#c9d77a", "#2c3014"],
    dusk: ["#ff8e5e", "#3a1e16"],
    night: ["#a9a8ff", "#24234a"],
  },
};

export const themeForSky = (sky: Sky): ThemeName => (sky === "night" ? "night" : "day");
export const themeOf = (sky: Sky): Theme => THEME[themeForSky(sky)];
/** [primary, primaryMuted] for a sky on its own theme */
export const accentFor = (sky: Sky, theme: ThemeName = themeForSky(sky)) => ACCENTS[theme][sky];

/** Daylight radii (px at 1x) */
export const RADIUS = {
  tile: 8,
  well: 12,
  week: 14,
  card: 16,
  widget: 20,
  panel: 24,
  hero: 28,
  pill: 9999,
} as const;

export type Bez = readonly [number, number, number, number];
/** The site's easing curves */
export const EASE = {
  OUT: [0.16, 1, 0.3, 1] as Bez,
  MOVE: [0.22, 1, 0.36, 1] as Bez,
  SOFT: [0.45, 0, 0.55, 1] as Bez,
  IN_OUT: [0.42, 0, 0.58, 1] as Bez,
};

/** A hex colour at an alpha */
export const alpha = (hex: string, a: number): string => {
  const n = parseInt(hex.slice(1), 16);
  return `rgba(${(n >> 16) & 255},${(n >> 8) & 255},${n & 255},${a})`;
};
