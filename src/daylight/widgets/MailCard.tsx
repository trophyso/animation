import React from "react";
import { monoFont, sansFont } from "../fonts";
import { GlassCard } from "../Glass";
import { Marked } from "../Text";
import { RADIUS, type Theme } from "../tokens";

/** The ==marked== words only, in the accent; everything else transparent (stacks over an ink copy) */
const MarksOnly: React.FC<{ text: string; accent: string }> = ({ text, accent }) => {
  const parts = text.split(/(==[^=]+==)/g);
  return (
    <>
      {parts.map((part, i) =>
        part.indexOf("==") === 0 ? (
          <span key={i} style={{ color: accent }}>
            {part.slice(2, -2)}
          </span>
        ) : (
          <span key={i} style={{ color: "transparent" }}>
            {part}
          </span>
        ),
      )}
    </>
  );
};

/**
 * Text whose ==marks== tint from ink to the accent: the ink copy sits under an
 * identical accent copy whose opacity is `tint` (0 = ink, 1 = accent).
 */
const TintedMarks: React.FC<{ text: string; ink: string; accent: string; tint: number; style: React.CSSProperties }> = ({
  text,
  ink,
  accent,
  tint,
  style,
}) => (
  <div style={{ position: "relative", ...style }}>
    <Marked text={text} accent={ink} />
    <div style={{ position: "absolute", inset: 0, opacity: tint, ...style, margin: 0 }} aria-hidden>
      <MarksOnly text={text} accent={accent} />
    </div>
  </div>
);

/**
 * .dl-mail: an email as it lands, on a stack of two tilted glass sheets. The
 * head (from / time / subject) is on glass-strong; the body is a raised panel
 * under a hairline rule. Every px value is multiplied by `s`.
 */
export const MailCard: React.FC<{
  from: string;
  time: string;
  subject: string;
  body: string;
  theme: Theme;
  accent: string;
  s?: number;
  width: number;
  /** Rotation in degrees of the two sheets behind the card (resting: -2.5, -5) */
  sheetRotate?: readonly [number, number];
  subjectOpacity?: number;
  bodyOpacity?: number;
  /** 0 = marks in ink, 1 = marks in the accent */
  markTint?: number;
  style?: React.CSSProperties;
}> = ({
  from,
  time,
  subject,
  body,
  theme,
  accent,
  s = 1,
  width,
  sheetRotate = [-2.5, -5],
  subjectOpacity = 1,
  bodyOpacity = 1,
  markTint = 1,
  style,
}) => {
  const sheet: React.CSSProperties = { position: "absolute", width: "auto", height: "auto" };
  const subjectStyle: React.CSSProperties = {
    marginTop: 6 * s,
    fontFamily: sansFont,
    fontWeight: 500,
    fontSize: 15 * s,
    lineHeight: `${20 * s}px`,
    color: theme.ink,
  };
  const bodyStyle: React.CSSProperties = {
    fontFamily: sansFont,
    fontWeight: 400,
    fontSize: 14 * s,
    lineHeight: `${20 * s}px`,
    color: theme.ink,
  };
  return (
    <div style={{ position: "relative", width, boxSizing: "border-box", ...style }}>
      <GlassCard
        theme={theme}
        strong={false}
        shadow={false}
        radius={RADIUS.card}
        style={{ ...sheet, inset: `${18 * s}px ${14 * s}px ${-14 * s}px`, rotate: `${sheetRotate[1]}deg`, opacity: 0.7 }}
      />
      <GlassCard
        theme={theme}
        strong={false}
        shadow={false}
        radius={RADIUS.card}
        style={{ ...sheet, inset: `${10 * s}px ${8 * s}px ${-8 * s}px`, rotate: `${sheetRotate[0]}deg` }}
      />
      <GlassCard theme={theme} strong radius={RADIUS.card} style={{ overflow: "hidden" }}>
        <div style={{ padding: `${12 * s}px ${16 * s}px` }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              gap: 8 * s,
              fontFamily: monoFont,
              fontWeight: 400,
              fontSize: 11 * s,
              lineHeight: `${15 * s}px`,
              fontVariantNumeric: "tabular-nums",
              color: theme.inkMuted,
              whiteSpace: "nowrap",
            }}
          >
            <span>{from}</span>
            <span>{time}</span>
          </div>
          <div style={{ opacity: subjectOpacity }}>
            <TintedMarks text={subject} ink={theme.ink} accent={accent} tint={markTint} style={subjectStyle} />
          </div>
        </div>
        <div
          style={{
            background: theme.raised,
            borderTop: `1px solid ${theme.border}`,
            padding: `${16 * s}px ${16 * s}px ${18 * s}px`,
            opacity: bodyOpacity,
          }}
        >
          <TintedMarks text={body} ink={theme.ink} accent={accent} tint={markTint} style={bodyStyle} />
        </div>
      </GlassCard>
    </div>
  );
};
