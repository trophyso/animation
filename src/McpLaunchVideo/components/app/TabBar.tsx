import React from "react";
import { Dumbbell, House, Trophy, UserRound } from "lucide-react";
import { PULSE } from "./pulseTheme";

const TABS = [
  { label: "Home", Icon: House },
  { label: "Workouts", Icon: Dumbbell },
  { label: "Compete", Icon: Trophy },
  { label: "Profile", Icon: UserRound },
];

export const TabBar: React.FC<{ active?: string }> = ({ active = "Home" }) => (
  <div
    style={{
      position: "absolute",
      left: 0,
      right: 0,
      bottom: 0,
      height: 88,
      display: "flex",
      justifyContent: "space-around",
      paddingTop: 10,
      backgroundColor: "rgba(250, 250, 252, 0.94)",
      borderTop: `0.75px solid ${PULSE.separator}`,
      zIndex: 50,
    }}
  >
    {TABS.map(({ label, Icon }) => {
      const isActive = label === active;
      const color = isActive ? PULSE.brand : PULSE.secondary;
      return (
        <div
          key={label}
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 4,
            width: 76,
          }}
        >
          <Icon size={25} color={color} strokeWidth={isActive ? 2.4 : 2} />
          <span style={{ fontSize: 11, fontWeight: 600, color }}>{label}</span>
        </div>
      );
    })}
  </div>
);
