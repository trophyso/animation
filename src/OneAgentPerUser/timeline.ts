/**
 * The video's clock for one story and one voice take. Scenes are written on a
 * fixed "source" clock (SOURCE_CUE, seconds); pins tie moments on it to
 * phrases in the take, and the timeline holds the animation (or drops still
 * time) so each moment lands on its phrase. The take always plays as one
 * continuous file from VO_OFFSET; it is never split or paused.
 */
import { SOURCE_CUE, VO_OFFSET, f, type SceneName } from "./script";
import type { Story, VoiceRef } from "./stories";
import type { VoiceoverTake } from "./voiceover/types";
import { WORD_STAGGER } from "./components/Words";

type Pin = VoiceRef & {
  /** The visual moment, source clock */
  at: number;
  /** A still moment before `at` where the animation can wait */
  holdAt: number;
  /** If the voice is ahead, drop up to this many seconds of still time after `holdAt` */
  cut?: number;
  /** Hold at least this long, even if the voice is ahead (time the animation needs) */
  minHold?: number;
  why: string;
};

/** The message scene's schedule, source clock (MessageScene) */
export const MESSAGE = {
  enter: 16.56,
  title: 16.85,
  /** The body starts this long after the title */
  bodyGap: 0.2,
  /** The why-line starts this long after the body */
  whyGap: 0.4,
  /** Still, fully written, until the exit */
  holdAt: 19.2,
  exit: 19.3,
  /** When the agent sends nothing: the odds gauge, seconds after `enter` */
  odds: { fill: 0.2, fillFor: 0.7, best: 0.95, verdict: 1.35, why: 1.5 },
} as const;

/** How long the message needs on screen from its title: written in, then read */
const messageNeeds = (story: Story): number => {
  const m = story.message;
  if (m.kind === "restraint") {
    // The gauge fills, the verdict lands, then the why-line writes in and is read
    const whyWords = m.why.split(" ").length;
    return MESSAGE.enter + MESSAGE.odds.why + (whyWords - 1) * WORD_STAGGER + 0.3 + 0.3 - MESSAGE.title;
  }
  const words = m.body.split(" ").length;
  // The voice is describing the message as it writes in, so the read after it can be short
  return MESSAGE.bodyGap + (words - 1) * WORD_STAGGER + 0.3 + 0.6;
};

/**
 * Pins run in script order. The first word of a paragraph absorbs the pause
 * before it in the alignment, so pins name a later word with a negative offset.
 */
const pinsFor = (story: Story): Pin[] => [
  // S1 · the same sequence: the users zoom from step to step with the read
  { at: 1.2, holdAt: 1.1, say: "every user", why: 'the users zoom to Day 1 on "…send every user"' },
  { at: 2.5, holdAt: 2.4, say: "same steps", why: 'the users zoom to Day 3 on "Same steps"' },
  { at: 3.35, holdAt: 3.3, say: "same timing", why: 'the users zoom to Day 7 on "Same timing"' },
  { at: 4.6, holdAt: 4.0, cut: 0.4, say: "same message", why: 'the users zoom to Day 14 on "Same message"' },
  // S2 · the title (the first scene has lifted away by 5.66; only the rail is left)
  { at: 6.8, holdAt: 5.75, cut: 1.05, say: "deploys", offset: -0.3, why: 'the agent drops onto the rail just before "Trophy deploys"' },
  { at: 7.95, holdAt: 7.9, say: "for each user", offset: -0.1, why: 'the accent line lands on "…for each user"' },
  // S3 · the split paths
  { at: 9.0, holdAt: 8.6, cut: 0.3, say: "that creates", offset: -0.3, why: 'the title clears just before "that creates…"' },
  { at: 11.24, holdAt: 11.0, cut: 0.24, say: "just for them", word: 2, edge: "end", offset: -0.3, why: 'the paths hold through "…just for them!", swelling into the next scene as it ends' },
  // S4 · the person's card (solid indigo from 11.4 until it starts forming at 11.94; details from 12.6)
  { at: 12.6, holdAt: 11.42, cut: 0.52, ...story.voice.card, why: `${story.name}'s card fills in on "${story.voice.card.say}"` },
  { at: 13.6, holdAt: 13.55, ...story.voice.chart, why: `the chart draws on "${story.voice.chart.say}"` },
  { at: 15.0, holdAt: 14.55, ...story.voice.choice, why: `the ring lands on "${story.voice.choice.say}"` },
  // S5 · the message, landing just after its phrase starts. The decision is still between the ring settling (15.32) and its exit (16.15)
  { at: MESSAGE.enter, holdAt: 15.4, cut: 0.72, offset: 0.2, ...story.voice.message, why: `the message lands on "${story.voice.message.say}"` },
  // S6 · the result, after the message has been written in and read
  {
    at: 19.6,
    holdAt: MESSAGE.holdAt,
    minHold: Math.max(0, messageNeeds(story) - (MESSAGE.holdAt - MESSAGE.title)),
    say: "agents achieve",
    offset: -0.25,
    why: 'the chart starts drawing on "Trophy\'s agents achieve…"',
  },
  // S7 · close. The chart is still between the grey label landing (22.35) and its exit (25.22)
  { at: 25.7, holdAt: 22.6, cut: 2.5, say: "sending generic", offset: -0.4, why: 'the statement writes in on "Stop sending…"' },
  { at: 27.3, holdAt: 26.6, cut: 0.6, say: "users ignore", word: 1, edge: "end", why: 'the statement clears after "…users ignore."' },
  { at: 27.55, holdAt: 27.5, say: "a demo", offset: -0.3, why: 'the logo pops just before "Book a demo"' },
  { at: 29.1, holdAt: 28.12, say: "messaging tools", word: 1, why: 'the click lands on "tools!"' },
  { at: 29.5, holdAt: 29.45, say: "messaging tools", word: 1, edge: "end", offset: 1.8, why: "trophy.so stays up after the last word" },
];

export type Timeline = {
  /** Seconds inserted (or, if negative, still time dropped) at source time `at` */
  holds: { at: number; extra: number; why: string }[];
  /** Pins the voice reaches before the animation can */
  early: string[];
  /** Source-clock seconds to video seconds */
  warp: (s: number) => number;
  /** Scene boundaries, video seconds */
  cue: Record<SceneName | "end", number>;
  /** Frames from a scene's start to a source-clock time */
  at: (scene: SceneName, s: number) => number;
  /** Scene length, frames */
  duration: (scene: SceneName) => number;
  totalFrames: number;
};

const norm = (w: string) => w.toLowerCase().replace(/[^a-z0-9']/g, "");

export const buildTimeline = (story: Story, take: VoiceoverTake | undefined): Timeline => {
  const words = (take?.words ?? []).map((w) => ({ ...w, n: norm(w.w) })).filter((w) => w.n);
  const findPhrase = (phrase: string, from: number): number => {
    const want = phrase.split(/\s+/).map(norm).filter(Boolean);
    for (let i = from; i + want.length <= words.length; i++) {
      if (want.every((p, k) => words[i + k].n === p)) return i;
    }
    return -1;
  };
  const timeOf = (ref: VoiceRef, index: number): number => {
    const w = words[index + (ref.word ?? 0)];
    return VO_OFFSET + (ref.edge === "end" ? w.e : w.s) + (ref.offset ?? 0);
  };

  const holds: Timeline["holds"] = [];
  const early: string[] = [];
  const sofar = (s: number) => holds.reduce((t, h) => (s >= h.at ? t + h.extra : t), s);
  if (take) {
    let cursor = 0;
    for (const pin of pinsFor(story)) {
      const i = findPhrase(pin.say, cursor);
      if (i < 0) {
        early.push(`"${pin.say}" not found in the take`);
        continue;
      }
      cursor = i;
      const want = timeOf(pin, i) - sofar(pin.at);
      // Voice ahead: drop still time, but never below what the animation needs
      const extra = Math.max(want, -(pin.cut ?? 0), pin.minHold ?? -Infinity);
      if (want - extra < -0.05) early.push(`${pin.why}: voice is ${(extra - want).toFixed(2)} s early`);
      holds.push({ at: pin.holdAt, extra, why: pin.why });
    }
  }

  const warp = sofar;
  const cue = Object.fromEntries(Object.entries(SOURCE_CUE).map(([k, v]) => [k, warp(v)])) as Timeline["cue"];
  const order = Object.keys(SOURCE_CUE) as (SceneName | "end")[];
  return {
    holds,
    early,
    warp,
    cue,
    at: (scene, s) => f(warp(s) - cue[scene]),
    duration: (scene) => f(cue[order[order.indexOf(scene) + 1]]) - f(cue[scene]),
    totalFrames: f(cue.end),
  };
};
