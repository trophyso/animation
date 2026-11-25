import React from "react";
import { useCurrentFrame } from "remotion";
import { displayFont } from "../../daylight/fonts";
import { Logo } from "../../daylight/Logo";
import { lerp, prog, revealLeftToRight } from "../../daylight/motion";
import { EASE } from "../../daylight/tokens";
import { Backdrop } from "../components/Backdrop";
import { Cursor } from "../components/Cursor";
import { C, COPY, CUE, EASE_IN, at, f } from "../script";
import { DOT_TARGET } from "./ChartScene";

export const OUTRO_DURATION = f(CUE.end - CUE.outro);
const T = (s: number) => at("outro", s);

const LOGO_W = 593;
const LOGO_H = (LOGO_W * 155) / 596;
const LOGO_LEFT = 960 - LOGO_W / 2;
const LOGO_TOP = 540 - LOGO_H / 2;
/** The mark's centre inside the logo box (viewBox 60,77 of 596x155) */
const MARK_ORIGIN = `${((60 / 596) * 100).toFixed(2)}% ${((77 / 155) * 100).toFixed(2)}%`;
const BUTTON = { w: 398, h: 102, cx: 961, cy: 540 };
const CURSOR_FROM = { x: 1560, y: 860 };
const CURSOR_TO = { x: 1112, y: 530 };

const hidden: React.CSSProperties = { opacity: 0 };

/** S7 · Brand close and the call to action, clicked */
export const OutroScene: React.FC = () => {
  const frame = useCurrentFrame();

  const glow = prog(frame, 0, f(0.1), EASE.SOFT);
  // The chart's dot lands here and blooms into a lavender disc behind the mark
  const bloom = prog(frame, T(25.6), f(0.45), EASE.OUT);
  const bloomFade = prog(frame, T(25.6), f(0.45), [0, 0, 1, 1]);
  const markIn = prog(frame, T(25.7), f(0.25), EASE.OUT);
  const wordIn = prog(frame, T(25.95), f(0.3), EASE.MOVE);
  const logoOut = prog(frame, T(27.68), f(0.2), EASE_IN);
  const buttonIn = prog(frame, T(28.0), f(0.15), EASE.OUT);
  const cursorP = prog(frame, T(28.15), f(0.8), EASE.MOVE);
  const press = prog(frame, T(29.1), f(0.08), EASE.OUT) * (1 - prog(frame, T(29.25), f(0.15), EASE.OUT));

  const cursor = { x: lerp(cursorP, CURSOR_FROM.x, CURSOR_TO.x), y: lerp(cursorP, CURSOR_FROM.y, CURSOR_TO.y) };
  const speed = prog(frame + 1, T(28.15), f(0.8), EASE.MOVE) - cursorP;
  const cursorBlur = Math.min(6, speed * 220);

  return (
    <Backdrop glow={glow}>
      {/* Lavender bloom from the incoming dot */}
      {bloomFade < 1 ? (
        <div
          style={{
            position: "absolute",
            left: DOT_TARGET.x - 45,
            top: DOT_TARGET.y - 45,
            width: 90,
            height: 90,
            borderRadius: "50%",
            background: bloom < 0.1 ? C.indigo : C.indigoLight,
            opacity: bloom < 0.1 ? 1 : lerp(bloomFade, 0.85, 0),
            transform: `scale(${lerp(bloom, 12 / 45, 1).toFixed(4)})`,
          }}
        />
      ) : null}

      {/* Logo: the mark pops from the dot, the wordmark wipes in */}
      <div
        style={{
          position: "absolute",
          left: LOGO_LEFT,
          top: LOGO_TOP - logoOut * 135,
          width: LOGO_W,
          height: LOGO_H,
          opacity: 1 - logoOut,
          filter: logoOut > 0 ? `blur(${(logoOut * 10).toFixed(2)}px)` : undefined,
        }}
      >
        <div style={{ position: "absolute", inset: 0, transformOrigin: MARK_ORIGIN, transform: `scale(${lerp(markIn, 0.3, 1).toFixed(4)})`, opacity: markIn }}>
          <Logo width={LOGO_W} color={C.ink} word={hidden} />
        </div>
        <div style={{ position: "absolute", inset: 0, ...revealLeftToRight(wordIn) }}>
          <Logo width={LOGO_W} color={C.ink} lower={hidden} upper={hidden} />
        </div>
      </div>

      {/* Call to action */}
      <div
        style={{
          position: "absolute",
          left: BUTTON.cx - BUTTON.w / 2,
          top: BUTTON.cy - BUTTON.h / 2,
          width: BUTTON.w,
          height: BUTTON.h,
          borderRadius: 9999,
          background: C.button,
          boxShadow: "0 16px 32px -12px rgba(10,20,30,0.45)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: displayFont,
          fontWeight: 400,
          fontSize: 46,
          letterSpacing: "-0.02em",
          color: "#f5f5f5",
          opacity: buttonIn,
          transform: `scale(${(lerp(buttonIn, 0.9, 1) * lerp(press, 1, 0.95)).toFixed(4)})`,
        }}
      >
        {COPY.cta}
      </div>

      {cursorP > 0 ? <Cursor x={cursor.x} y={cursor.y} style={{ filter: `drop-shadow(0 4px 6px rgba(0,0,0,0.3))${cursorBlur > 0.2 ? ` blur(${cursorBlur.toFixed(2)}px)` : ""}` }} /> : null}
    </Backdrop>
  );
};
