// Mirrors the web repo's src/og/constants.ts and the sky list in src/lib/sky.ts;
// keep them in sync.

export const OG_SIZE = {
  width: 1200,
  height: 630,
} as const;

/** The skies, in the order of the day */
export const SKIES = [
  "dawn",
  "morning",
  "noon",
  "afternoon",
  "dusk",
  "night",
] as const;
export type Sky = (typeof SKIES)[number];

/** The pre-rendered sky behind each image (copied from web's src/og/assets) */
export const skyAsset = (sky: Sky) => `og/sky-${sky}.jpg`;

/** Text and the lit point, by sky (Trophy Daylight's on-sky / on-night and glow tokens) */
export const OG_INK = {
  day: { text: "#16161d", muted: "#34333c", glow: "#f7b062" },
  night: { text: "#f2f1f6", muted: "#c9c8d6", glow: "#ffc27a" },
} as const;
