import React from "react";
import { spring, useCurrentFrame } from "remotion";
import { displayFont, sansFont } from "../../daylight/fonts";
import { lerp, prog } from "../../daylight/motion";
import { EASE, alpha } from "../../daylight/tokens";
import { Backdrop } from "../components/Backdrop";
import { C, COPY, CUE, EASE_IN, FPS, H, SHADOW_CARD, SHADOW_PILL, W, at, f } from "../script";

export const FAN_OUT_DURATION = f(CUE.decision - CUE.fanOut);
const T = (s: number) => at("fanOut", s);

/** Geometry (px) */
const DOT_LAND = { x: 560, y: 420 };
const DOT_REST = { x: 380, y: 460 };
const DOT_R = 28;
const LINE_STROKE = 10;
const BRANCH_STROKE = 11;
const PILL_X = 1060;
const PILL_Y = [152, 345, 540, 735, 928];
const CARD_W = 740;
const CARD_H = 162;
const AVATAR = 62;
const CARD_SPRING = { damping: 13, stiffness: 160, mass: 0.8 };
/** The order the paths draw (and their messages pop) in */
const PILL_ORDER = [2, 1, 3, 0, 4];
/** Each path draws over this long, one after another */
const BRANCH_DRAW = 0.5;
const branchStart = (i: number): number => 9.5 + PILL_ORDER.indexOf(i) * 0.12;

const branchPath = (from: { x: number; y: number }, to: { x: number; y: number }): string => {
  const dx = (to.x - from.x) * 0.45;
  return `M ${from.x} ${from.y} C ${from.x + dx} ${from.y}, ${to.x - dx} ${to.y}, ${to.x} ${to.y}`;
};

/**
 * S3 · The fork. The title's indigo ground collapses into the agent node,
 * whose line runs in from the left and fans out into five paths, one per user, each ending in what that user's
 * agent decided (from the website's user stories, including Leo's agent
 * choosing to send nothing). The node then swells to fill the frame and
 * becomes the next scene's ground.
 */
export const FanOutScene: React.FC = () => {
  const frame = useCurrentFrame();

  const FULL = Math.hypot(W, H) * 1.1;
  // The indigo ground collapses into the agent node
  const collapse = prog(frame, T(9.2), f(0.3), EASE.IN_OUT);
  const drift = prog(frame, T(9.45), f(1.0), EASE.MOVE);
  const dot = {
    x: lerp(drift, DOT_LAND.x, DOT_REST.x),
    y: lerp(drift, DOT_LAND.y, DOT_REST.y),
  };
  const takeover = prog(frame, T(9.45), f(0.25), EASE.OUT);
  const swell = prog(frame, T(11.24), f(0.16), EASE_IN);
  const dotR = lerp(swell, lerp(collapse, FULL, DOT_R), FULL);

  return (
    <Backdrop>
      <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} style={{ position: "absolute", inset: 0, overflow: "visible" }}>
        {/* The agent's line takes over the rail from the left */}
        {takeover > 0 ? (
          <line x1={-10} x2={lerp(takeover, -10, dot.x)} y1={dot.y} y2={dot.y} stroke={C.indigo} strokeWidth={LINE_STROKE} />
        ) : null}
        {/* Five branches */}
        {PILL_Y.map((y, i) => {
          const p = prog(frame, T(branchStart(i)), f(BRANCH_DRAW), EASE.OUT);
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

      {/* What each user's agent decided */}
      {COPY.users.map((u, i) => {
        // Pops in as its path reaches it
        const p = spring({ frame: frame - T(branchStart(i) + BRANCH_DRAW * 0.8), fps: FPS, config: CARD_SPRING });
        const quiet = "quiet" in u && u.quiet;
        return (
          <div
            key={u.name}
            style={{
              position: "absolute",
              left: PILL_X - 6,
              top: PILL_Y[i] - CARD_H / 2,
              width: CARD_W,
              height: CARD_H,
              boxSizing: "border-box",
              padding: "18px 26px 18px 18px",
              borderRadius: 28,
              background: quiet ? alpha("#ffffff", 0.72) : "#ffffff",
              boxShadow: quiet ? SHADOW_PILL : SHADOW_CARD,
              display: "flex",
              gap: 22,
              opacity: Math.min(1, p * 1.6),
              transform: `translateX(${((1 - p) * -30).toFixed(2)}px) scale(${lerp(p, 0.8, 1).toFixed(4)})`,
              transformOrigin: "0% 50%",
            }}
          >
            <span
              style={{
                width: AVATAR,
                height: AVATAR,
                borderRadius: "50%",
                background: quiet ? C.rail : C.indigo,
                color: "#ffffff",
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                fontFamily: displayFont,
                fontWeight: 500,
                fontSize: 28,
                flex: "none",
              }}
            >
              {u.initial}
            </span>
            <span style={{ minWidth: 0, flex: 1 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 12, whiteSpace: "nowrap" }}>
                <span style={{ fontFamily: sansFont, fontWeight: 600, fontSize: 25, color: C.ink }}>{u.name}</span>
                <span
                  style={{
                    fontFamily: sansFont,
                    fontWeight: 600,
                    fontSize: 17,
                    letterSpacing: "0.06em",
                    textTransform: "uppercase",
                    color: quiet ? C.labelMuted : C.indigo,
                    background: quiet ? alpha(C.rail, 0.25) : alpha(C.indigo, 0.09),
                    borderRadius: 9999,
                    padding: "5px 11px",
                  }}
                >
                  {u.channel}
                </span>
              </div>
              <div
                style={{
                  fontFamily: displayFont,
                  fontWeight: 400,
                  fontSize: 34,
                  lineHeight: "40px",
                  letterSpacing: "-0.015em",
                  color: quiet ? C.textSub : C.ink,
                  marginTop: 7,
                  whiteSpace: "nowrap",
                }}
              >
                {u.title}
              </div>
              <div style={{ fontFamily: sansFont, fontWeight: 400, fontSize: 24, lineHeight: "30px", color: C.textSub, marginTop: 4, whiteSpace: "nowrap" }}>
                {u.body}
              </div>
            </span>
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
        }}
      />
    </Backdrop>
  );
};
