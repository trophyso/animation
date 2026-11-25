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
  oneAgent: 6.8,
  fanOut: 9.2,
  decision: 12.0,
  push: 16.5,
  chart: 19.5,
  outro: 25.6,
  end: 29.5,
} as const;

/** Video time (s) where the voiceover file starts playing */
export const VO_OFFSET = 0.25;

type Word = { w: string; s: number; e: number; section: number; n: string };
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

/** A file time in the take to video seconds: the take plays as one continuous file, never split or spaced out */
const fileToVideo = (t: number): number => VO_OFFSET + t;

const timeOf = (ref: VoiceRef, index: number): number => {
  const w = WORDS[index + (ref.word ?? 0)];
  return fileToVideo(ref.edge === "end" ? w.e : w.s) + (ref.offset ?? 0);
};

type Pin = VoiceRef & {
  /** The visual moment, source clock */
  at: number;
  /** A still moment before `at` where the animation can wait */
  holdAt: number;
  /** If the voice is ahead, drop up to this many seconds of still time after `holdAt` */
  cut?: number;
  why: string;
};

/**
 * The video follows the voice. Each pin ties a visual moment (`at`, source
 * clock) to a phrase in the take. The animation holds at `holdAt` until the
 * voice gets there. Where the voice is ahead, `cut` drops still time first,
 * and anything still early is reported in SYNC_EARLY (fix it by tightening the
 * animation; the voice is never paused).
 *
 * Pins run in script order. The first word of a paragraph absorbs the pause
 * before it in the alignment, so pins name a later word with a negative offset.
 */
export const SYNC: Pin[] = [
  // S1 · the same sequence: the users spring from step to step with the read
  { at: 1.2, holdAt: 1.1, say: "every user", why: 'the users spring to Day 1 on "…send every user"' },
  { at: 2.5, holdAt: 2.4, say: "same steps", why: 'the users spring to Day 3 on "Same steps"' },
  { at: 3.35, holdAt: 3.3, say: "same timing", why: 'the users spring to Day 7 on "Same timing"' },
  { at: 4.6, holdAt: 4.0, cut: 0.3, say: "same message", why: 'the users spring to Day 14 on "Same message"' },
  // S2 · the title (the first scene has lifted away by 5.66; only the rail is left): the agent drops onto the rail and floods the frame; "…for each user" lands with the read
  { at: 6.8, holdAt: 5.75, cut: 1.05, say: "deploys", offset: -0.3, why: 'the agent drops onto the rail just before "Trophy deploys"' },
  { at: 7.95, holdAt: 7.9, say: "for each user", offset: -0.1, why: 'the accent line lands on "…for each user"' },
  // S3 · the split paths: the title clears into the agent node, and each user's message pops in
  { at: 9.0, holdAt: 8.6, cut: 0.3, say: "that creates", offset: -0.3, why: 'the title clears just before "that creates…"' },
  { at: 11.24, holdAt: 10.9, say: "just for them", word: 2, edge: "end", offset: 0, why: 'the paths hold through "…just for them!", then swell into the next scene' },
  // S4 · Mei: the voice waits for her card; the chart draws on "sessions"; the ring lands on "push"
  // The frame is solid indigo from 11.4 (the swell) until her card starts forming at 11.94; her details fade in from 12.6
  { at: 12.6, holdAt: 11.42, cut: 0.5, say: "agent sees", offset: -0.25, why: 'Mei\'s card fills in on "Mei\'s agent…"' },
  { at: 13.6, holdAt: 13.55, say: "sessions are getting shorter", why: 'her session chart draws on "sessions are getting shorter"' },
  { at: 15.0, holdAt: 14.55, say: "picks push", word: 1, offset: -0.08, why: 'the ring lands on Push on "push"' },
  // S6 · the result. The decision is still between the ring settling on Push (15.32) and its exit (16.15)
  { at: 19.6, holdAt: 15.6, cut: 0.7, say: "agents achieve", offset: -0.4, why: 'the chart starts drawing on "Trophy\'s agents…"' },
  // S7 · close. The chart is still between the grey label landing (22.35) and its exit (25.22)
  { at: 25.7, holdAt: 22.6, cut: 2.5, say: "sending generic", offset: -0.4, why: 'the statement writes in on "Stop sending…"' },
  { at: 27.3, holdAt: 26.6, cut: 0.6, say: "users ignore", word: 1, edge: "end", offset: 0, why: 'the statement clears after "…users ignore."' },
  { at: 27.55, holdAt: 27.5, say: "a demo", offset: -0.45, why: 'the logo pops just before "Book a demo"' },
  { at: 29.1, holdAt: 28.12, say: "messaging tools", word: 1, why: 'the click lands on "tools!"' },
  { at: 29.5, holdAt: 29.45, say: "messaging tools", word: 1, edge: "end", offset: 1.8, why: "trophy.so stays up after the last word" },
];

/** Seconds inserted (or, if negative, still time dropped) at source time `at`; everything scheduled from then on shifts */
export const HOLDS: { at: number; extra: number; why: string }[] = [];
/** Pins the voice reaches before the animation can */
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
    // Voice ahead: drop still time
    const extra = Math.max(want, -(pin.cut ?? 0));
    if (want - extra < -0.05) SYNC_EARLY.push(`${pin.why}: voice is ${(extra - want).toFixed(2)} s early`);
    HOLDS.push({ at: pin.holdAt, extra, why: pin.why });
  }
}


/** Video time (s) of a phrase in the voiceover, or `fallback` if there is no take or no match */
export const voiceTime = (ref: VoiceRef, fallback: number): number => {
  const i = findPhrase(ref.say);
  return i < 0 ? fallback : timeOf(ref, i);
};

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
  /** What the sequence sends everyone at each step */
  sequence: [
    { channel: "Email", title: "Welcome to the app!", body: "Here’s everything you need to get started." },
    { channel: "Push", title: "Time to come back!", body: "Pick up where you left off today." },
    { channel: "Push", title: "We miss you!", body: "It’s been a while. Come back and play." },
    { channel: "Email", title: "20% off, today only", body: "Upgrade now before the offer ends." },
  ],
  samePath: "Your lifecycle marketing tools send every user down the same path",
  /** What each user's agent decided, from the website's user stories */
  users: [
    { initial: "M", name: "Mei", channel: "Push · 07:15", title: "Ready for a harder puzzle, Mei?", body: "Today’s expert pack is a step up." },
    { initial: "J", name: "Joe", channel: "Push · 19:30", title: "Still thinking about Rome?", body: "Your two shortlisted flights are still available." },
    { initial: "A", name: "Aisha", channel: "Email · 17:00", title: "Ultra is here before your exams", body: "You’ve hit your study limit 3 times in two weeks." },
    { initial: "L", name: "Leo", channel: "Nothing sent", title: "Studying daily anyway", body: "His agent saves the channel for when it counts.", quiet: true },
    { initial: "E", name: "Ellie", channel: "Email · 07:30", title: "20 points from Gold", body: "Double points this weekend gets you there." },
  ],
  /** The last line is the light-indigo accent */
  oneAgent: ["Trophy deploys", "an AI lifecycle", "marketing agent", "for each user"],
  mei: {
    initial: "M",
    name: "Mei",
    sub: "Wordplay · New York",
    rows: [
      { label: "Streak", value: "14 days" },
      { label: "Sessions", value: "Getting shorter", trend: true },
      { label: "Usually plays", value: "Before 7:30am" },
    ],
    /** Minutes per session over her 14-day streak */
    sessions: [9.2, 8.7, 9.4, 8.9, 8.4, 8.8, 7.9, 7.5, 7.7, 6.6, 5.8, 5.1, 4.0, 3.1],
  },
  options: [
    { kicker: "Not picked", title: "Email" },
    { kicker: "Sent 07:15", title: "Push" },
    { kicker: "If unseen", title: "In-app" },
  ],
  /** The notification the agent wrote: {braces} mark the variables it chose */
  push: {
    app: "Wordplay",
    time: "07:15",
    title: "Ready for a {harder puzzle}, Mei?",
    body: "You’ve been {breezing through}. Today’s {expert pack} is a step up from your usual.",
    why: "Sent at 07:15, before Mei usually plays",
  },
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
