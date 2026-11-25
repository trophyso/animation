import React from "react";
import { useCurrentFrame } from "remotion";
import { displayFont, sansFont } from "../../daylight/fonts";
import { blurIn, lerp, prog } from "../../daylight/motion";
import { EASE } from "../../daylight/tokens";
import { Backdrop } from "../components/Backdrop";
import { C, COPY, CUE, SHADOW_CARD, at, f } from "../script";

export const PUSH_DURATION = f(CUE.chart - CUE.push);
const T = (s: number) => at("push", s);

const CARD = { x: 460, y: 432, w: 1000, h: 216, r: 30 };
const ICON = 62;

/** A filled puzzle piece for the mock app icon */
const PuzzleGlyph: React.FC<{ size: number }> = ({ size }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" style={{ display: "block" }}>
    <path
      fill="#ffffff"
      d="M10.4 2.4a2.3 2.3 0 0 0-2.3 2.3v1.4H5.3A1.8 1.8 0 0 0 3.5 7.9v2.9h1.6a2.4 2.4 0 1 1 0 4.8H3.5v2.9a1.8 1.8 0 0 0 1.8 1.8h2.9v-1.6a2.4 2.4 0 1 1 4.8 0v1.6h2.9a1.8 1.8 0 0 0 1.8-1.8v-2.9h1.5a2.3 2.3 0 1 0 0-4.6h-1.5V7.9a1.8 1.8 0 0 0-1.8-1.8h-2.9V4.7a2.3 2.3 0 0 0-2.3-2.3Z"
    />
  </svg>
);

/**
 * S5 · The message the agent actually sent Mei. The card lands slightly low
 * and left and drifts to centre while the title and body write in.
 */
export const PushScene: React.FC = () => {
  const frame = useCurrentFrame();
  const enter = prog(frame, T(16.86), f(0.16), EASE.OUT);
  const drift = prog(frame, T(16.84), f(1.1), EASE.MOVE);
  const breathe = prog(frame, T(18.0), f(1.2), EASE.SOFT);
  const exit = prog(frame, T(19.1), f(0.1), EASE.SOFT);

  return (
    <Backdrop>
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
          display: "flex",
          alignItems: "flex-start",
          gap: 35,
          padding: "40px 44px",
          boxSizing: "border-box",
          opacity: enter * (1 - exit),
          transform: `translate(${lerp(drift, -30, 0).toFixed(2)}px, ${lerp(drift, 57, 0).toFixed(2)}px) scale(${(lerp(enter, 0.96, 1) * lerp(breathe, 1, 1.02) * lerp(exit, 1, 1.03)).toFixed(4)})`,
          filter: exit > 0 ? `blur(${(exit * 10).toFixed(2)}px)` : undefined,
        }}
      >
        <span
          style={{
            width: ICON,
            height: ICON,
            borderRadius: "23%",
            background: C.indigo,
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            flex: "none",
            boxShadow: "inset 0 0 0 0.5px rgba(0,0,0,0.12)",
          }}
        >
          <PuzzleGlyph size={36} />
        </span>
        <span style={{ paddingTop: 6 }}>
          <div
            style={{
              fontFamily: sansFont,
              fontSize: 20,
              lineHeight: "20px",
              fontWeight: 600,
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              color: C.steelText,
            }}
          >
            {COPY.push.app}
          </div>
          <div
            style={{
              fontFamily: displayFont,
              fontSize: 44.5,
              lineHeight: "52px",
              fontWeight: 400,
              letterSpacing: "-0.025em",
              color: C.ink,
              marginTop: 10,
              ...blurIn(frame, T(17.25), f(0.25), 8),
            }}
          >
            {COPY.push.title}
          </div>
          <div style={{ fontFamily: sansFont, fontSize: 30, lineHeight: "36px", fontWeight: 400, color: C.textBody, marginTop: 8, ...blurIn(frame, T(17.6), f(0.3), 6) }}>
            {COPY.push.body}
          </div>
        </span>
      </div>
    </Backdrop>
  );
};
