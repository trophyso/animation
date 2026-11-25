import React from "react";
import { useCurrentFrame } from "remotion";
import { displayFont } from "../../daylight/fonts";
import { lerp, prog, smoothTransform } from "../../daylight/motion";
import { EASE } from "../../daylight/tokens";
import { Backdrop } from "../components/Backdrop";
import { C, COPY, CUE, EASE_IN, at, atVideo, f, voiceTime, warp } from "../script";

export const ONE_AGENT_DURATION = f(CUE.decision - CUE.oneAgent);
const T = (s: number) => at("oneAgent", s);

const LEFT = 116;
const TOP = 184;
const SIZE = 260;
/** Line pitch keeps the source's 232/296 ratio */
const PITCH = Math.round(SIZE * 0.784);
/** The accent line sits lower and slightly left of a plain line (source offsets, scaled) */
const ACCENT = { dx: Math.round(-21 * (SIZE / 296)), dy: Math.round(46 * (SIZE / 296)) };
/** The thesis grows smoothly from this scale to full size and holds */
const START_SCALE = 0.86;

const LEAD = COPY.oneAgent.slice(0, -1);
const ACCENT_LINE = COPY.oneAgent[COPY.oneAgent.length - 1];

/**
 * S3 · The thesis on indigo. The lead lines arrive from the right, blurred and
 * a touch small, and ease up to full size in one move; "per user." follows.
 * Everything lifts away as the indigo ground starts to shrink into the next
 * scene's card.
 */
export const OneAgentScene: React.FC = () => {
  const frame = useCurrentFrame();

  const slide = prog(frame, T(9.1), f(0.5), EASE.MOVE);
  const grow = prog(frame, T(9.0), f(0.8), EASE.OUT);
  const scale = lerp(grow, START_SCALE, 1);
  const sharpen = prog(frame, T(9.0), f(0.45), EASE.SOFT);
  const appear = prog(frame, T(9.0), f(0.12), EASE.SOFT);
  // "per user." lands as the voiceover says "…each user"
  const second = prog(frame, atVideo("oneAgent", voiceTime({ say: "each user", word: 1 }, warp(9.9))), f(0.2), EASE.OUT);
  const exit = prog(frame, T(11.86), f(0.14), EASE_IN);

  return (
    <Backdrop color={C.indigo}>
      <div
        style={{
          position: "absolute",
          left: LEFT,
          top: TOP - exit * 320,
          fontFamily: displayFont,
          fontWeight: 400,
          fontSize: SIZE,
          lineHeight: `${PITCH}px`,
          letterSpacing: "-0.04em",
          whiteSpace: "nowrap",
          opacity: 1 - exit,
          filter: exit > 0 ? `blur(${(exit * 12).toFixed(2)}px)` : undefined,
        }}
      >
        <div
          style={{
            color: C.onIndigo,
            opacity: appear,
            filter: sharpen < 1 ? `blur(${((1 - sharpen) * 16).toFixed(2)}px)` : undefined,
            transformOrigin: "0% 50%",
            ...smoothTransform(`translateX(${lerp(slide, 330, 0).toFixed(2)}px) scale(${scale.toFixed(4)})`),
          }}
        >
          {LEAD.map((line) => (
            <div key={line}>{line}</div>
          ))}
        </div>
        <div
          style={{
            color: C.indigoLight,
            opacity: second,
            marginLeft: ACCENT.dx,
            translate: `0px ${(ACCENT.dy + (1 - second) * 30).toFixed(2)}px`,
            filter: second < 1 ? `blur(${((1 - second) * 10).toFixed(2)}px)` : undefined,
          }}
        >
          {ACCENT_LINE}
        </div>
      </div>
    </Backdrop>
  );
};
