import React from "react";
import {
  BadgePercent,
  Coins,
  Crown,
  Flame,
  Gift,
  Medal,
  Sparkles,
  Target,
  Ticket,
  Trophy,
} from "lucide-react";

const ICONS = {
  coins: Coins,
  percent: BadgePercent,
  ticket: Ticket,
  gift: Gift,
  sparkles: Sparkles,
  trophy: Trophy,
  target: Target,
  flame: Flame,
  medal: Medal,
  crown: Crown,
};

export type RewardIconName = keyof typeof ICONS;

export const RewardIcon: React.FC<{
  name: RewardIconName;
  size: number;
  color: string;
  strokeWidth?: number;
}> = ({ name, size, color, strokeWidth = 2.2 }) => {
  const Icon = ICONS[name];
  return <Icon size={size} color={color} strokeWidth={strokeWidth} />;
};
