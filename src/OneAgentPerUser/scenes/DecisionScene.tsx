import React from "react";
import { AbsoluteFill, interpolateColors, useCurrentFrame } from "remotion";
import { displayFont, sansFont } from "../../daylight/fonts";
import { fadeUp, lerp, prog } from "../../daylight/motion";
import { EASE, alpha } from "../../daylight/tokens";
import { Backdrop } from "../components/Backdrop";
import { C, COPY, CUE, EASE_IN, H, SHADOW_CARD, W, at, f } from "../script";

export const DECISION_DURATION = f(CUE.push - CUE.decision);
const T = (s: number) => at("decision", s);

/** Mei's card is drawn in base units, then scaled up by K */
const K = 1.1;
const BASE = { w: 1074, h: 643, pad: 60 };
/** Row tops in base units: Streak, Sessions (double height, with its chart), Usually plays */
const ROWS = [
  { top: 192, h: 96 },
  { top: 288, h: 192 },
  { top: 480, h: 96 },
];
const AVATAR = 82;
/** The session chart inside the Sessions row, base units */
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
const PUSH_ON_SCREEN = { x: 970, y: 681 };
const PUSH_EXIT = { x: 1131, y: 399, scale: 0.75 };

const connectorPath = (): string => {
  const x0 = CARD.x + 555 * K;
  const y0 = CARD.y + CARD.h;
  const x1 = OPTION_X[1] + OPTION.w / 2;
  const y1 = OPTION.y;
  return `M ${x0} ${y0} C ${x0} ${y0 + 95}, ${x1} ${y1 - 95}, ${x1} ${y1}`;
};

/** Mei's minutes per session, drawn left to right as `p` goes 0 → 1 */
const SessionChart: React.FC<{ p: number; labels: number }> = ({ p, labels }) => {
  const data = COPY.mei.sessions;
  // Scaled to the data's range so the drop reads clearly
  const lo = 2.5;
  const hi = 10;
  const pts = data.map((v, i) => ({ x: SPARK.x + (i / (data.length - 1)) * SPARK.w, y: SPARK.y + (1 - (v - lo) / (hi - lo)) * SPARK.h }));
  // Head of the line along the polyline
  const span = p * (pts.length - 1);
  const seg = Math.min(pts.length - 2, Math.floor(span));
  const k = span - seg;
  const head = { x: lerp(k, pts[seg].x, pts[seg + 1].x), y: lerp(k, pts[seg].y, pts[seg + 1].y) };
  const drawn = [...pts.slice(0, seg + 1), head];
  const line = drawn.map((q, i) => `${i ? "L" : "M"} ${q.x.toFixed(1)} ${q.y.toFixed(1)}`).join(" ");
  const floor = SPARK.y + SPARK.h + 8;
  const area = `${line} L ${head.x.toFixed(1)} ${floor} L ${pts[0].x} ${floor} Z`;
  return (
    <svg width={BASE.w} height={BASE.h} viewBox={`0 0 ${BASE.w} ${BASE.h}`} style={{ position: "absolute", inset: 0, overflow: "visible" }}>
      <defs>
        <linearGradient id="mei-area" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={C.indigo} stopOpacity={0.16} />
          <stop offset="1" stopColor={C.indigo} stopOpacity={0} />
        </linearGradient>
      </defs>
      {p > 0 ? (
        <>
          <path d={area} fill="url(#mei-area)" />
          <path d={line} fill="none" stroke={C.indigo} strokeWidth={5} strokeLinecap="round" strokeLinejoin="round" />
          {pts.map((q, i) =>
            i / (pts.length - 1) <= p ? <circle key={i} cx={q.x} cy={q.y} r={5.5} fill={C.card} stroke={C.indigo} strokeWidth={3.5} /> : null,
          )}
          <circle cx={head.x} cy={head.y} r={10} fill={C.indigo} />
        </>
      ) : null}
      <text x={pts[0].x + 16} y={pts[0].y - 16} fontFamily={sansFont} fontSize={24} fill={C.labelMuted} opacity={labels}>
        {`${Math.round(data[0])} min`}
      </text>
      <text x={pts[pts.length - 1].x} y={pts[pts.length - 1].y - 22} textAnchor="end" fontFamily={sansFont} fontSize={26} fontWeight={600} fill={C.indigo} opacity={labels}>
        {`${Math.round(data[data.length - 1])} min`}
      </text>
    </svg>
  );
};

/**
 * S4 · What the agent knows, and what it decides. The indigo ground shrinks
 * into Mei's card, the card fills in, her session lengths draw in as a
 * falling line, a connector drops to the channel options, the camera leans
 * in, and the choice slides from Email to Push.
 */
export const DecisionScene: React.FC = () => {
  const frame = useCurrentFrame();

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
  const morphColor = interpolateColors(whiten, [0, 0.6, 1], [C.indigo, "#c8c4ee", C.card]);

  const lineP = prog(frame, T(12.4), f(0.15), EASE.OUT);
  // Her session chart draws on "sessions are getting shorter"
  const chartP = prog(frame, T(13.6), f(1.0), EASE.IN_OUT);
  const chartLabels = prog(frame, T(14.35), f(0.3), EASE.OUT);
  const connectorP = prog(frame, T(14.6), f(0.25), EASE.OUT);
  const optionsIn = prog(frame, T(14.6), f(0.25), EASE.OUT);

  // The choice: a ring lands on Email, slides to Push, then the rest fades
  const ringIn = prog(frame, T(15.0), f(0.08), EASE.SOFT);
  const ringSlide = prog(frame, T(15.12), f(0.15), EASE.IN_OUT);
  const chosen = prog(frame, T(15.26), f(0.06), EASE.SOFT);
  const settle = prog(frame, T(15.24), f(0.08), EASE.SOFT);

  // Exit: the camera pulls back about the chosen card, then whips up and everything fades
  const pullBack = prog(frame, T(16.15), f(0.3), EASE.SOFT);
  const sweep = prog(frame, T(16.15), f(0.3), EASE_IN);
  const allOut = prog(frame, T(16.36), f(0.14), EASE.SOFT);
  const exitScale = lerp(pullBack, 1, PUSH_EXIT.scale);
  const exitX = (PUSH_EXIT.x - PUSH_ON_SCREEN.x) * pullBack;
  const exitY = (PUSH_EXIT.y - PUSH_ON_SCREEN.y) * sweep;
  const blur = leanBlur + pullBack * 6;
  const othersOut = allOut;
  const pushOut = allOut;

  const optionStyle = (i: number): { bg: string; kicker: string; title: string; shadow: string } => {
    const isPush = i === 1;
    const faded = isPush ? 0 : settle;
    return {
      bg: interpolateColors(faded, [0, 1], ["#ffffff", alpha("#ffffff", 0.45)]),
      kicker: isPush
        ? interpolateColors(chosen, [0, 1], ["#8f9095", C.steelText])
        : interpolateColors(faded, [0, 1], ["#8f9095", C.fadedLabel]),
      title: interpolateColors(faded, [0, 1], [C.ink, C.fadedTitle]),
      shadow: `0 ${isPush ? 22 : lerp(faded, 18, 10)}px 40px -18px rgba(40,60,110,${isPush ? 0.3 : lerp(faded, 0.24, 0.1)})`,
    };
  };

  return (
    <Backdrop>
      <AbsoluteFill
        style={{
          transformOrigin: `${PUSH_ON_SCREEN.x}px ${PUSH_ON_SCREEN.y}px`,
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
          <div style={{ position: "absolute", inset: 0, opacity: 1 - othersOut }}>
            <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} style={{ position: "absolute", inset: 0, overflow: "visible" }}>
              {lineP > 0 ? (
                <line x1={-400} x2={lerp(lineP, -400, CARD.x + 4)} y1={LINE_Y} y2={LINE_Y} stroke={C.indigo} strokeWidth={LINE_STROKE} />
              ) : null}
              <path
                d={connectorPath()}
                fill="none"
                stroke={C.indigoLight}
                strokeWidth={CONNECTOR_STROKE}
                strokeLinecap="round"
                pathLength={1}
                strokeDasharray={1}
                strokeDashoffset={1 - connectorP}
                opacity={connectorP > 0 ? 1 : 0}
              />
            </svg>

            {/* Mei's card */}
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
                      background: C.avatarBg,
                      color: C.avatarInk,
                      display: "inline-flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontFamily: sansFont,
                      fontWeight: 400,
                      fontSize: 36,
                    }}
                  >
                    {COPY.mei.initial}
                  </span>
                  <span>
                    <div style={{ fontFamily: sansFont, fontWeight: 500, fontSize: 51, lineHeight: "56px", color: C.ink }}>{COPY.mei.name}</div>
                    <div style={{ fontFamily: sansFont, fontWeight: 400, fontSize: 28.5, lineHeight: "34px", color: C.textSub, marginTop: 2 }}>{COPY.mei.sub}</div>
                  </span>
                </div>
                {ROWS.map((r) => (
                  <div key={r.top} style={{ position: "absolute", left: BASE.pad, right: BASE.pad, top: r.top, height: 2, background: C.divider, ...fadeUp(frame, T(12.65), f(0.3), 0) }} />
                ))}
                {COPY.mei.rows.map((row, i) => {
                  const isTrend = "trend" in row && row.trend;
                  const streak = Math.round(14 * prog(frame, T(12.7), f(0.6), EASE.OUT));
                  return (
                    <div
                      key={row.label}
                      style={{
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
                      }}
                    >
                      <span style={{ color: C.textRow, fontWeight: 400 }}>{row.label}</span>
                      {isTrend ? (
                        <span style={{ display: "inline-flex", alignItems: "center", gap: 14, color: C.indigo, fontWeight: 500, opacity: chartLabels }}>
                          <svg width={30} height={30} viewBox="0 0 30 30" style={{ display: "block" }}>
                            <path d="M15 4 V24 M6 16 L15 25 L24 16" fill="none" stroke={C.indigo} strokeWidth={4} strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                          {row.value}
                        </span>
                      ) : (
                        <span style={{ color: C.textValue, fontWeight: 400, fontVariantNumeric: "tabular-nums" }}>{i === 0 ? `${streak} days` : row.value}</span>
                      )}
                    </div>
                  );
                })}
                <SessionChart p={chartP} labels={chartLabels} />
              </div>
            </div>
          </div>

          {/* Channel options */}
          {COPY.options.map((o, i) => {
            const s = optionStyle(i);
            const out = i === 1 ? pushOut : othersOut;
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
                  opacity: optionsIn * (1 - out),
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
                boxShadow: `inset 0 0 0 2.5px ${C.steel}`,
                opacity: ringIn * (1 - pushOut),
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
