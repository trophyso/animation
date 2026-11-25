import React from "react";

/**
 * The recording's pointer: a fat black arrowhead with a concave back edge and
 * a white outline, drawn in 1920px units. Its tip sits at (x, y).
 */
export const Cursor: React.FC<{ x: number; y: number; style?: React.CSSProperties }> = ({ x, y, style }) => (
  <svg
    width={120}
    height={120}
    viewBox="-12 -12 120 120"
    style={{
      position: "absolute",
      left: x - 12,
      top: y - 12,
      overflow: "visible",
      filter: "drop-shadow(0 4px 6px rgba(0,0,0,0.3))",
      ...style,
    }}
  >
    <path d="M0 0 L95 25 Q50 40 30 90 Z" fill="#000" stroke="#fff" strokeWidth={7} strokeLinejoin="round" />
  </svg>
);
