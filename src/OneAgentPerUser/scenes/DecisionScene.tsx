import React from "react";
import { AbsoluteFill, interpolateColors, useCurrentFrame } from "remotion";
import { displayFont, sansFont } from "../../daylight/fonts";
import { fadeUp, lerp, prog } from "../../daylight/motion";
import { EASE, alpha } from "../../daylight/tokens";
import { Backdrop } from "../components/Backdrop";
import { C, COPY, CUE, EASE_IN, H, SHADOW_CARD, W, at, f } from "../script";

export const DECISION_DURATION = f(CUE.push - CUE.decision);
const T = (s: number) => at("decision", s);

/** World geometry (px, camera at rest = identity) */
const LINE_Y = 452;
const LINE_STROKE = 10;
const CARD = { x: 423, y: 180, w: 1074, h: 547, r: 36, pad: 60 };
const AVATAR = 82;
const DIVIDERS = [372, 468, 562];
const ROW_H = 96;
const OPTION = { y: 884, w: 350, h: 174, r: 19 };
const OPTION_X = [672, 1071, 1471];
const CONNECTOR_STROKE = 13;
/** The scene opens zoomed out to 0.85 about the top centre */
const OPEN_SCALE = 0.85;
/** Camera after the lean towards the options: scale about the origin, then translate */
const LEAN = { scale: 1.276, x: -632, y: -557 };
/** Where the chosen card is on screen after the lean, and where the exit carries it */
const PUSH_ON_SCREEN = { x: 970, y: 681 };
const PUSH_EXIT = { x: 1131, y: 399, scale: 0.75 };

const connectorPath = (): string => {
  const x0 = CARD.x + 555;
  const y0 = CARD.y + CARD.h;
  const x1 = OPTION_X[1] + OPTION.w / 2;
  const y1 = OPTION.y;
  return `M ${x0} ${y0} C ${x0} ${y0 + 95}, ${x1} ${y1 - 95}, ${x1} ${y1}`;
};

/** A short falling sparkline for "Getting shorter" */
const Spark: React.FC = () => (
  <svg width={62} height={26} viewBox="0 0 62 26" style={{ display: "block" }}>
    <path d="M2 4 C 12 4, 15 12, 24 14 S 48 20, 60 23" fill="none" stroke={C.indigo} strokeWidth={4} strokeLinecap="round" />
  </svg>
);

/**
 * S4 · What the agent knows, and what it decides. The indigo ground shrinks
 * into Mei's card, the card fills in, a connector drops to the channel
 * options, the camera leans in, and the choice slides from Email to Push.
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
  const connectorP = prog(frame, T(14.6), f(0.25), EASE.OUT);
  const optionsIn = prog(frame, T(14.6), f(0.25), EASE.OUT);

  // The choice: a ring lands on Email, slides to Push, then the rest fades
  const ringIn = prog(frame, T(15.0), f(0.08), EASE.SOFT);
  const ringSlide = prog(frame, T(15.12), f(0.15), EASE.IN_OUT);
  const chosen = prog(frame, T(15.26), f(0.06), EASE.SOFT);
  const settle = prog(frame, T(15.24), f(0.08), EASE.SOFT);

  // Exit: the camera pulls back about the chosen card, then whips up and everything fades
  const pullBack = prog(frame, T(16.45), f(0.3), EASE.SOFT);
  const sweep = prog(frame, T(16.45), f(0.3), EASE_IN);
  const allOut = prog(frame, T(16.66), f(0.14), EASE.SOFT);
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
              <div style={{ position: "absolute", left: CARD.pad + 3, top: 59, display: "flex", alignItems: "center", gap: 28, ...fadeUp(frame, T(12.9), f(0.35), 10, EASE.OUT) }}>
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
              {DIVIDERS.map((y) => (
                <div key={y} style={{ position: "absolute", left: CARD.pad, right: CARD.pad, top: y - CARD.y, height: 2, background: C.divider, ...fadeUp(frame, T(12.95), f(0.3), 0) }} />
              ))}
              {COPY.mei.rows.map((row, i) => (
                <div
                  key={row.label}
                  style={{
                    position: "absolute",
                    left: CARD.pad,
                    right: CARD.pad,
                    top: DIVIDERS[i] - CARD.y,
                    height: ROW_H,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    fontFamily: sansFont,
                    fontSize: 35,
                    ...fadeUp(frame, T(13.0 + i * 0.07), f(0.35), 10, EASE.OUT),
                  }}
                >
                  <span style={{ color: C.textRow, fontWeight: 400 }}>{row.label}</span>
                  {"trend" in row && row.trend ? (
                    <span style={{ display: "inline-flex", alignItems: "center", gap: 20, color: C.indigo, fontWeight: 400 }}>
                      <Spark />
                      {row.value}
                    </span>
                  ) : (
                    <span style={{ color: C.textValue, fontWeight: 400 }}>{row.value}</span>
                  )}
                </div>
              ))}
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
