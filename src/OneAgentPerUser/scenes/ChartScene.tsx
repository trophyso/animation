import React, { useMemo } from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { displayFont, sansFont } from "../../daylight/fonts";
import { lerp, prog } from "../../daylight/motion";
import { EASE, type Bez } from "../../daylight/tokens";
import { Backdrop } from "../components/Backdrop";
import { Words } from "../components/Words";
import { C, COPY, CUE, EASE_IN, H, W, at, f } from "../script";

export const CHART_DURATION = f(CUE.outro - CUE.chart);
const T = (s: number) => at("chart", s);

type Pt = { x: number; y: number };
type Curve = [Pt, Pt, Pt, Pt];
const AXIS_Y = 898;
/** The agent curve: a cubic bezier least-squares fitted to the source's (rms 1.6px) */
const AGENT: Curve = [
  { x: 165, y: 898 },
  { x: 538, y: 866 },
  { x: 1320, y: 495 },
  { x: 1801, y: 422 },
];
/** The source's sequences curve shape, with its rise scaled so the agent ends exactly 40% higher */
const SEQUENCES_SHAPE: Curve = [
  { x: 165, y: 898 },
  { x: 759, y: 875 },
  { x: 1337, y: 745 },
  { x: 1800, y: 703 },
];
const LIFT = 1 + COPY.chart.figure / 100;
const SEQUENCES_RISE = (AXIS_Y - AGENT[3].y) / LIFT / (AXIS_Y - SEQUENCES_SHAPE[3].y);
const SEQUENCES = SEQUENCES_SHAPE.map((p) => ({ x: p.x, y: AXIS_Y - (AXIS_Y - p.y) * SEQUENCES_RISE })) as Curve;
/** Line labels sit right-aligned to the curves' end, above the agent line and below the sequences line */
const LABEL_RIGHT = 1800;
const LABEL_SIZE = 62;
const STROKE = 9;
const HEAD_R = 12;
/** Where the head dot flies on exit: the centre of the frame, where the outro blooms from it */
export const DOT_TARGET: Pt = { x: 960, y: 540 };
/** Matches the source count: 18% of the way at 0.1 s, 57% at 0.3 s, 94% at 0.7 s */
const EASE_OUT_QUAD: Bez = [0.25, 0.46, 0.45, 0.94];
/** The chart opens 4.5% larger and settles back about the bottom-left corner */
const OPEN_SCALE = 1.045;

const bezierPath = ([a, b, c, d]: Curve): string => `M ${a.x} ${a.y} C ${b.x} ${b.y}, ${c.x} ${c.y}, ${d.x} ${d.y}`;

const bezierAt = ([a, b, c, d]: Curve, t: number): Pt => {
  const u = 1 - t;
  return {
    x: u * u * u * a.x + 3 * u * u * t * b.x + 3 * u * t * t * c.x + t * t * t * d.x,
    y: u * u * u * a.y + 3 * u * u * t * b.y + 3 * u * t * t * c.y + t * t * t * d.y,
  };
};

/** Sampled arc length so the head dot sits exactly where the dash reveal ends */
const useArcTable = (curve: Curve) =>
  useMemo(() => {
    const n = 240;
    const pts: Pt[] = [];
    const len: number[] = [0];
    for (let i = 0; i <= n; i++) {
      const p = bezierAt(curve, i / n);
      pts.push(p);
      if (i > 0) len.push(len[i - 1] + Math.hypot(p.x - pts[i - 1].x, p.y - pts[i - 1].y));
    }
    const total = len[n];
    return (fraction: number): Pt => {
      const target = fraction * total;
      let i = 1;
      while (i < n && len[i] < target) i++;
      const seg = len[i] - len[i - 1] || 1;
      const k = (target - len[i - 1]) / seg;
      return { x: lerp(k, pts[i - 1].x, pts[i].x), y: lerp(k, pts[i - 1].y, pts[i].y) };
    };
  }, [curve]);

/** Visible part of a pathLength=1 path from `from` to `to` (one dash, so round caps only at its ends) */
const span = (from: number, to: number): React.SVGProps<SVGPathElement> => ({
  pathLength: 1,
  strokeDasharray: `${Math.max(0, to - from).toFixed(4)} 2`,
  strokeDashoffset: (-from).toFixed(4),
  opacity: to - from > 0.0005 ? 1 : 0,
});

const lineLabel: React.CSSProperties = {
  position: "absolute",
  right: W - LABEL_RIGHT,
  fontFamily: displayFont,
  fontWeight: 400,
  fontSize: LABEL_SIZE,
  lineHeight: 1,
  letterSpacing: "-0.02em",
  whiteSpace: "nowrap",
};

/** S6 · The outcome: engagement with Trophy's AI agent against sequences, 40% higher */
export const ChartScene: React.FC = () => {
  const frame = useCurrentFrame();
  const agentAt = useArcTable(AGENT);

  const draw = prog(frame, T(19.6), f(0.9), EASE_OUT_QUAD);
  const figure = Math.round(COPY.chart.figure * draw);
  const figureIn = prog(frame, T(19.62), f(0.12), EASE.SOFT);
  // On screen while the figure counts up
  const settle = prog(frame, T(21.4), f(2.2), EASE.IN_OUT);
  const zoom = lerp(settle, OPEN_SCALE, 1);
  // The comparison follows soon after the agent line, ahead of "than with sequences"
  const baselineDraw = prog(frame, T(21.7), f(0.6), EASE.OUT);

  // Exit: lines retract from the left, copy blurs away, the head dot flies to the logo
  const undraw = prog(frame, T(25.22), f(0.25), EASE_IN);
  const copyBlur = prog(frame, T(25.22), f(0.25), EASE.SOFT);
  const copyOut = prog(frame, T(25.38), f(0.1), EASE.SOFT);
  const fly = prog(frame, T(25.25), f(0.35), EASE.IN_OUT);
  const head = agentAt(draw);
  const dot = { x: lerp(fly, head.x, DOT_TARGET.x), y: lerp(fly, head.y, DOT_TARGET.y) };
  const flyBlur = Math.sin(Math.PI * fly) * 4;

  return (
    <Backdrop>
      <AbsoluteFill style={{ transformOrigin: "0px 1080px", transform: `scale(${zoom.toFixed(4)})` }}>
        <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} style={{ position: "absolute", inset: 0, overflow: "visible" }}>
          <path d={bezierPath(SEQUENCES)} fill="none" stroke={C.rail} strokeWidth={STROKE} strokeLinecap="round" {...span(undraw, baselineDraw)} />
          <path d={bezierPath(AGENT)} fill="none" stroke={C.indigo} strokeWidth={STROKE} strokeLinecap="round" {...span(undraw, draw)} />
        </svg>

        <div
          style={{
            position: "absolute",
            left: 120,
            top: 113,
            fontFamily: displayFont,
            fontWeight: 400,
            fontSize: 377,
            lineHeight: 1,
            letterSpacing: "-0.04em",
            color: C.indigo,
            fontVariantNumeric: "tabular-nums",
            whiteSpace: "nowrap",
            opacity: figureIn * (1 - copyOut),
            filter: copyBlur > 0 ? `blur(${(copyBlur * 16).toFixed(2)}px)` : undefined,
          }}
        >
          {figure}%
        </div>
        <div
          style={{
            position: "absolute",
            left: 142,
            top: 502,
            fontFamily: sansFont,
            fontWeight: 400,
            fontSize: 40,
            lineHeight: "42px",
            color: C.ink,
            opacity: 1 - copyOut,
          }}
        >
          <Words text={COPY.chart.caption} start={T(19.7)} />
        </div>
        <div
          style={{
            ...lineLabel,
            top: AGENT[3].y - 52 - LABEL_SIZE,
            color: C.indigo,
            opacity: 1 - copyOut,
          }}
        >
          <Words text={COPY.chart.agent} start={T(21.5)} />
        </div>
        <div
          style={{
            ...lineLabel,
            top: SEQUENCES[3].y + 132,
            color: C.sequences,
            opacity: 1 - copyOut,
          }}
        >
          <Words text={COPY.chart.baseline} start={T(21.9)} />
        </div>
      </AbsoluteFill>

      {/* Head dot, outside the zoom so its flight ends exactly on the logo mark */}
      {draw > 0 ? (
        <div
          style={{
            position: "absolute",
            left: (fly > 0 ? dot.x : 0 + dot.x * zoom) - HEAD_R,
            top: (fly > 0 ? dot.y : 1080 + (dot.y - 1080) * zoom) - HEAD_R,
            width: HEAD_R * 2,
            height: HEAD_R * 2,
            borderRadius: "50%",
            background: C.indigo,
            filter: flyBlur > 0.05 ? `blur(${flyBlur.toFixed(2)}px)` : undefined,
          }}
        />
      ) : null}
    </Backdrop>
  );
};
