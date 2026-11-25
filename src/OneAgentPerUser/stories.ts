/**
 * The user stories a "One agent per user" video can tell: the six from the
 * website's hero (web src/components/hero-stories.ts), one per sky. Each
 * video shares the opening (the sequence, the title, the split paths) and the
 * result and close; the story fills the middle: the person's card, what their
 * agent decides, and the message it sends (or doesn't).
 *
 * People, apps and numbers are illustrative, as on the website. In message
 * copy, {braces} mark the words the agent chose for this person; they are
 * drawn in the sky's accent.
 */
import type { AppName } from "../daylight/AppIcon";
import type { Sky } from "../daylight/tokens";

export type StoryKey = "mei" | "joe" | "aisha" | "ellie" | "priya" | "leo";

/** A phrase in the story's voice lines (voiceover/stories/<key>.txt), for a sync pin */
export type VoiceRef = {
  /** Words as spoken (case and punctuation ignored) */
  say: string;
  /** Which word of the phrase to time (default 0, the first) */
  word?: number;
  /** Time its start (default) or its end */
  edge?: "start" | "end";
  /** Seconds added to the word's time */
  offset?: number;
};

/** A plain row on the person's card. `{n}` in the value counts up to `count` */
export type Row = { label: string; value: string; count?: number };

/** The double-height row with the chart: what the agent noticed */
export type Signal = {
  label: string;
  /** The trend, beside an arrow */
  trend: string;
  direction: "up" | "down";
  chart: {
    kind: "line" | "bars";
    data: number[];
    /** The value range the chart spans, bottom to top */
    lo: number;
    hi: number;
    /** Labels at the first and last point (line charts) */
    startLabel?: string;
    endLabel?: string;
    /** A dashed threshold across the chart */
    limit?: { value: number; label: string };
    /** Bars drawn in the accent (bar charts) */
    highlight?: number[];
    /** A label over the first highlighted bar */
    highlightLabel?: string;
  };
};

export type Option = { kicker: string; title: string };

export type Message =
  | {
      kind: "sent";
      channel: "push" | "email";
      time: string;
      title: string;
      body: string;
      /** The sparkle line under the card: why it went out then */
      why: string;
    }
  | {
      /**
       * The agent chose to send nothing. Shown as the website's baseline
       * widget: how likely the person is to do it anyway (grey), and the most
       * a message could add (the theme colour), then the verdict.
       */
      kind: "restraint";
      odds: { label: string; base: number; best: number };
      title: string;
      body: string;
      why: string;
    };

export type Narrator = "female" | "male";

export type Story = {
  key: StoryKey;
  name: string;
  /** Who voices the video: matches the person (the pronouns the website's copy uses for them), and voiceover/stories/<key>.txt */
  narrator: Narrator;
  /** The website's sky for this story, the video's default */
  sky: Sky;
  app: AppName;
  /** Their card in the split paths */
  fan: { channel: string; title: string; body: string; quiet?: boolean };
  /** "App · City" under their name */
  sub: string;
  /** The card's rows: plain, the signal (with its chart), plain */
  rows: [Row, Signal, Row];
  /** The three options, the chosen one in the middle; the ring lands on the first, then slides to it */
  options: [Option, Option, Option];
  message: Message;
  /** Phrases in the story's voice lines the animation waits for */
  voice: {
    /** The card fills in */
    card: VoiceRef;
    /** The chart draws */
    chart: VoiceRef;
    /** The ring lands on the first option */
    choice: VoiceRef;
    /** The message card lands */
    message: VoiceRef;
  };
};

const SENT_IF_UNSEEN: Option = { kicker: "If unseen", title: "In-app" };

export const STORIES: Record<StoryKey, Story> = {
  mei: {
    key: "mei",
    name: "Mei",
    narrator: "female",
    sky: "morning",
    app: "Wordplay",
    fan: { channel: "Push · 07:15", title: "Ready for a harder puzzle, Mei?", body: "Today’s expert pack is a step up." },
    sub: "Wordplay · New York",
    rows: [
      { label: "Streak", value: "{n} days", count: 14 },
      {
        label: "Sessions",
        trend: "Getting shorter",
        direction: "down",
        chart: {
          kind: "line",
          // Minutes per session over her 14-day streak
          data: [9.2, 8.7, 9.4, 8.9, 8.4, 8.8, 7.9, 7.5, 7.7, 6.6, 5.8, 5.1, 4.0, 3.1],
          lo: 2.5,
          hi: 10,
          startLabel: "9 min",
          endLabel: "3 min",
        },
      },
      { label: "Usually plays", value: "Before 7:30am" },
    ],
    options: [{ kicker: "Not picked", title: "Email" }, { kicker: "Sent 07:15", title: "Push" }, SENT_IF_UNSEEN],
    message: {
      kind: "sent",
      channel: "push",
      time: "07:15",
      title: "Ready for a {harder puzzle}, Mei?",
      body: "You’ve been {breezing through}. Today’s {expert pack} is a step up from your usual.",
      why: "Sent at 07:15, before Mei usually plays",
    },
    voice: {
      card: { say: "agent sees", offset: -0.35 },
      chart: { say: "sessions are getting shorter" },
      choice: { say: "picks push", word: 1, offset: -0.08 },
      message: { say: "reaches her" },
    },
  },

  joe: {
    key: "joe",
    name: "Joe",
    narrator: "male",
    sky: "noon",
    app: "Flyway",
    fan: { channel: "Push · 19:30", title: "Still thinking about Rome?", body: "Your two shortlisted flights are still available." },
    sub: "Flyway · Manchester",
    rows: [
      { label: "Shortlisted", value: "{n} flights to Rome", count: 2 },
      {
        label: "Rome flight views",
        trend: "3 visits in 48 hours",
        direction: "up",
        chart: {
          kind: "bars",
          // Views of the two Rome flights, per day over ten days
          data: [0, 0, 1, 0, 0, 0, 2, 0, 3, 4],
          lo: 0,
          hi: 4.6,
          highlight: [8, 9],
        },
      },
      { label: "Not checked yet", value: "Baggage & cancellation" },
    ],
    options: [{ kicker: "Not picked", title: "Email" }, { kicker: "Sent 19:30", title: "Push" }, SENT_IF_UNSEEN],
    message: {
      kind: "sent",
      channel: "push",
      time: "19:30",
      title: "Still thinking about {Rome}?",
      body: "The {two flights} you shortlisted are still available. Compare their {baggage and cancellation} options before you decide.",
      why: "Sent at 19:30, while Joe plans his trip",
    },
    voice: {
      card: { say: "agent sees", offset: -0.2 },
      chart: { say: "keeps coming back" },
      choice: { say: "picks push", word: 1, offset: -0.08 },
      message: { say: "reaches him" },
    },
  },

  aisha: {
    key: "aisha",
    name: "Aisha",
    narrator: "female",
    sky: "afternoon",
    app: "Learnr",
    fan: { channel: "Email · 17:00", title: "Meet Ultra, our new plan", body: "You’ve hit your usage limit 3 times in two weeks." },
    sub: "Learnr · Birmingham",
    rows: [
      { label: "Plan", value: "Free" },
      {
        label: "Daily usage",
        trend: "Hit the limit 3 times",
        direction: "up",
        chart: {
          kind: "bars",
          // Her daily use against the free plan's limit (the website's numbers)
          data: [18, 24, 40, 14, 26, 40, 31, 16, 28, 34, 22, 40, 33, 27],
          lo: 0,
          hi: 46,
          limit: { value: 40, label: "Free plan limit" },
          highlight: [2, 5, 11],
        },
      },
      { label: "New plan", value: "Ultra, just launched" },
    ],
    options: [{ kicker: "Not picked", title: "Push" }, { kicker: "Sent 17:00", title: "Email" }, SENT_IF_UNSEEN],
    message: {
      kind: "sent",
      channel: "email",
      time: "17:00",
      title: "Meet {Ultra}, our new plan with more usage before your {exams}",
      body: "You’ve hit your usage limit {3 times} in two weeks. Your first month of Ultra costs {the same as Pro}.",
      why: "Sent at 17:00, when Aisha sits down to study",
    },
    voice: {
      card: { say: "agent sees", offset: -0.25 },
      chart: { say: "hitting her usage limit" },
      choice: { say: "picks email", word: 1, offset: -0.08 },
      message: { say: "reaches her" },
    },
  },

  ellie: {
    key: "ellie",
    name: "Ellie",
    narrator: "female",
    sky: "dawn",
    app: "Roastery",
    fan: { channel: "Email · 07:30", title: "20 points from Gold", body: "Double points this weekend gets you there." },
    sub: "Roastery · Bristol",
    rows: [
      { label: "Points", value: "{n}", count: 1920 },
      {
        label: "Points balance",
        trend: "80 from Gold",
        direction: "up",
        chart: {
          kind: "line",
          data: [1240, 1310, 1380, 1420, 1500, 1560, 1610, 1680, 1720, 1790, 1840, 1870, 1900, 1920],
          lo: 1150,
          hi: 2060,
          startLabel: "1,240",
          endLabel: "1,920",
          limit: { value: 2000, label: "Gold" },
        },
      },
      { label: "Expiring Monday", value: "400 points" },
    ],
    options: [{ kicker: "Not picked", title: "Push" }, { kicker: "Sent 07:30", title: "Email" }, SENT_IF_UNSEEN],
    message: {
      kind: "sent",
      channel: "email",
      time: "07:30",
      title: "{20 points} from Gold, with double points this weekend",
      body: "{400 points} expire on Monday, just enough for a free drink.",
      why: "One clear email instead of three competing offers",
    },
    voice: {
      card: { say: "agent sees" },
      chart: { say: "eighty points from gold" },
      choice: { say: "picks email", word: 1, offset: -0.08 },
      message: { say: "reaches her" },
    },
  },

  priya: {
    key: "priya",
    name: "Priya",
    narrator: "female",
    sky: "dusk",
    app: "Snapr",
    fan: { channel: "Push · 18:40", title: "Your sunset shot was your top post", body: "3 friends joined this week’s Golden hour challenge." },
    sub: "Snapr · Lisbon",
    rows: [
      { label: "Last post", value: "{n} days ago", count: 7 },
      {
        label: "Likes per post",
        trend: "Sunset shot is her best",
        direction: "up",
        chart: {
          kind: "bars",
          data: [42, 38, 55, 47, 61, 44, 186, 52],
          lo: 0,
          hi: 205,
          highlight: [6],
          highlightLabel: "Sunset shot",
        },
      },
      { label: "Usually posts", value: "Golden hour" },
    ],
    options: [{ kicker: "Not picked", title: "Email" }, { kicker: "Sent 18:40", title: "Push" }, SENT_IF_UNSEEN],
    message: {
      kind: "sent",
      channel: "push",
      time: "18:40",
      title: "Your {sunset shot} was your top post this month",
      body: "{3 friends} have joined this week’s {Golden hour} challenge, and the lighting is hitting right now.",
      why: "Sent at 18:40, right at golden hour",
    },
    voice: {
      card: { say: "agent sees" },
      chart: { say: "most liked post" },
      choice: { say: "picks push", word: 1, offset: -0.08 },
      message: { say: "reaches her" },
    },
  },

  leo: {
    key: "leo",
    name: "Leo",
    narrator: "male",
    sky: "night",
    app: "Learnr",
    fan: { channel: "Nothing sent", title: "Studying daily anyway", body: "His agent saves the channel for when it counts.", quiet: true },
    sub: "Learnr · Edinburgh",
    rows: [
      { label: "Exam", value: "In {n} days", count: 5 },
      {
        label: "Study time",
        trend: "Every day",
        direction: "up",
        chart: {
          kind: "line",
          // Minutes a day, two weeks out from his exam
          data: [38, 42, 45, 41, 48, 52, 47, 55, 51, 58, 54, 60, 57, 62],
          lo: 25,
          hi: 70,
          startLabel: "38 min",
          endLabel: "62 min",
        },
      },
      { label: "Studies tomorrow", value: "97% likely" },
    ],
    options: [{ kicker: "Not needed", title: "Push" }, { kicker: "Chosen", title: "Nothing" }, { kicker: "Not needed", title: "Email" }],
    message: {
      kind: "restraint",
      odds: { label: "Chance Leo studies tomorrow", base: 97, best: 1.6 },
      title: "Not worth interrupting him",
      body: "His agent sends nothing today",
      why: "Saving the channel for when it counts",
    },
    voice: {
      card: { say: "agent sees" },
      chart: { say: "studying every day" },
      choice: { say: "picks nothing", word: 1, offset: -0.08 },
      message: { say: "picks nothing", word: 1, edge: "end", offset: 0.45 },
    },
  },
};

export const STORY_KEYS = Object.keys(STORIES) as StoryKey[];

/** The order the split paths list people in (Leo's "Nothing sent" stays in view as the odd one out) */
const FAN_ORDER: StoryKey[] = ["mei", "joe", "aisha", "leo", "ellie", "priya"];

/** The split paths' five cards: the story's person first, then the others */
export const fanFor = (key: StoryKey): Story[] => [key, ...FAN_ORDER.filter((k) => k !== key)].slice(0, 5).map((k) => STORIES[k]);
