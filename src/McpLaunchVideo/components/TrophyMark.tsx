import React from "react";

/** Trophy logomark (public/brand/logomark_*.svg) inlined so it can take any colour. */
export const TrophyMark: React.FC<{ size: number; color?: string }> = ({
  size,
  color = "#000",
}) => (
  <svg width={size} height={size} viewBox="0 0 49.5 49.5" fill={color}>
    <rect x="15" y="34.5" width="13" height="15" />
    <rect x="15" y="21.5" width="13" height="13" />
    <rect x="0" y="21.5" width="15" height="13" />
    <rect x="36.5" y="13" width="13" height="15" />
    <rect x="36.5" y="0" width="13" height="13" />
    <rect x="21.5" y="0" width="15" height="13" />
  </svg>
);
