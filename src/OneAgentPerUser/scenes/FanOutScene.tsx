import React from "react";
import { useCurrentFrame } from "remotion";
import { displayFont, sansFont } from "../../daylight/fonts";
import { lerp, prog } from "../../daylight/motion";
import { EASE } from "../../daylight/tokens";
import { Backdrop } from "../components/Backdrop";
import { C, COPY, CUE, EASE_IN, H, SHADOW_PILL, W, at, f } from "../script";

export const FAN_OUT_DURATION = f(CUE.oneAgent - CUE.fanOut);
const T = (s: number) => at("fanOut", s);

/** Geometry (px) */
const RAIL_Y = 420;
const DOT_LAND = { x: 756, y: 420 };
const DOT_REST = { x: 588, y: 460 };
const DOT_R = 28;
const LINE_STROKE = 10;
const BRANCH_STROKE = 11;
const PILL_X = 1287;
const PILL_Y = [152, 345, 540, 735, 928];
const PILL_H = 83;
const AVATAR = 56;
/** The order the user pills pop in */
const PILL_ORDER = [2, 1, 3, 0, 4];

const branchPath = (from: { x: number; y: number }, to: { x: number; y: number }): string => {
  const dx = (to.x - from.x) * 0.45;
  return `M ${from.x} ${from.y} C ${from.x + dx} ${from.y}, ${to.x - dx} ${to.y}, ${to.x} ${to.y}`;
};

/**
 * S2 · The fork. An indigo agent drops onto the grey rail, takes it over and
 * fans out into five different decisions, one per user. The node then swells
 * to fill the frame and becomes the next scene's ground.
 */
export const FanOutScene: React.FC = () => {
  const frame = useCurrentFrame();

  const drop = prog(frame, T(6.8), f(0.2), EASE.OUT);
  const drift = prog(frame, T(7.0), f(1.0), EASE.MOVE);
  const dot = {
    x: lerp(drift, DOT_LAND.x, DOT_REST.x),
    y: lerp(drift, DOT_LAND.y, DOT_REST.y) - (1 - drop) * 320,
  };
  const dotIn = prog(frame, T(6.8), f(0.08), EASE.SOFT);
  const takeover = prog(frame, T(7.0), f(0.25), EASE.OUT);
  const railOut = prog(frame, T(7.1), f(0.3), EASE.SOFT);
  const swell = prog(frame, T(8.84), f(0.16), EASE_IN);
  const dotR = lerp(swell, DOT_R, Math.hypot(W, H) * 1.1);

  return (
    <Backdrop>
      <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} style={{ position: "absolute", inset: 0, overflow: "visible" }}>
        {/* The grey rail from the previous scene, fading out */}
        <line x1={0} x2={W} y1={RAIL_Y} y2={RAIL_Y} stroke={C.rail} strokeWidth={8} opacity={1 - railOut} />
        {/* The agent's line takes over the rail from the left */}
        {takeover > 0 ? (
          <line x1={-10} x2={lerp(takeover, -10, dot.x)} y1={dot.y} y2={dot.y} stroke={C.indigo} strokeWidth={LINE_STROKE} />
        ) : null}
        {/* Five branches */}
        {PILL_Y.map((y, i) => {
          const p = prog(frame, T(7.05 + i * 0.05), f(0.55), EASE.OUT);
          return (
            <path
              key={i}
              d={branchPath(dot, { x: PILL_X, y })}
              fill="none"
              stroke={i % 2 === 0 ? C.indigo : C.indigoLight}
              strokeWidth={BRANCH_STROKE}
              strokeLinecap="round"
              pathLength={1}
              strokeDasharray={1}
              strokeDashoffset={1 - p}
              opacity={p > 0 ? 1 : 0}
            />
          );
        })}
      </svg>

      {/* One pill per user */}
      {COPY.users.map((u, i) => {
        const order = PILL_ORDER.indexOf(i);
        const p = prog(frame, T(7.62 + order * 0.055), f(0.16), EASE.OUT);
        return (
          <div
            key={u.label}
            style={{
              position: "absolute",
              left: PILL_X,
              top: PILL_Y[i] - PILL_H / 2,
              height: PILL_H,
              padding: "0 30px 0 14px",
              borderRadius: 9999,
              background: "#ffffff",
              boxShadow: SHADOW_PILL,
              display: "flex",
              alignItems: "center",
              gap: 20,
              opacity: p,
              transform: `translateX(${((1 - p) * -14).toFixed(2)}px) scale(${lerp(p, 0.92, 1).toFixed(4)})`,
              transformOrigin: "0% 50%",
              whiteSpace: "nowrap",
            }}
          >
            <span
              style={{
                width: AVATAR,
                height: AVATAR,
                borderRadius: "50%",
                background: C.indigo,
                color: "#ffffff",
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                fontFamily: displayFont,
                fontWeight: 500,
                fontSize: 24,
                flex: "none",
              }}
            >
              {u.initial}
            </span>
            <span style={{ fontFamily: sansFont, fontWeight: 400, fontSize: 32, color: C.ink }}>{u.label}</span>
          </div>
        );
      })}

      {/* The agent node, last so its swell covers everything */}
      <div
        style={{
          position: "absolute",
          left: dot.x - dotR,
          top: dot.y - dotR,
          width: dotR * 2,
          height: dotR * 2,
          borderRadius: "50%",
          background: C.indigo,
          opacity: dotIn,
        }}
      />
    </Backdrop>
  );
};
