/**
 * The ground a video is drawn on: the original flat light blue ("plain"), or
 * one of Trophy Daylight's six skies (the website's hero backgrounds). Cards
 * stay white on every ground; the ground decides what sits directly on it
 * (headlines, rails, lines, labels) and the theme colour: the sky's accent
 * from the website's tokens (indigo on the plain ground), used for everything
 * that marks the agent: the flood and title, the split paths, avatars, chips,
 * charts, the decision ring, the result line. Night is the one dark sky, so it
 * gets light ink. The call to action is the same on every ground.
 */
import { SKY_BACKGROUND } from "../og/constants";
import { ACCENTS, SKIES, THEME, type Sky } from "../daylight/tokens";

export type GroundName = "plain" | Sky;
export const GROUNDS: readonly GroundName[] = ["plain", ...SKIES];

export type Ground = {
  name: GroundName;
  /** CSS `background` for the full frame */
  background: string;
  /**
   * "fine": a plain blend of contrast-boosted noise, for the pale flat ground;
   * "overlay": the website's overlay grain, for the saturated skies
   */
  grain: "fine" | "overlay";
  dark: boolean;
  /** Headlines and figures on the ground */
  ink: string;
  /** Secondary copy on the ground */
  sub: string;
  /** The sequence's rail and step rings */
  rail: string;
  /** The step labels under the rail */
  labelStrong: string;
  labelMuted: string;
  /** The users walking the rail */
  walker: string;
  /** The sequences line in the result chart */
  baseline: string;
  /** The outro's top-right halo (hex) and how strong it gets */
  glow: string;
  glowStrength: number;

  /** The agent's lines on the ground (split paths, connector, result line and figure) */
  agent: string;
  agentLight: string;
  /** The agent's full-frame colour (the title scene, the node that swells into it), its text, and the title's accent line */
  flood: string;
  floodInk: string;
  floodAccent: string;
  /** The theme on white cards: avatars, chips, charts, the trend */
  brand: string;
  /** A light tint of it (the person's avatar) and the ink on that tint */
  tint: string;
  tintInk: string;
  /** The decision ring and the chosen option's label */
  ring: string;
  chosen: string;
  /** Halfway through the flood turning into the person's card */
  morphMid: string;
  /** The words the agent chose, in a message card */
  accent: string;
};

/** `a` mixed `t` of the way towards `b` (hex colours) */
export const mixHex = (a: string, b: string, t: number): string => {
  const pa = parseInt(a.slice(1), 16);
  const pb = parseInt(b.slice(1), 16);
  const ch = (shift: number) => Math.round(((pa >> shift) & 255) * (1 - t) + ((pb >> shift) & 255) * t);
  return `#${[16, 8, 0].map((sh) => ch(sh).toString(16).padStart(2, "0")).join("")}`;
};

/** The call to action looks the same on every ground */
export const BUTTON = { background: "#131619", ink: "#f5f5f5" };

/** The original video's colours, sampled from the source frames */
const PLAIN: Ground = {
  name: "plain",
  background: "#e7f2fb",
  grain: "fine",
  dark: false,
  ink: "#101012",
  sub: "#505052",
  rail: "#b4b3c1",
  labelStrong: "#42434f",
  labelMuted: "#858583",
  walker: "#8a867f",
  baseline: "#89857e",
  glow: "#bad7f0",
  glowStrength: 1,
  agent: "#4136c8",
  agentLight: "#7877f6",
  flood: "#4136c8",
  floodInk: "#ecf6ff",
  floodAccent: "#7877f6",
  brand: "#4136c8",
  tint: "#ddebf3",
  tintInk: "#3b5f93",
  ring: "#2c5793",
  chosen: "#305985",
  morphMid: "#c8c4ee",
  accent: "#32609a",
};

/** The theme colours from a sky's Day accent [primary, muted] */
const themeOf = (sky: Sky) => {
  const [p, muted] = ACCENTS.day[sky];
  return {
    flood: p,
    floodInk: muted,
    floodAccent: mixHex(p, "#ffffff", 0.5),
    brand: p,
    tint: muted,
    tintInk: p,
    ring: p,
    chosen: p,
    morphMid: mixHex(p, "#ffffff", 0.72),
    accent: p,
  };
};

/** CSS shorthand for a sky (the website's layered gradients over its base colour) */
const skyBackground = (sky: Sky): string => `${SKY_BACKGROUND[sky].backgroundImage}, ${SKY_BACKGROUND[sky].backgroundColor}`;

const daySky = (sky: Sky): Ground => ({
  ...themeOf(sky),
  name: sky,
  background: skyBackground(sky),
  grain: "overlay",
  dark: false,
  ink: THEME.day.skyInk,
  sub: THEME.day.skyInkMuted,
  rail: "rgba(22,22,29,0.24)",
  labelStrong: THEME.day.skyInkMuted,
  labelMuted: "rgba(22,22,29,0.56)",
  walker: "#77747f",
  baseline: "rgba(22,22,29,0.42)",
  glow: "#fff8ee",
  glowStrength: 0.75,
  agent: ACCENTS.day[sky][0],
  agentLight: mixHex(ACCENTS.day[sky][0], "#ffffff", 0.42),
});

const NIGHT: Ground = {
  ...themeOf("night"),
  name: "night",
  background: skyBackground("night"),
  grain: "overlay",
  dark: true,
  ink: THEME.night.skyInk,
  sub: THEME.night.skyInkMuted,
  rail: "rgba(242,241,246,0.26)",
  labelStrong: THEME.night.skyInkMuted,
  labelMuted: "rgba(242,241,246,0.56)",
  walker: "#c9c8d6",
  baseline: "rgba(242,241,246,0.45)",
  glow: "#8f8cff",
  glowStrength: 0.4,
  // Lines on the dark sky use the Night accent, lighter than the Day one on cards
  agent: ACCENTS.night.night[0],
  agentLight: mixHex(ACCENTS.night.night[0], ACCENTS.day.night[0], 0.5),
};

export const groundFor = (name: GroundName): Ground => (name === "plain" ? PLAIN : name === "night" ? NIGHT : daySky(name));
