import React from "react";

export const PULSE = {
  brand: "#ff5a36",
  brandPressed: "#e84a28",
  brandSoft: "#ffeee9",
  purple: "#7a5af8",
  purpleSoft: "#efebff",
  gold: "#f5a524",
  background: "#f2f2f7",
  card: "#ffffff",
  ink: "#111114",
  secondary: "#8a8a8f",
  tertiary: "#c7c7cc",
  separator: "#e6e6eb",
  fill: "#ececf1",
};

export const PULSE_CARD: React.CSSProperties = {
  backgroundColor: PULSE.card,
  borderRadius: 20,
  boxShadow: "0 1px 2px rgba(17, 17, 20, 0.04)",
};

export const PulseLogo: React.FC<{ size?: number }> = ({ size = 30 }) => (
  <svg width={size} height={size} viewBox="0 0 32 32">
    <rect width="32" height="32" rx="9" fill={PULSE.brand} />
    <polyline
      points="5,17 10.5,17 13.5,9.5 18.5,23.5 21.5,17 27,17"
      fill="none"
      stroke="#fff"
      strokeWidth="3"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);
