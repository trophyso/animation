import React from "react";
import { AbsoluteFill, interpolateColors, useCurrentFrame } from "remotion";
import { displayFont, sansFont } from "../../daylight/fonts";
import { fadeUp, lerp, prog } from "../../daylight/motion";
import { EASE, alpha } from "../../daylight/tokens";
import { Backdrop } from "../components/Backdrop";
import { C, EASE_IN, H, SHADOW_CARD, W, f } from "../script";
import type { Row, Signal } from "../stories";
import { useScene } from "../video";

/** The person's card is drawn in base units, then scaled up by K */
const K = 1.1;
const BASE = { w: 1074, h: 643, pad: 60 };
/** Row tops in base units: a plain row, the signal (double height, with its chart), a plain row */
const ROWS = [
  { top: 192, h: 96 },
  { top: 288, h: 192 },
  { top: 480, h: 96 },
];
const AVATAR = 82;
/** The chart inside the signal row, base units */
const SPARK = { x: 60, y: 288 + 102, w: 954, h: 80 };

/** World geometry (px, camera at rest = identity) */
const CARD = { x: Math.round(960 - (BASE.w * K) / 2), y: 120, w: BASE.w * K, h: BASE.h * K, r: 36 * K };
const LINE_Y = CARD.y + 272 * K;
const LINE_STROKE = 10;
const OPTION = { y: 896, w: 350, h: 174, r: 19 };
const OPTION_X = [672, 1071, 1471];
const CONNECTOR_STROKE = 13;
/** The scene opens zoomed out to 0.85 about the top centre */
const OPEN_SCALE = 0.85;
/** Camera after the lean towards the options: scale about the origin, then translate */
const LEAN = { scale: 1.276, x: -632, y: -572 };
/** Where the chosen card is on screen after the lean, and where the exit carries it */
const CHOSEN_ON_SCREEN = { x: 970, y: 681 };
const CHOSEN_EXIT = { x: 1131, y: 399, scale: 0.75 };

const connectorPath = (): string => {
  const x0 = CARD.x + 555 * K;
  const y0 = CARD.y + CARD.h;
  const x1 = OPTION_X[1] + OPTION.w / 2;
  const y1 = OPTION.y;
  return `M ${x0} ${y0} C ${x0} ${y0 + 95}, ${x1} ${y1 - 95}, ${x1} ${y1}`;
};

const countText = (row: Row, p: number): string =>
  row.count === undefined ? row.value : row.value.replace("{n}", Math.round(row.count * p).toLocaleString("en-US"));

/** What the agent noticed, drawn left to right as `p` goes 0 → 1: a line, or bars growing in turn */
const SignalChart: React.FC<{ signal: Signal; p: number; labels: number; color: string }> = ({ signal, p, labels, color }) => {
  const { kind, data, lo, hi, startLabel, endLabel, limit, highlight = [], highlightLabel } = signal.chart;
  const yOf = (v: number) => SPARK.y + (1 - (v - lo) / (hi - lo)) * SPARK.h;
  const floor = SPARK.y + SPARK.h + 8;
  const limitLine =
    limit !== undefined ? (
      <g opacity={labels}>
        <line x1={SPARK.x} x2={SPARK.x + SPARK.w} y1={yOf(limit.value)} y2={yOf(limit.value)} stroke={C.labelMuted} strokeWidth={2.5} strokeDasharray="10 9" />
        {/* At the left end, clear of the end of the data */}
        <text x={SPARK.x} y={yOf(limit.value) - 12} fontFamily={sansFont} fontSize={23} fill={C.labelMuted}>
          {limit.label}
        </text>
      </g>
    ) : null;

  if (kind === "bars") {
    const n = data.length;
    const slot = SPARK.w / n;
    const bw = slot * 0.56;
    const first = highlight[0];
    return (
      <svg width={BASE.w} height={BASE.h} viewBox={`0 0 ${BASE.w} ${BASE.h}`} style={{ position: "absolute", inset: 0, overflow: "visible" }}>
        {data.map((v, i) => {
          // Each bar grows as the sweep passes it
          const g = Math.min(1, Math.max(0, p * (n + 2) - i) / 2.5);
          const top = lerp(g, floor, Math.min(floor - 4, yOf(v)));
          const lit = highlight.includes(i);
          return (
            <rect
              key={i}
              x={SPARK.x + slot * i + (slot - bw) / 2}
              y={top}
              width={bw}
              height={Math.max(0, floor - top)}
              rx={Math.min(8, bw / 3)}
              fill={lit ? color : alpha(color, 0.22)}
            />
          );
        })}
        {limitLine}
        {first !== undefined && highlightLabel ? (
          <text
            x={SPARK.x + slot * first + slot / 2}
            y={yOf(data[first]) - 14}
            textAnchor="middle"
            fontFamily={sansFont}
            fontSize={24}
            fontWeight={600}
            fill={color}
            opacity={labels}
          >
            {highlightLabel}
          </text>
        ) : null}
      </svg>
    );
  }

  const pts = data.map((v, i) => ({ x: SPARK.x + (i / (data.length - 1)) * SPARK.w, y: yOf(v) }));
  // Head of the line along the polyline
  const span = p * (pts.length - 1);
  const seg = Math.min(pts.length - 2, Math.floor(span));
  const k = span - seg;
  const head = { x: lerp(k, pts[seg].x, pts[seg + 1].x), y: lerp(k, pts[seg].y, pts[seg + 1].y) };
  const drawn = [...pts.slice(0, seg + 1), head];
  const line = drawn.map((q, i) => `${i ? "L" : "M"} ${q.x.toFixed(1)} ${q.y.toFixed(1)}`).join(" ");
  const area = `${line} L ${head.x.toFixed(1)} ${floor} L ${pts[0].x} ${floor} Z`;
  const last = pts[pts.length - 1];
  // Under the point when it sits near the top of the card or just under a limit line
  const endBelow = last.y - SPARK.y < 30 || (limit !== undefined && last.y > yOf(limit.value) && last.y - yOf(limit.value) < 44);
  return (
    <svg width={BASE.w} height={BASE.h} viewBox={`0 0 ${BASE.w} ${BASE.h}`} style={{ position: "absolute", inset: 0, overflow: "visible" }}>
      <defs>
        <linearGradient id="signal-area" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={color} stopOpacity={0.16} />
          <stop offset="1" stopColor={color} stopOpacity={0} />
        </linearGradient>
      </defs>
      {limitLine}
      {p > 0 ? (
        <>
          <path d={area} fill="url(#signal-area)" />
          <path d={line} fill="none" stroke={color} strokeWidth={5} strokeLinecap="round" strokeLinejoin="round" />
          {pts.map((q, i) =>
            i / (pts.length - 1) <= p ? <circle key={i} cx={q.x} cy={q.y} r={5.5} fill={C.card} stroke={color} strokeWidth={3.5} /> : null,
          )}
          <circle cx={head.x} cy={head.y} r={10} fill={color} />
        </>
      ) : null}
      {startLabel ? (
        <text x={pts[0].x + 16} y={pts[0].y - 18} fontFamily={sansFont} fontSize={24} fill={C.labelMuted} opacity={labels}>
          {startLabel}
        </text>
      ) : null}
      {endLabel ? (
        <text
          x={last.x}
          y={endBelow ? last.y + 40 : last.y - 22}
          textAnchor="end"
          fontFamily={sansFont}
          fontSize={26}
          fontWeight={600}
          fill={color}
          opacity={labels}
        >
          {endLabel}
        </text>
      ) : null}
    </svg>
  );
};

/**
 * S4 · What the agent knows, and what it decides. The indigo ground shrinks
 * into the person's card, the card fills in, the signal the agent noticed
 * draws in as a chart, a connector drops to the options, the camera leans
 * in, and the choice slides from the first option to the chosen one.
 */
export const DecisionScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { T, ground, story } = useScene("decision");
  const [row0, signal, row2] = story.rows;

  // Indigo ground → card
  const morph = prog(frame, T(11.94), f(0.44), EASE.IN_OUT);
  const whiten = prog(frame, T(12.15), f(0.25), EASE.SOFT);
  const morphDone = frame >= T(12.42);

  // Camera
  const zoom = prog(frame, T(13.1), f(0.4), EASE.IN_OUT);
  const lean = prog(frame, T(14.75), f(0.35), EASE.IN_OUT);
  const zs = lerp(zoom, OPEN_SCALE, 1);
  const scale = lerp(lean, zs, LEAN.scale);
  const tx = lerp(lean, 960 * (1 - zs), LEAN.x);
  const ty = lerp(lean, 0, LEAN.y);
  const leanBlur = Math.sin(Math.PI * lean) * 5;

  // Card in screen space at the opening zoom (for the morph target)
  const cardOpen = {
    x: 960 + OPEN_SCALE * (CARD.x - 960),
    y: OPEN_SCALE * CARD.y,
    w: OPEN_SCALE * CARD.w,
    h: OPEN_SCALE * CARD.h,
    r: OPEN_SCALE * CARD.r,
  };
  const morphRect = {
    x: lerp(morph, 0, cardOpen.x),
    y: lerp(morph, 0, cardOpen.y),
    w: lerp(morph, W, cardOpen.w),
    h: lerp(morph, H, cardOpen.h),
    r: lerp(morph, 0, cardOpen.r),
  };
  const morphColor = interpolateColors(whiten, [0, 0.6, 1], [ground.flood, ground.morphMid, C.card]);

  const lineP = prog(frame, T(12.4), f(0.15), EASE.OUT);
  // The chart draws as the voice names the signal
  const chartP = prog(frame, T(13.6), f(1.0), EASE.IN_OUT);
  const chartLabels = prog(frame, T(14.35), f(0.3), EASE.OUT);
  const connectorP = prog(frame, T(14.6), f(0.25), EASE.OUT);
  const optionsIn = prog(frame, T(14.6), f(0.25), EASE.OUT);
  const countP = prog(frame, T(12.7), f(0.6), EASE.OUT);

  // The choice: a ring lands on the first option, slides to the chosen one, then the rest fades
  const ringIn = prog(frame, T(15.0), f(0.08), EASE.SOFT);
  const ringSlide = prog(frame, T(15.12), f(0.15), EASE.IN_OUT);
  const chosen = prog(frame, T(15.26), f(0.06), EASE.SOFT);
  const settle = prog(frame, T(15.24), f(0.08), EASE.SOFT);

  // Exit: the camera pulls back about the chosen card, then whips up and everything fades
  const pullBack = prog(frame, T(16.15), f(0.3), EASE.SOFT);
  const sweep = prog(frame, T(16.15), f(0.3), EASE_IN);
  const allOut = prog(frame, T(16.36), f(0.14), EASE.SOFT);
  const exitScale = lerp(pullBack, 1, CHOSEN_EXIT.scale);
  const exitX = (CHOSEN_EXIT.x - CHOSEN_ON_SCREEN.x) * pullBack;
  const exitY = (CHOSEN_EXIT.y - CHOSEN_ON_SCREEN.y) * sweep;
  const blur = leanBlur + pullBack * 6;

  const optionStyle = (i: number): { bg: string; kicker: string; title: string; shadow: string } => {
    const isChosen = i === 1;
    const faded = isChosen ? 0 : settle;
    return {
      bg: interpolateColors(faded, [0, 1], ["#ffffff", alpha("#ffffff", 0.45)]),
      kicker: isChosen
        ? interpolateColors(chosen, [0, 1], ["#8f9095", ground.chosen])
        : interpolateColors(faded, [0, 1], ["#8f9095", C.fadedLabel]),
      title: interpolateColors(faded, [0, 1], [C.ink, C.fadedTitle]),
      shadow: `0 ${isChosen ? 22 : lerp(faded, 18, 10)}px 40px -18px rgba(40,60,110,${isChosen ? 0.3 : lerp(faded, 0.24, 0.1)})`,
    };
  };

  const rowStyle = (i: number): React.CSSProperties => ({
    position: "absolute",
    left: BASE.pad,
    right: BASE.pad,
    top: ROWS[i].top,
    height: 96,
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    fontFamily: sansFont,
    fontSize: 35,
    ...fadeUp(frame, T(12.7 + i * 0.07), f(0.35), 10, EASE.OUT),
  });
  const plainRow = (row: Row, i: number) => (
    <div key={row.label} style={rowStyle(i)}>
      <span style={{ color: C.textRow, fontWeight: 400 }}>{row.label}</span>
      <span style={{ color: C.textValue, fontWeight: 400, fontVariantNumeric: "tabular-nums" }}>{countText(row, countP)}</span>
    </div>
  );

  return (
    <Backdrop>
      <AbsoluteFill
        style={{
          transformOrigin: `${CHOSEN_ON_SCREEN.x}px ${CHOSEN_ON_SCREEN.y}px`,
          transform: `translate(${exitX.toFixed(2)}px, ${exitY.toFixed(2)}px) scale(${exitScale.toFixed(4)})`,
          filter: blur > 0.05 ? `blur(${blur.toFixed(2)}px)` : undefined,
        }}
      >
        <div
          style={{
            position: "absolute",
            left: 0,
            top: 0,
            width: W,
            height: H,
            transformOrigin: "0 0",
            transform: `translate(${tx.toFixed(2)}px, ${ty.toFixed(2)}px) scale(${scale.toFixed(4)})`,
          }}
        >
          <div style={{ position: "absolute", inset: 0, opacity: 1 - allOut }}>
            <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} style={{ position: "absolute", inset: 0, overflow: "visible" }}>
              {lineP > 0 ? (
                <line x1={-400} x2={lerp(lineP, -400, CARD.x + 4)} y1={LINE_Y} y2={LINE_Y} stroke={ground.agent} strokeWidth={LINE_STROKE} />
              ) : null}
              <path
                d={connectorPath()}
                fill="none"
                stroke={ground.agentLight}
                strokeWidth={CONNECTOR_STROKE}
                strokeLinecap="round"
                pathLength={1}
                strokeDasharray={1}
                strokeDashoffset={1 - connectorP}
                opacity={connectorP > 0 ? 1 : 0}
              />
            </svg>

            {/* The person's card */}
            <div
              style={{
                position: "absolute",
                left: CARD.x,
                top: CARD.y,
                width: CARD.w,
                height: CARD.h,
                borderRadius: CARD.r,
                background: C.card,
                boxShadow: SHADOW_CARD,
                opacity: morphDone ? 1 : 0,
              }}
            >
              <div style={{ position: "absolute", left: 0, top: 0, width: BASE.w, height: BASE.h, transformOrigin: "0 0", transform: `scale(${K})` }}>
                <div style={{ position: "absolute", left: BASE.pad + 3, top: 59, display: "flex", alignItems: "center", gap: 28, ...fadeUp(frame, T(12.6), f(0.35), 10, EASE.OUT) }}>
                  <span
                    style={{
                      width: AVATAR,
                      height: AVATAR,
                      borderRadius: "50%",
                      background: ground.tint,
                      color: ground.tintInk,
                      display: "inline-flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontFamily: sansFont,
                      fontWeight: 400,
                      fontSize: 36,
                    }}
                  >
                    {story.name[0]}
                  </span>
                  <span>
                    <div style={{ fontFamily: sansFont, fontWeight: 500, fontSize: 51, lineHeight: "56px", color: C.ink }}>{story.name}</div>
                    <div style={{ fontFamily: sansFont, fontWeight: 400, fontSize: 28.5, lineHeight: "34px", color: C.textSub, marginTop: 2 }}>{story.sub}</div>
                  </span>
                </div>
                {ROWS.map((r) => (
                  <div key={r.top} style={{ position: "absolute", left: BASE.pad, right: BASE.pad, top: r.top, height: 2, background: C.divider, ...fadeUp(frame, T(12.65), f(0.3), 0) }} />
                ))}
                {plainRow(row0, 0)}
                <div style={rowStyle(1)}>
                  <span style={{ color: C.textRow, fontWeight: 400 }}>{signal.label}</span>
                  <span style={{ display: "inline-flex", alignItems: "center", gap: 14, color: ground.brand, fontWeight: 500, opacity: chartLabels }}>
                    <svg width={30} height={30} viewBox="0 0 30 30" style={{ display: "block" }}>
                      <path
                        d={signal.direction === "down" ? "M15 4 V24 M6 16 L15 25 L24 16" : "M15 26 V6 M6 14 L15 5 L24 14"}
                        fill="none"
                        stroke={ground.brand}
                        strokeWidth={4}
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                    {signal.trend}
                  </span>
                </div>
                {plainRow(row2, 2)}
                <SignalChart signal={signal} p={chartP} labels={chartLabels} color={ground.brand} />
              </div>
            </div>
          </div>

          {/* The options, the chosen one in the middle */}
          {story.options.map((o, i) => {
            const s = optionStyle(i);
            return (
              <div
                key={o.title}
                style={{
                  position: "absolute",
                  left: OPTION_X[i],
                  top: OPTION.y,
                  width: OPTION.w,
                  height: OPTION.h,
                  borderRadius: OPTION.r,
                  background: s.bg,
                  boxShadow: s.shadow,
                  boxSizing: "border-box",
                  padding: "36px 32px",
                  opacity: optionsIn * (1 - allOut),
                  translate: `0px ${((1 - optionsIn) * 110).toFixed(2)}px`,
                }}
              >
                <div style={{ fontFamily: sansFont, fontSize: 26, lineHeight: "28px", fontWeight: 400, color: s.kicker }}>{o.kicker}</div>
                <div style={{ fontFamily: displayFont, fontSize: 45, lineHeight: "50px", fontWeight: 400, letterSpacing: "-0.02em", color: s.title, marginTop: 14 }}>
                  {o.title}
                </div>
              </div>
            );
          })}

          {/* The decision ring */}
          {ringIn > 0 ? (
            <div
              style={{
                position: "absolute",
                left: lerp(ringSlide, OPTION_X[0], OPTION_X[1]),
                top: OPTION.y,
                width: OPTION.w,
                height: OPTION.h,
                borderRadius: OPTION.r,
                boxShadow: `inset 0 0 0 2.5px ${ground.ring}`,
                opacity: ringIn * (1 - allOut),
              }}
            />
          ) : null}
        </div>
      </AbsoluteFill>

      {/* The indigo ground shrinking into the card */}
      {!morphDone ? (
        <div
          style={{
            position: "absolute",
            left: morphRect.x,
            top: morphRect.y,
            width: morphRect.w,
            height: morphRect.h,
            borderRadius: morphRect.r,
            background: morphColor,
            boxShadow: whiten > 0.5 ? SHADOW_CARD : undefined,
          }}
        />
      ) : null}
    </Backdrop>
  );
};
