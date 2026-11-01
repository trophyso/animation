export { CARD_SHADOW, COLORS } from "../McpLaunchVideo/script";

export const TRANSITION_FRAMES = 20;

export const GOLD = "#f5a524";

export const FLOATING_REWARDS = [
  { label: "+500 XP", icon: "coins", x: 170, y: 180, delay: 16 },
  { label: "20% off Pro", icon: "percent", x: 1430, y: 160, delay: 24 },
  { label: "Free month", icon: "ticket", x: 110, y: 800, delay: 32 },
  { label: "Gift card", icon: "gift", x: 1480, y: 830, delay: 40 },
  { label: "2× XP boost", icon: "sparkles", x: 820, y: 90, delay: 48 },
  { label: "Merch drop", icon: "trophy", x: 830, y: 930, delay: 56 },
] as const;

export const TRIGGERS = [
  { type: "Metric", detail: "Every 10 workouts", icon: "target" },
  { type: "Streak", detail: "30-day streak", icon: "flame" },
  { type: "Achievement", detail: "'Marathon' unlocked", icon: "medal" },
  { type: "Leaderboard", detail: "Finish #1 this week", icon: "crown" },
] as const;

export const REWARD_TYPES = [
  {
    kind: "points",
    name: "Points rewards",
    value: "+500 XP",
    description: "Grant bonus XP, coins or any points, with boosts and caps applied.",
    chip: "2× boost applied",
  },
  {
    kind: "custom",
    name: "Custom rewards",
    value: "20% off Pro",
    description: "Discount codes, free months or physical prizes, fulfilled by your systems.",
    chip: "reward.redeemed",
  },
] as const;

export const REDEEM_CODE = `const { reward } = await trophy.rewards.redeem(
  "weekly-champion",
  { user: { id: user.id } },
);`;

export const DEV_POINTS = [
  "Configure in the dashboard",
  "Webhooks for fulfilment",
  "Redemption analytics",
];

export const WHY_POINTS = [
  "Any milestone",
  "Points or custom prizes",
  "Redeemed in your app",
];
