import React from "react";
import { interpolate, useCurrentFrame } from "remotion";
import { displayFont, sansFont } from "../../daylight/fonts";
import { bez, fadeUp, lerp, prog } from "../../daylight/motion";
import { EASE } from "../../daylight/tokens";
import { Backdrop } from "../components/Backdrop";
import { C, COPY, CUE, EASE_IN, FPS, SHADOW_PILL, W, at, f } from "../script";

export const SAME_PATH_DURATION = f(CUE.fanOut - CUE.samePath);
const T = (s: number) => at("samePath", s);

/** Geometry (px) */
const LINE_Y = 420;
const LINE_STROKE = 8;
const NODE_X = [360, 760, 1160, 1560];
const RING_R = 33;
const RING_STROKE = 7;
const DOT_R = 15;
const DOT_GAP = 150;
const DOT_SPEED = 85; // px per second
const DOTS = 6;
const PILL_W = 130;
const PILL_H = 48;
const PILL_LIFT = 98;

/** Walker i's centre x at time t (seconds): walker 0 sits at x=429 at 4.6 s and x=582 at 6.4 s */
const walkerX = (i: number, t: number): number => 429 + DOT_SPEED * (t - 4.6) + i * DOT_GAP;

/**
 * S1 · The sequence. A grey rail with four fixed steps; identical grey walkers
 * pass every step in lockstep, the line lands, and every walker gets the same
 * "We miss you!". Everything but the rail then lifts away.
 */
export const SamePathScene: React.FC = () => {
  const frame = useCurrentFrame();
  const t = frame / FPS;

  const lineW = interpolate(frame, [0, T(0.6)], [330, W], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: bez(EASE.OUT),
  });
  // The layout rises 15px as the headline arrives
  const settle = lerp(prog(frame, T(2.9), f(0.6), EASE.MOVE), 15, 0);
  const walkersIn = prog(frame, T(0.35), f(0.15), EASE.SOFT);
  const ringsOut = prog(frame, T(6.3), f(0.2), EASE.SOFT);
  const lift = -420 * prog(frame, T(6.42), f(0.36), EASE_IN);
  const leave = 1 - prog(frame, T(6.5), f(0.28), EASE.SOFT);
  const headline = fadeUp(frame, T(2.9), f(0.55), 22, EASE.OUT);

  const railY = LINE_Y + settle;
  const contentY = railY + lift;

  return (
    <Backdrop>
      {/* Rail: the only thing that stays for the next scene */}
      <div style={{ position: "absolute", left: 0, top: railY - LINE_STROKE / 2, width: lineW, height: LINE_STROKE, background: C.rail }} />

      {/* Steps */}
      {NODE_X.map((x, i) => {
        const inP = prog(frame, T(0.35 + i * 0.08), f(0.4), EASE.OUT);
        const node = COPY.nodes[i];
        return (
          <React.Fragment key={node.day}>
            <div
              style={{
                position: "absolute",
                left: x - RING_R - RING_STROKE / 2,
                top: railY - RING_R - RING_STROKE / 2,
                width: RING_R * 2 + RING_STROKE,
                height: RING_R * 2 + RING_STROKE,
                borderRadius: "50%",
                border: `${RING_STROKE}px solid ${C.rail}`,
                background: C.bg,
                boxSizing: "border-box",
                opacity: inP * (1 - ringsOut),
                transform: `scale(${(lerp(inP, 0.5, 1) * lerp(ringsOut, 1, 0.85)).toFixed(4)})`,
              }}
            />
            <div
              style={{
                position: "absolute",
                left: x - 150,
                width: 300,
                top: contentY + 54,
                textAlign: "center",
                opacity: inP * leave,
                translate: `0px ${((1 - inP) * 8).toFixed(2)}px`,
              }}
            >
              <div style={{ fontFamily: sansFont, fontWeight: 600, fontSize: 25, lineHeight: "32px", color: C.labelStrong }}>{node.day}</div>
              <div style={{ fontFamily: sansFont, fontWeight: 400, fontSize: 26, lineHeight: "32px", color: C.labelMuted }}>{node.sub}</div>
            </div>
          </React.Fragment>
        );
      })}

      {/* Walkers and their identical message */}
      {Array.from({ length: DOTS }, (_, i) => {
        const x = walkerX(i, t);
        if (x < -40 || x > W + 40) return null;
        const pillP = prog(frame, T(5.75 + i * 0.03), f(0.18), EASE.OUT);
        return (
          <React.Fragment key={i}>
            <div
              style={{
                position: "absolute",
                left: x - DOT_R,
                top: contentY - DOT_R,
                width: DOT_R * 2,
                height: DOT_R * 2,
                borderRadius: "50%",
                background: C.walker,
                opacity: walkersIn * leave,
              }}
            />
            {pillP > 0 ? (
              <div
                style={{
                  position: "absolute",
                  left: x - PILL_W / 2,
                  top: contentY - PILL_LIFT - PILL_H / 2,
                  width: PILL_W,
                  height: PILL_H,
                  borderRadius: 14,
                  background: "#ffffff",
                  boxShadow: SHADOW_PILL,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontFamily: sansFont,
                  fontWeight: 500,
                  fontSize: 18,
                  color: C.ink,
                  whiteSpace: "nowrap",
                  opacity: pillP * leave,
                  transform: `translateY(${((1 - pillP) * 10).toFixed(2)}px) scale(${lerp(pillP, 0.9, 1).toFixed(4)})`,
                }}
              >
                {COPY.blast}
              </div>
            ) : null}
          </React.Fragment>
        );
      })}

      {/* Headline */}
      <div
        style={{
          position: "absolute",
          left: 122,
          top: 640 + settle + lift,
          fontFamily: displayFont,
          fontWeight: 400,
          fontSize: 102,
          lineHeight: 1,
          letterSpacing: "-0.03em",
          color: C.ink,
          whiteSpace: "nowrap",
          ...headline,
          opacity: (headline.opacity as number) * leave,
        }}
      >
        {COPY.samePath}
      </div>
    </Backdrop>
  );
};
