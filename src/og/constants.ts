// Mirrors the web repo's src/og/constants.ts, src/lib/sky.ts and the sky
// tokens / gradients in src/styles/dl/{tokens,sky,surfaces}.css; keep in sync.

/**
 * Blog feature images are 16:10, the aspect the web repo's post cards
 * (.dl-postcard__thumb) crop to, so nothing is cut off there. The same image is
 * the post's og:image, which social sites crop to ~1.91:1 or 2:1 (up to 100px
 * off the top and bottom here), so the logo and footer sit inside that band.
 */
export const THUMBNAIL_SIZE = {
  width: 1600,
  height: 1000,
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

/** Daylight's sky tokens (tokens.css) */
const T = {
  dawnFrom: "#c9c2ee",
  dawnTo: "#f8c8ae",
  morningFrom: "#bcd9f4",
  morningTo: "#f6f1e3",
  noonFrom: "#92c3f3",
  noonTo: "#eaf4fc",
  afternoonFrom: "#e8d9a1",
  afternoonTo: "#b6c79b",
  duskFrom: "#f7b062",
  duskTo: "#ec8476",
  nightFrom: "#2b2e66",
  nightTo: "#0f1126",
};

const mix = (color: string, pct: number) =>
  `color-mix(in oklab, ${color} ${pct}%, transparent)`;

/** Each sky's background (sky.css .dl-sky--<sky>) */
export const SKY_BACKGROUND: Record<
  Sky,
  { backgroundColor: string; backgroundImage: string }
> = {
  dawn: {
    backgroundColor: T.noonTo,
    backgroundImage: [
      `radial-gradient(70% 90% at 12% 8%, ${T.dawnFrom} 0%, transparent 70%)`,
      `radial-gradient(80% 90% at 92% 100%, ${T.dawnTo} 0%, transparent 70%)`,
      `radial-gradient(40% 50% at 88% 12%, ${mix(T.morningFrom, 70)} 0%, transparent 70%)`,
      `linear-gradient(170deg, ${T.dawnFrom}, ${T.dawnTo})`,
    ].join(", "),
  },
  morning: {
    backgroundColor: T.noonTo,
    backgroundImage: [
      `radial-gradient(70% 80% at 85% 10%, ${T.morningFrom} 0%, transparent 70%)`,
      `radial-gradient(60% 70% at 8% 100%, ${mix(T.dawnTo, 55)} 0%, transparent 70%)`,
      `linear-gradient(175deg, ${T.morningFrom}, ${T.morningTo})`,
    ].join(", "),
  },
  noon: {
    backgroundColor: T.noonTo,
    backgroundImage: [
      `radial-gradient(60% 60% at 50% 55%, ${T.noonTo} 0%, transparent 70%)`,
      `radial-gradient(70% 80% at 0% 0%, ${T.noonFrom} 0%, transparent 70%)`,
      `linear-gradient(180deg, ${T.noonFrom}, ${T.noonTo})`,
    ].join(", "),
  },
  afternoon: {
    backgroundColor: T.noonTo,
    backgroundImage: [
      `radial-gradient(60% 70% at 85% 5%, ${mix(T.morningFrom, 80)} 0%, transparent 70%)`,
      `radial-gradient(70% 80% at 10% 15%, ${T.afternoonFrom} 0%, transparent 70%)`,
      `radial-gradient(80% 80% at 90% 100%, ${T.afternoonTo} 0%, transparent 70%)`,
      `linear-gradient(165deg, ${T.afternoonFrom}, ${T.afternoonTo})`,
    ].join(", "),
  },
  dusk: {
    backgroundColor: T.noonTo,
    backgroundImage: [
      `radial-gradient(60% 70% at 85% 0%, ${mix(T.dawnTo, 85)} 0%, transparent 70%)`,
      `radial-gradient(70% 80% at 8% 20%, ${T.duskFrom} 0%, transparent 70%)`,
      `radial-gradient(80% 90% at 75% 100%, ${T.duskTo} 0%, transparent 70%)`,
      `radial-gradient(50% 60% at 30% 90%, ${mix(T.afternoonFrom, 70)} 0%, transparent 70%)`,
      `linear-gradient(160deg, ${T.duskFrom}, ${T.duskTo})`,
    ].join(", "),
  },
  night: {
    backgroundColor: T.nightTo,
    backgroundImage: [
      `radial-gradient(60% 50% at 80% 105%, ${mix(T.duskTo, 45)} 0%, transparent 70%)`,
      `radial-gradient(70% 80% at 15% 0%, ${T.nightFrom} 0%, transparent 70%)`,
      `linear-gradient(175deg, ${T.nightFrom}, ${T.nightTo})`,
    ].join(", "),
  },
};

/** Film grain over the sky (surfaces.css .dl-grain::after, --grain-opacity) */
export const GRAIN = {
  opacity: 0.8,
  backgroundImage:
    "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='180' height='180'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
};

/** Text and the lit point, by sky (Trophy Daylight's on-sky / on-night and glow tokens) */
export const OG_INK = {
  day: { text: "#16161d", muted: "#34333c", glow: "#f7b062" },
  night: { text: "#f2f1f6", muted: "#c9c8d6", glow: "#ffc27a" },
} as const;
