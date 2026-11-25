/**
 * "One agent per user": the explainer rebuilt from the Arcade recording, told
 * through one user story at a time. This file holds what every video shares:
 * the canvas, the fixed colours, the source clock the scenes are written on,
 * and the shared copy. The story (stories.ts), the ground (ground.ts) and the
 * voice take come in through the video context (video.tsx); timeline.ts maps
 * the source clock onto the voice.
 */

export const FPS = 60;
export const f = (s: number): number => Math.round(s * FPS);

export const W = 1920;
export const H = 1080;

/**
 * Colours sampled from the source frames, for things that look the same on
 * every ground: cards and the copy on them. The theme colour and what sits
 * directly on the ground (headlines, rails, lines) come from the Ground.
 */
export const C = {
  ink: "#101012",
  card: "#fdfdfd",
  divider: "#e9e9e9",
  textSub: "#505052",
  textRow: "#454549",
  textValue: "#262628",
  textBody: "#4d4d53",
  labelMuted: "#858583",
  rail: "#b4b3c1",
  fadedLabel: "#bdc3c5",
  fadedTitle: "#9aa0a6",
} as const;

export const SHADOW_CARD = "0 30px 60px -24px rgba(40,60,110,0.22), 0 2px 6px rgba(40,60,110,0.06)";
export const SHADOW_PILL = "0 8px 20px -10px rgba(22,22,29,0.3)";

/** Scene boundaries, seconds on the source clock (measured from a 10 fps pass) */
export const SOURCE_CUE = {
  samePath: 0,
  oneAgent: 6.8,
  fanOut: 9.2,
  decision: 12.0,
  message: 16.5,
  chart: 19.5,
  outro: 25.6,
  end: 29.5,
} as const;

export type SceneName = Exclude<keyof typeof SOURCE_CUE, "end">;

/** Video time (s) where the voiceover file starts playing */
export const VO_OFFSET = 0.25;

/** Ease-in for exits that accelerate away */
export const EASE_IN = [0.5, 0, 0.9, 0.4] as const;

/** The copy every story shares */
export const COPY = {
  nodes: [
    { day: "Day 1", sub: "Welcome" },
    { day: "Day 3", sub: "Reminder" },
    { day: "Day 7", sub: "We miss you" },
    { day: "Day 14", sub: "Discount" },
  ],
  /** What the sequence sends everyone at each step */
  sequence: [
    { channel: "Email", title: "Welcome to the app!", body: "Here’s everything you need to get started." },
    { channel: "Push", title: "Time to come back!", body: "Pick up where you left off today." },
    { channel: "Push", title: "We miss you!", body: "It’s been a while. Come back and play." },
    { channel: "Email", title: "20% off, today only", body: "Upgrade now before the offer ends." },
  ],
  samePath: "Your messaging tools send every user down the same path",
  /** The last line is the accent line (light theme colour on the flood) */
  oneAgent: ["Trophy deploys", "an AI lifecycle", "marketing agent", "for each user"],
  /** The result is the same for every story: the only figure there's data for */
  chart: {
    figure: 40,
    caption: "better engagement",
    agent: "With Trophy's AI agent",
    baseline: "With sequences",
  },
  statement: ["Stop sending generic", "messages users ignore."],
  cta: "Book a demo",
  domain: "trophy.so",
} as const;
