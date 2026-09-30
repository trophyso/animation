export const COLORS = {
  green: "#4CC74A",
  greenDark: "#2f9e2d",
  greenSoft: "rgba(76, 199, 74, 0.12)",
  orange: "#ff7a00",
  blue: "#3b82f6",
  ink: "#0f172a",
  muted: "#667085",
  border: "#d0d7de",
  surface: "#f3f4f6",
  white: "#ffffff",
};

export const CARD_SHADOW = [
  "0 2px 4px rgba(15, 23, 42, 0.03)",
  "0 12px 28px -6px rgba(15, 23, 42, 0.1)",
  "0 32px 64px -12px rgba(15, 23, 42, 0.14)",
].join(", ");

export const TRANSITION_FRAMES = 20;

export type McpServer = "docs" | "account";

export const SERVER_LABELS: Record<McpServer, string> = {
  docs: "Trophy Docs",
  account: "Trophy Account",
};

export type ToolCall = {
  server: McpServer;
  tool: string;
  detail: string;
};

export const SERVERS = [
  {
    server: "docs" as const,
    name: "Docs MCP",
    description:
      "Live, always up-to-date Trophy docs. Your agent searches guides and API reference on demand.",
    tools: ["search_trophy_docs", "query_docs_filesystem_trophy_docs"],
  },
  {
    server: "account" as const,
    name: "Account MCP",
    description:
      "Configure metrics, streaks, points, achievements and leaderboards straight from chat.",
    tools: [
      "write_metrics",
      "write_points_systems",
      "write_leaderboards",
      "grant_streak_freezes",
    ],
  },
];

export const CHAT_USER_MESSAGE_1 =
  "I'm building Pulse, a fitness app where people log their workouts. I want members to build a regular habit, feel like they're progressing and get some friendly competition going. What should I set up in Trophy?";

export const CHAT_DOCS_INTRO = "Let me check what Trophy supports.";

export const CHAT_DOCS_CALLS: ToolCall[] = [
  { server: "docs", tool: "search_trophy_docs", detail: "Streaks" },
  { server: "docs", tool: "search_trophy_docs", detail: "Points & levels" },
  {
    server: "docs",
    tool: "search_trophy_docs",
    detail: "Achievements & leaderboards",
  },
];

export const CHAT_SUGGESTION_INTRO = "Here's the setup I'd recommend for Pulse:";

export const CHAT_SUGGESTION_ITEMS = [
  { name: "Workouts Completed", detail: "metric that tracks every logged workout" },
  { name: "Daily streak", detail: "for logging at least 1 workout a day" },
  { name: "XP points", detail: "for every workout, with levels to climb" },
  { name: "Milestone achievements", detail: "at 10, 25 and 50 workouts" },
  { name: "Weekly leaderboard", detail: "ranked by workouts, resets Monday" },
];

export const CHAT_SUGGESTION_OFFER =
  "Want me to create these in your Trophy account?";

export const CHAT_USER_MESSAGE_2 =
  "Looks great. One change: make the streak weekly, 3 workouts a week, so rest days don't break it. Then go ahead and create it all.";

export const CHAT_SETUP_INTRO =
  "Good call. Switching to a weekly streak and setting everything up now.";

export const CHAT_SETUP_CALLS: ToolCall[] = [
  { server: "account", tool: "write_metrics", detail: "workouts-completed" },
  {
    server: "account",
    tool: "update_streak_settings",
    detail: "Weekly · 3 workouts",
  },
  {
    server: "account",
    tool: "write_points_systems",
    detail: "XP · +10 per workout",
  },
  {
    server: "account",
    tool: "write_achievements",
    detail: "10, 25 & 50 workouts",
  },
  { server: "account", tool: "write_leaderboards", detail: "weekly-workouts" },
];

export const CHAT_DONE_MESSAGE =
  "Done. Your metric, weekly streak, XP, achievements and leaderboard are live in your Trophy account.";

export const AGENT_PROMPT =
  "Integrate the Trophy features I just configured into our React Native app. Use Trophy Docs as the source of truth: send workouts-completed events from the backend with the user's tz, and show streak, XP level and weekly leaderboard rank in the app.";

export const AGENT_TOOL_CALLS: ToolCall[] = [
  {
    server: "docs",
    tool: "search_trophy_docs",
    detail: "Submit a metric event",
  },
  {
    server: "account",
    tool: "read_leaderboards",
    detail: "weekly-workouts",
  },
];

export const AGENT_FILE_EDITS = [
  { path: "server/workouts.ts", added: 22, removed: 1 },
  { path: "app/components/StreakCard.tsx", added: 42, removed: 0 },
  { path: "app/components/XpLevelCard.tsx", added: 38, removed: 0 },
  { path: "app/components/LeaderboardCard.tsx", added: 51, removed: 0 },
  { path: "app/screens/HomeScreen.tsx", added: 12, removed: 2 },
];

export const AGENT_DONE_MESSAGE =
  "Done. Completing a workout now extends the streak, awards XP, unlocks achievements and updates the weekly leaderboard.";

export const INTEGRATION_CODE = `import { TrophyApiClient } from "@trophyso/node";

const trophy = new TrophyApiClient({
  apiKey: process.env.TROPHY_API_KEY as string,
});

export async function completeWorkout(user: User, id: string) {
  const res = await trophy.metrics.event("workouts-completed", {
    user: { id: user.id, tz: user.timezone },
    value: 1,
    idempotencyKey: id,
  });

  return {
    streak: res.currentStreak,
    xp: res.points?.xp,
    achievements: res.achievements,
    rank: res.leaderboards?.["weekly-workouts"]?.rank,
  };
}`;

export const WHY_POINTS = [
  "Always up-to-date docs",
  "No dashboard clicking",
  "Ship gamification in minutes",
];
