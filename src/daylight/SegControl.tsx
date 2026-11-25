import React from "react";
import { monoFont, sansFont } from "./fonts";
import { type Theme } from "./tokens";

/**
 * .dl-seg: a sunken pill track; the chosen option lifts onto mist-raised with a
 * hairline ring. `active` may be fractional so the raised pill can travel.
 */
export const SegControl: React.FC<{
  options: string[];
  active: number;
  theme: Theme;
  s?: number;
  optionWidth?: number;
  md?: boolean;
  style?: React.CSSProperties;
}> = ({ options, active, theme, s = 1, optionWidth = 92, md = false, style }) => {
  const pad = 3 * s;
  const h = (md ? 32 : 28) * s;
  const w = optionWidth * s;
  const nearest = Math.round(active);
  return (
    <div
      style={{
        position: "relative",
        display: "inline-flex",
        padding: pad,
        borderRadius: 9999,
        background: theme.muted,
        boxSizing: "border-box",
        ...style,
      }}
    >
      <div
        style={{
          position: "absolute",
          top: pad,
          left: pad,
          width: w,
          height: h,
          borderRadius: 9999,
          background: theme.raised,
          boxShadow: `0 0 0 1px ${theme.border}`,
          translate: `${(active * w).toFixed(3)}px 0px`,
        }}
      />
      {options.map((o, i) => (
        <span
          key={o}
          style={{
            position: "relative",
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            width: w,
            height: h,
            fontFamily: md ? sansFont : monoFont,
            fontSize: (md ? 14 : 12) * s,
            fontWeight: md && i === nearest ? 500 : 400,
            color: i === nearest ? theme.ink : theme.inkMuted,
            whiteSpace: "nowrap",
          }}
        >
          {o}
        </span>
      ))}
    </div>
  );
};
