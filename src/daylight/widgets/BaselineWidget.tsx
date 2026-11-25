import React from "react";
import { displayFont, monoFont, sansFont } from "../fonts";
import { Figure } from "../Text";
import { alpha, type Theme } from "../tokens";

/**
 * The restraint widget (web story-widgets BaselineWidget): how likely the
 * outcome already is without a message, and how little a message could add.
 * Header row: label left, figure + "%" right on one baseline. Track: base fill
 * ink/35 to basePct on an ink/10 ground, then a thin accent sliver bestPct
 * wide. Caption right-aligned in the accent.
 *
 * Sizes at s = 1 are the video scale (label 18, figure 64 + 28, track 28 /
 * radius 10, caption 16); pass `s` only to scale the whole widget further.
 * Frame-driven values come in as plain numbers; no hooks here.
 */
export const BaselineWidget: React.FC<{
  theme: Theme;
  accent: string;
  s?: number;
  label: string;
  /** The figure text (fixed-width box), e.g. the count-up to "97" */
  baseText: string;
  /** 0..1: how much of the base fill (0 → basePct) is drawn */
  baseProgress: number;
  basePct: number;
  bestPct: number;
  /** 0..1: the accent sliver's scaleX from its left edge */
  sliverProgress: number;
  caption: string;
  captionOpacity: number;
  style?: React.CSSProperties;
}> = ({ theme, accent, s = 1, label, baseText, baseProgress, basePct, bestPct, sliverProgress, caption, captionOpacity, style }) => {
  const clamp01 = (v: number) => Math.min(1, Math.max(0, v));
  const baseWidth = basePct * clamp01(baseProgress);
  const sliverScale = clamp01(sliverProgress);
  return (
    <div style={{ display: "flex", flexDirection: "column", ...style }}>
      <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", gap: 16 * s, marginBottom: 8 * s }}>
        <span style={{ fontFamily: sansFont, fontWeight: 400, fontSize: 18 * s, lineHeight: `${24 * s}px`, color: theme.inkMuted }}>{label}</span>
        <span style={{ display: "inline-flex", alignItems: "baseline", whiteSpace: "nowrap" }}>
          <Figure value={baseText} widthCh={2} size={64 * s} color={theme.ink} tracking="-0.03em" />
          <span style={{ fontFamily: displayFont, fontWeight: 400, fontSize: 28 * s, lineHeight: 1, letterSpacing: "-0.03em", color: theme.ink }}>%</span>
        </span>
      </div>
      <div
        style={{
          position: "relative",
          height: 28 * s,
          borderRadius: 10 * s,
          overflow: "hidden",
          background: alpha(theme.ink, 0.1),
        }}
      >
        <span
          style={{
            position: "absolute",
            top: 0,
            bottom: 0,
            left: 0,
            width: `${baseWidth.toFixed(3)}%`,
            borderRadius: `${10 * s}px 0 0 ${10 * s}px`,
            background: alpha(theme.ink, 0.35),
          }}
        />
        <span
          style={{
            position: "absolute",
            top: 0,
            bottom: 0,
            left: `${basePct}%`,
            width: `${bestPct}%`,
            background: accent,
            transform: `scaleX(${sliverScale.toFixed(4)})`,
            transformOrigin: "left center",
          }}
        />
      </div>
      <div
        style={{
          marginTop: 8 * s,
          display: "flex",
          justifyContent: "flex-end",
          fontFamily: monoFont,
          fontWeight: 400,
          fontSize: 16 * s,
          lineHeight: `${21 * s}px`,
          fontVariantNumeric: "tabular-nums",
          color: accent,
          opacity: clamp01(captionOpacity),
        }}
      >
        {caption}
      </div>
    </div>
  );
};
