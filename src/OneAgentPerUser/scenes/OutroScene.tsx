import React from "react";
import { useCurrentFrame } from "remotion";
import { displayFont, sansFont } from "../../daylight/fonts";
import { Logo } from "../../daylight/Logo";
import { lerp, prog, revealLeftToRight } from "../../daylight/motion";
import { EASE } from "../../daylight/tokens";
import { Backdrop } from "../components/Backdrop";
import { Cursor } from "../components/Cursor";
import { Words, wordCount } from "../components/Words";
import { COPY, EASE_IN, f } from "../script";
import { BUTTON as BUTTON_COLOURS } from "../ground";
import { useScene } from "../video";
import { DOT_TARGET } from "./ChartScene";

/** The close: logo, button and domain stacked about the centre */
const LOGO_W = 470;
const LOGO_H = (LOGO_W * 155) / 596;
const LOGO_TOP = 300;
/** The mark's centre inside the logo box (viewBox 60,77 of 596x155) */
const MARK_ORIGIN = `${((60 / 596) * 100).toFixed(2)}% ${((77 / 155) * 100).toFixed(2)}%`;
const BUTTON = { w: 398, h: 102, cx: 960, cy: 606 };
const DOMAIN_Y = 712;
const CURSOR_FROM = { x: 1560, y: 900 };
const CURSOR_TO = { x: 1108, y: 598 };

const STATEMENT_SIZE = 112;

const hidden: React.CSSProperties = { opacity: 0 };

/**
 * S7 · The close. The chart's dot blooms into the statement, written in word
 * by word; it clears for the logo, the call to action and the domain (up
 * straight away), and the button is clicked.
 */
export const OutroScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { T, ground } = useScene("outro");

  const glow = prog(frame, 0, f(0.1), EASE.SOFT);
  // The chart's dot lands here and blooms into a lavender disc
  const bloom = prog(frame, T(25.6), f(0.45), EASE.OUT);
  const bloomFade = prog(frame, T(25.6), f(0.45), [0, 0, 1, 1]);

  // Statement
  const statementOut = prog(frame, T(27.3), f(0.25), EASE_IN);

  // Logo, button, domain
  const markIn = prog(frame, T(27.55), f(0.25), EASE.OUT);
  const wordIn = prog(frame, T(27.75), f(0.3), EASE.MOVE);
  const buttonIn = prog(frame, T(28.0), f(0.18), EASE.OUT);
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
            background: bloom < 0.1 ? ground.agent : ground.agentLight,
            opacity: bloom < 0.1 ? 1 : lerp(bloomFade, 0.85, 0),
            transform: `scale(${lerp(bloom, 12 / 45, 1).toFixed(4)})`,
          }}
        />
      ) : null}

      {/* "Stop sending generic sequences users ignore." */}
      {statementOut < 1 ? (
        <div
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            top: 540 - STATEMENT_SIZE,
            textAlign: "center",
            fontFamily: displayFont,
            fontWeight: 400,
            fontSize: STATEMENT_SIZE,
            lineHeight: `${STATEMENT_SIZE}px`,
            letterSpacing: "-0.035em",
            color: ground.ink,
            opacity: 1 - statementOut,
            transform: `translateY(${(-statementOut * 90).toFixed(2)}px)`,
            filter: statementOut > 0 ? `blur(${(statementOut * 12).toFixed(2)}px)` : undefined,
          }}
        >
          {COPY.statement.map((line, k) => (
            <div key={line}>
              <Words text={line} start={T(25.7)} index={wordCount(COPY.statement.slice(0, k))} />
            </div>
          ))}
        </div>
      ) : null}

      {/* Logo: the mark pops, the wordmark wipes in */}
      <div style={{ position: "absolute", left: 960 - LOGO_W / 2, top: LOGO_TOP, width: LOGO_W, height: LOGO_H }}>
        <div style={{ position: "absolute", inset: 0, transformOrigin: MARK_ORIGIN, transform: `scale(${lerp(markIn, 0.3, 1).toFixed(4)})`, opacity: markIn }}>
          <Logo width={LOGO_W} color={ground.ink} word={hidden} />
        </div>
        <div style={{ position: "absolute", inset: 0, ...revealLeftToRight(wordIn) }}>
          <Logo width={LOGO_W} color={ground.ink} lower={hidden} upper={hidden} />
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
          background: BUTTON_COLOURS.background,
          boxShadow: "0 16px 32px -12px rgba(10,20,30,0.45)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: displayFont,
          fontWeight: 400,
          fontSize: 46,
          letterSpacing: "-0.02em",
          color: BUTTON_COLOURS.ink,
          opacity: buttonIn,
          transform: `scale(${(lerp(buttonIn, 0.9, 1) * lerp(press, 1, 0.95)).toFixed(4)})`,
        }}
      >
        {COPY.cta}
      </div>

      {/* The website, for anyone who'd rather look first */}
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: DOMAIN_Y,
          textAlign: "center",
          fontFamily: sansFont,
          fontWeight: 500,
          fontSize: 40,
          letterSpacing: "-0.005em",
          color: ground.sub,
        }}
      >
        {/* Straight after the button, so the address is up for the whole close */}
        <Words text={COPY.domain} start={T(28.1)} />
      </div>

      {cursorP > 0 ? <Cursor x={cursor.x} y={cursor.y} style={{ filter: `drop-shadow(0 4px 6px rgba(0,0,0,0.3))${cursorBlur > 0.2 ? ` blur(${cursorBlur.toFixed(2)}px)` : ""}` }} /> : null}
    </Backdrop>
  );
};
