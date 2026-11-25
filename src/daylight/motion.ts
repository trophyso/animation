import type React from "react";
import { Easing, interpolate } from "remotion";
import { EASE, type Bez } from "./tokens";

export { smoothTransform } from "../McpLaunchVideo/components/smoothTransform";

export const FPS = 60;
/** Seconds to frames at the project's 60fps */
export const f = (s: number): number => Math.round(s * FPS);

export const bez = (e: Bez) => Easing.bezier(e[0], e[1], e[2], e[3]);

/** 0→1 progress over [start, start+dur] frames, clamped, eased */
export const prog = (frame: number, start: number, dur: number, ease: Bez = EASE.OUT): number =>
  interpolate(frame, [start, start + Math.max(1, dur)], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: bez(ease),
  });

export const lerp = (p: number, a: number, b: number): number => a + (b - a) * p;

/** Entrance: fade + rise dy px (EASE_OUT by default) */
export const fadeUp = (frame: number, start: number, dur: number, dy = 16, ease: Bez = EASE.OUT): React.CSSProperties => {
  const p = prog(frame, start, dur, ease);
  return { opacity: p, translate: `0px ${((1 - p) * dy).toFixed(3)}px` };
};

/** Copy entrance: fade with 1.5px blur and a small rise, SOFT curve (web copy crossfade) */
export const blurIn = (frame: number, start: number, dur: number, dy = 14): React.CSSProperties => {
  const p = prog(frame, start, dur, EASE.SOFT);
  return {
    opacity: p,
    translate: `0px ${((1 - p) * dy).toFixed(3)}px`,
    filter: p < 1 ? `blur(${((1 - p) * 1.5).toFixed(3)}px)` : undefined,
  };
};

/** Copy exit: fade with 1.5px blur, SOFT curve */
export const blurOut = (frame: number, start: number, dur: number): React.CSSProperties => {
  const p = prog(frame, start, dur, EASE.SOFT);
  return { opacity: 1 - p, filter: p > 0 ? `blur(${(p * 1.5).toFixed(3)}px)` : undefined };
};

/** Plain fade */
export const fade = (frame: number, start: number, dur: number, ease: Bez = EASE.IN_OUT): React.CSSProperties => ({
  opacity: prog(frame, start, dur, ease),
});

export const formatNumber = (v: number, decimals = 0): string =>
  v.toFixed(decimals).replace(/\B(?=(\d{3})+(?!\d))/g, ",");

/** A figure counting from 0 to `to`; render it in a fixed-width box (Text.tsx Figure) */
export const countUp = (frame: number, start: number, dur: number, to: number, decimals = 0, ease: Bez = EASE.OUT): string =>
  formatNumber(lerp(prog(frame, start, dur, ease), 0, to), decimals);

/** clip-path inset that reveals an element left→right */
export const revealLeftToRight = (p: number): React.CSSProperties => ({
  clipPath: `inset(-20% ${((1 - p) * 100).toFixed(3)}% -20% -2%)`,
});
