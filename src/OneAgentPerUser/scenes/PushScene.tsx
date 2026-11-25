import React from "react";
import { useCurrentFrame } from "remotion";
import { monoFont, sansFont } from "../../daylight/fonts";
import { Ph } from "../../daylight/icons";
import { lerp, prog } from "../../daylight/motion";
import { EASE } from "../../daylight/tokens";
import { Backdrop } from "../components/Backdrop";
import { Words } from "../components/Words";
import { COPY, CUE, at, f } from "../script";

export const PUSH_DURATION = f(CUE.chart - CUE.push);
const T = (s: number) => at("push", s);

/** The phone notification, as the website draws an agent's message (colours sampled from it) */
const N = {
  ink: "#16161c",
  meta: "#4a4953",
  /** The variables the agent chose */
  variable: "#32609a",
  border: "#dddde2",
  iconFrom: "#7bc3ed",
  iconTo: "#327dd6",
  /** The "why" line under the card */
  why: "#6b6a78",
};

const CARD = { w: 1240, r: 52 };
const ICON = 112;

/** The app's icon glyph: a 2x2 grid of tiles, the first one checked */
const GridGlyph: React.FC<{ size: number }> = ({ size }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" style={{ display: "block" }}>
    <rect x="3" y="3" width="8" height="8" rx="2" fill="#ffffff" />
    <path d="M5.3 7.1l1.6 1.6 2.9-3.2" fill="none" stroke={N.iconTo} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    <rect x="13" y="3" width="8" height="8" rx="2" fill="#ffffff" opacity="0.55" />
    <rect x="3" y="13" width="8" height="8" rx="2" fill="#ffffff" opacity="0.55" />
    <rect x="13" y="13" width="8" height="8" rx="2" fill="#ffffff" />
  </svg>
);

/**
 * S5 · The message the agent wrote for Mei, as a real phone notification: the
 * card lands and drifts to centre while the title and body write in, with the
 * variables the agent chose in colour. A sparkle line underneath says why it
 * went out when it did.
 */
export const PushScene: React.FC = () => {
  const frame = useCurrentFrame();
  const enter = prog(frame, T(16.56), f(0.16), EASE.OUT);
  const drift = prog(frame, T(16.54), f(1.1), EASE.MOVE);
  const breathe = prog(frame, T(17.8), f(1.4), EASE.SOFT);
  const exit = prog(frame, T(19.3), f(0.12), EASE.SOFT);
  // The sparkle pops in with a quarter turn, then twinkles
  const sparkle = prog(frame, T(17.45), f(0.35), EASE.OUT);
  const twinkle = 1 + 0.12 * Math.sin(Math.max(0, frame - T(17.8)) / 9);

  return (
    <Backdrop>
      <div
        style={{
          position: "absolute",
          left: 960 - CARD.w / 2,
          top: 540,
          width: CARD.w,
          opacity: enter * (1 - exit),
          transform: `translate(${lerp(drift, -30, 0).toFixed(2)}px, calc(-50% + ${lerp(drift, 57, 0).toFixed(2)}px)) scale(${(lerp(enter, 0.96, 1) * lerp(breathe, 1, 1.02) * lerp(exit, 1, 1.03)).toFixed(4)})`,
          filter: exit > 0 ? `blur(${(exit * 10).toFixed(2)}px)` : undefined,
        }}
      >
        {/* The notification */}
        <div
          style={{
            borderRadius: CARD.r,
            background: "#ffffff",
            border: `2px solid ${N.border}`,
            boxShadow: "0 34px 70px -30px rgba(30,40,80,0.28), 0 3px 10px rgba(30,40,80,0.06)",
            display: "flex",
            alignItems: "flex-start",
            gap: 36,
            padding: "46px 54px 50px 46px",
            boxSizing: "border-box",
          }}
        >
          <span
            style={{
              width: ICON,
              height: ICON,
              borderRadius: "24%",
              background: `linear-gradient(155deg, ${N.iconFrom} 0%, ${N.iconTo} 100%)`,
              boxShadow: "inset 0 0 0 1px rgba(0,0,0,0.06), 0 6px 14px -6px rgba(50,125,214,0.55)",
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              flex: "none",
            }}
          >
            <GridGlyph size={58} />
          </span>
          <span style={{ flex: 1, minWidth: 0, paddingTop: 2 }}>
            <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between" }}>
              <span style={{ fontFamily: sansFont, fontWeight: 500, fontSize: 34, lineHeight: "40px", color: N.meta }}>{COPY.push.app}</span>
              <span style={{ fontFamily: monoFont, fontWeight: 400, fontSize: 32, lineHeight: "40px", color: N.meta }}>{COPY.push.time}</span>
            </div>
            <div style={{ fontFamily: sansFont, fontWeight: 600, fontSize: 46, lineHeight: "56px", color: N.ink, marginTop: 10 }}>
              <Words text={COPY.push.title} start={T(16.95)} accent={N.variable} />
            </div>
            <div style={{ fontFamily: sansFont, fontWeight: 400, fontSize: 40, lineHeight: "54px", color: N.ink, marginTop: 8 }}>
              <Words text={COPY.push.body} start={T(17.15)} accent={N.variable} />
            </div>
          </span>
        </div>

        {/* Why the agent sent it then */}
        <div style={{ display: "flex", alignItems: "center", gap: 18, marginTop: 34, paddingLeft: 50 }}>
          <Ph
            name="Sparkle"
            size={40}
            color={N.why}
            style={{
              opacity: sparkle,
              transform: `rotate(${lerp(sparkle, -90, 0).toFixed(2)}deg) scale(${(lerp(sparkle, 0.3, 1) * twinkle).toFixed(4)})`,
            }}
          />
          <span style={{ fontFamily: monoFont, fontWeight: 400, fontSize: 32, lineHeight: "40px", color: N.why }}>
            <Words text={COPY.push.why} start={T(17.55)} />
          </span>
        </div>
      </div>
    </Backdrop>
  );
};
