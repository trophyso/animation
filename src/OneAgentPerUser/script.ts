/**
 * "One AI lifecycle agent per user": an explainer rebuilt from the Arcade recording,
 * stretched with holds (SYNC) to follow the voiceover. 60 fps, 1920x1080. Scene timings are
 * the source's, in seconds; at() maps them onto the video clock.
 */
import { VOICEOVER } from "./voiceover/timings";

export const FPS = 60;
export const f = (s: number): number => Math.round(s * FPS);

export const W = 1920;
export const H = 1080;

/** Colours sampled from the source frames */
export const C = {
  bg: "#e7f2fb",
  ink: "#101012",
  indigo: "#4136c8",
  indigoLight: "#7877f6",
  onIndigo: "#ecf6ff",
  rail: "#b4b3c1",
  walker: "#8a867f",
  labelStrong: "#42434f",
  labelMuted: "#858583",
  card: "#fdfdfd",
  divider: "#e9e9e9",
  textSub: "#505052",
  textRow: "#454549",
  textValue: "#262628",
  textBody: "#4d4d53",
  avatarBg: "#ddebf3",
  avatarInk: "#3b5f93",
  steel: "#2c5793",
  steelText: "#305985",
  fadedLabel: "#bdc3c5",
  fadedTitle: "#9aa0a6",
  sequences: "#89857e",
  button: "#131619",
  glow: "#bad7f0",
} as const;

export const SHADOW_CARD = "0 30px 60px -24px rgba(40,60,110,0.22), 0 2px 6px rgba(40,60,110,0.06)";
export const SHADOW_PILL = "0 8px 20px -10px rgba(22,22,29,0.3)";

/** Scene boundaries, seconds on the source clock (measured from a 10 fps pass) */
export const SOURCE_CUE = {
  samePath: 0,
  fanOut: 6.8,
  oneAgent: 9.0,
  decision: 12.0,
  push: 16.8,
  chart: 19.5,
  outro: 25.6,
  end: 29.5,
} as const;

/** Video time (s) where the voiceover file starts playing */
export const VO_OFFSET = 0.25;

type Word = { w: string; s: number; e: number; n: string };
const norm = (w: string) => w.toLowerCase().replace(/[^a-z0-9']/g, "");
const WORDS: Word[] = (VOICEOVER?.words ?? []).map((w) => ({ ...w, n: norm(w.w) })).filter((w) => w.n);

/** Index of the first word of `phrase` in the take, searching from word `from` */
const findPhrase = (phrase: string, from = 0): number => {
  const want = phrase.split(/\s+/).map(norm).filter(Boolean);
  for (let i = from; i + want.length <= WORDS.length; i++) {
    if (want.every((p, k) => WORDS[i + k].n === p)) return i;
  }
  return -1;
};

type VoiceRef = {
  /** Words as spoken in script.txt (case and punctuation ignored) */
  say: string;
  /** Which word of the phrase to time (default 0, the first) */
  word?: number;
  /** Time its start (default) or its end */
  edge?: "start" | "end";
  /** Seconds added to the word's time */
  offset?: number;
};

const timeOf = (ref: VoiceRef, index: number): number => {
  const w = WORDS[index + (ref.word ?? 0)];
  return VO_OFFSET + (ref.edge === "end" ? w.e : w.s) + (ref.offset ?? 0);
};

/** Video time (s) of a phrase in the voiceover, or `fallback` if there is no take or no match */
export const voiceTime = (ref: VoiceRef, fallback: number): number => {
  const i = findPhrase(ref.say);
  return i < 0 ? fallback : timeOf(ref, i);
};

/**
 * The video follows the voice. Each entry pins a visual moment (`at`, source
 * clock) to a phrase in the take; the animation holds at `holdAt` (a moment
 * when nothing is moving) for as long as it takes the voice to get there.
 * Where the voice is ahead, a pin with `cut` may instead drop up to that many
 * seconds of still time after `holdAt`.
 * Entries run in script order. Note the first word of each paragraph absorbs
 * the pause before it in the alignment, so pins use a later word and an offset.
 */
export const SYNC: (VoiceRef & { at: number; holdAt: number; cut?: number; why: string })[] = [
  { at: 5.75, holdAt: 5.6, say: "same message", why: '"We miss you!" pops on "Same message"' },
  { at: 6.8, holdAt: 6.25, say: "deploys", offset: -0.75, why: 'the paths split just before "Trophy deploys"' },
  { at: 9.0, holdAt: 8.3, say: "agent for each user", why: 'the "One AI lifecycle agent" title lands on "agent"' },
  { at: 11.86, holdAt: 11.5, say: "just for them", word: 2, edge: "end", offset: -0.1, why: 'the title lifts away as "…just for them!" ends' },
  { at: 15.0, holdAt: 14.0, say: "picks push", word: 1, offset: -0.08, why: 'the ring lands on Push on "push"' },
  { at: 19.6, holdAt: 18.5, say: "ai lifecycle marketing", offset: -0.45, why: 'the chart starts drawing on "Trophy\'s AI…"' },
  { at: 23.5, holdAt: 23.45, say: "than with sequences", why: 'the grey line draws on "than with sequences!"' },
  // The chart is still between the grey label landing (24.15) and its exit (25.22)
  { at: 25.7, holdAt: 24.25, cut: 0.9, say: "sending generic", offset: -0.4, why: 'the logo pops on "Stop sending…"' },
  { at: 28.0, holdAt: 27.3, say: "a demo", offset: -0.4, why: 'the button appears on "Book a demo"' },
  { at: 29.1, holdAt: 28.12, say: "messaging tools", word: 1, why: 'the click lands on "tools!"' },
  { at: 29.5, holdAt: 29.45, say: "messaging tools", word: 1, edge: "end", offset: 0.5, why: "a short tail after the last word" },
];

/** Seconds inserted (or, if negative, still time dropped) at source time `at`; everything scheduled from then on shifts */
export const HOLDS: { at: number; extra: number; why: string }[] = [];
/** Pins the voice reaches before the animation can (the hold would be negative) */
export const SYNC_EARLY: string[] = [];
{
  let cursor = 0;
  for (const pin of SYNC) {
    const i = findPhrase(pin.say, cursor);
    if (i < 0) {
      SYNC_EARLY.push(`"${pin.say}" not found in the take`);
      continue;
    }
    cursor = i;
    const sofar = HOLDS.reduce((t, h) => (pin.at >= h.at ? t + h.extra : t), pin.at);
    const want = timeOf(pin, i) - sofar;
    const extra = Math.max(want, -(pin.cut ?? 0));
    if (want - extra < -0.05) SYNC_EARLY.push(`${pin.why}: voice is ${(extra - want).toFixed(2)} s early`);
    HOLDS.push({ at: pin.holdAt, extra, why: pin.why });
  }
}

/** Source-clock seconds to video seconds */
export const warp = (s: number): number => HOLDS.reduce((t, h) => (s >= h.at ? t + h.extra : t), s);

/** Scene boundaries, seconds on the video clock */
export const CUE = Object.fromEntries(Object.entries(SOURCE_CUE).map(([k, v]) => [k, warp(v)])) as Record<
  keyof typeof SOURCE_CUE,
  number
>;

/** Frames from a scene's start to a source-clock time, so scenes keep using source timestamps */
export const at = (scene: keyof typeof CUE, s: number): number => f(warp(s) - CUE[scene]);

/** Frames from a scene's start to a video-clock time (e.g. from voiceTime) */
export const atVideo = (scene: keyof typeof CUE, s: number): number => f(s - CUE[scene]);

/** Ease-in for exits that accelerate away */
export const EASE_IN = [0.5, 0, 0.9, 0.4] as const;

export const TOTAL_FRAMES = f(CUE.end);

export const COPY = {
  nodes: [
    { day: "Day 1", sub: "Welcome" },
    { day: "Day 3", sub: "Reminder" },
    { day: "Day 7", sub: "We miss you" },
    { day: "Day 14", sub: "Discount" },
  ],
  samePath: "Every user gets the same sequence.",
  blast: "We miss you!",
  users: [
    { initial: "M", label: "Mei · push at 07:15" },
    { initial: "J", label: "Joe · email at 12:15" },
    { initial: "A", label: "Aisha · in-app card" },
    { initial: "L", label: "Leo · left alone today" },
    { initial: "E", label: "Ellie · push at 05:15" },
  ],
  /** The last line is the light-indigo accent */
  oneAgent: ["One AI", "lifecycle agent", "per user."],
  mei: {
    initial: "M",
    name: "Mei",
    sub: "Puzzle app · New York",
    rows: [
      { label: "Streak", value: "14 days" },
      { label: "Sessions", value: "Getting shorter", trend: true },
      { label: "Usually plays", value: "Before 7:30am" },
    ],
  },
  options: [
    { kicker: "Not picked", title: "Email" },
    { kicker: "Sent 07:15", title: "Push" },
    { kicker: "If unseen", title: "In-app" },
  ],
  push: {
    app: "Puzzle app · 07:15",
    title: "Two puzzles to beat your best week, Mei.",
    body: "A new hard pack just unlocked for you.",
  },
  chart: {
    figure: 40,
    caption: "better engagement",
    agent: "With Trophy's AI agent",
    baseline: "With sequences",
  },
  cta: "Book a demo",
} as const;
