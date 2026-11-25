import React from "react";
import { Chip } from "../Chip";
import { displayFont, sansFont } from "../fonts";
import { GlassCard } from "../Glass";
import { Ph } from "../icons";
import { SegControl } from "../SegControl";
import { Label } from "../Text";
import { RADIUS, type Theme } from "../tokens";

/** A labelled section of the kit: .dl-label over its control */
const Section: React.FC<{ label: string; theme: Theme; s: number; style?: React.CSSProperties; children?: React.ReactNode }> = ({
  label,
  theme,
  s,
  style,
  children,
}) => (
  <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start", gap: 8 * s, ...style }}>
    <Label color={theme.inkMuted} s={s}>
      {label}
    </Label>
    {children}
  </div>
);

/**
 * The brand kit (web GuardrailsWidget, in .dl-form anatomy): voice as a
 * segmented control, the never-say phrases as struck chips, the weekly sending
 * limit, and the verification footer. "On" states are ink and raised, never the
 * accent. Every px value is multiplied by `s`; all motion comes in as props.
 */
export const BrandKitCard: React.FC<{
  label: string;
  by: string;
  voice: readonly string[];
  neverSay: readonly string[];
  limit: string;
  limitUnit: string;
  verified: string;
  theme: Theme;
  s?: number;
  width: number;
  /** Fractional index of the raised seg pill */
  voiceActive?: number;
  /** Per-chip entrance 0→1 (fade + 6px rise) */
  chipIn?: readonly number[];
  /** Per-chip strike rule scaleX 0→1 */
  strike?: readonly number[];
  limitOpacity?: number;
  footerOpacity?: number;
  style?: React.CSSProperties;
}> = ({
  label,
  by,
  voice,
  neverSay,
  limit,
  limitUnit,
  verified,
  theme,
  s = 1,
  width,
  voiceActive = 1,
  chipIn,
  strike,
  limitOpacity = 1,
  footerOpacity = 1,
  style,
}) => (
  <GlassCard
    theme={theme}
    strong
    radius={RADIUS.card}
    padding={20 * s}
    style={{ width, display: "flex", flexDirection: "column", gap: 18 * s, ...style }}
  >
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", gap: 12 * s }}>
      <Label color={theme.inkMuted} s={s}>
        {label}
      </Label>
      <Label color={theme.inkMuted} s={s}>
        {by}
      </Label>
    </div>

    <Section label="Voice" theme={theme} s={s}>
      <SegControl options={[...voice]} active={voiceActive} theme={theme} s={s} />
    </Section>

    <Section label="Never say" theme={theme} s={s}>
      <div style={{ display: "flex", gap: 8 * s }}>
        {neverSay.map((phrase, i) => {
          const p = chipIn ? chipIn[i] ?? 1 : 1;
          const sx = strike ? strike[i] ?? 1 : 1;
          return (
            <Chip
              key={phrase}
              theme={theme}
              s={s}
              solid
              color={theme.inkMuted}
              style={{ opacity: p, translate: `0px ${((1 - p) * 6).toFixed(3)}px` }}
            >
              <span style={{ position: "relative", display: "inline-block" }}>
                {phrase}
                <span
                  style={{
                    position: "absolute",
                    left: 0,
                    right: 0,
                    top: "50%",
                    height: 1,
                    marginTop: -0.5,
                    background: theme.ink,
                    transform: `scaleX(${sx.toFixed(4)})`,
                    transformOrigin: "left center",
                  }}
                />
              </span>
            </Chip>
          );
        })}
      </div>
    </Section>

    <Section label="Sending limits" theme={theme} s={s} style={{ opacity: limitOpacity }}>
      <div style={{ display: "flex", alignItems: "baseline", gap: 8 * s }}>
        <span
          style={{
            fontFamily: displayFont,
            fontWeight: 400,
            fontSize: 40 * s,
            lineHeight: 1,
            letterSpacing: "-0.04em",
            fontVariantNumeric: "tabular-nums",
            color: theme.ink,
          }}
        >
          {limit}
        </span>
        <span style={{ fontFamily: sansFont, fontWeight: 400, fontSize: 16 * s, lineHeight: `${24 * s}px`, color: theme.inkMuted }}>
          {limitUnit}
        </span>
      </div>
    </Section>

    <div style={{ display: "flex", alignItems: "center", gap: 8 * s, color: theme.inkMuted, opacity: footerOpacity }}>
      <Ph name="ShieldCheck" size={14 * s} color={theme.inkMuted} />
      <Label color={theme.inkMuted} s={s}>
        {verified}
      </Label>
    </div>
  </GlassCard>
);
