import React from "react";
import { interpolate, spring, useCurrentFrame } from "remotion";
import { displayFont, sansFont } from "../../daylight/fonts";
import { bez, lerp, prog } from "../../daylight/motion";
import { EASE } from "../../daylight/tokens";
import { Backdrop } from "../components/Backdrop";
import { Words } from "../components/Words";
import { C, COPY, CUE, EASE_IN, FPS, SHADOW_CARD, W, at, f } from "../script";

export const SAME_PATH_DURATION = f(CUE.oneAgent - CUE.samePath);
const T = (s: number) => at("samePath", s);

/** Geometry (px) */
const LINE_Y = 420;
const LINE_STROKE = 8;
const NODE_X = [360, 760, 1160, 1560];
const RING_R = 33;
const RING_STROKE = 7;
const DOT_R = 14;
/** Five users, queued single file before the first step */
const USERS = 5;
const QUEUE_X = 262;
const QUEUE_GAP = 38;
/** Past the last step the users zoom off the end of the rail */
const EXIT_X = 2060;
/**
 * Source times of each beat. On every beat each user zooms one slot forward,
 * so user k reaches step i on beat i + k: a waterfall down the rail. The
 * first four are user 1's arrivals, pinned to the voiceover in SYNC; the
 * scene lifts away just after "same message", with the last users still on
 * their way.
 */
const BEAT = [1.2, 2.5, 3.35, 4.6, 4.92, 5.24, 5.56, 5.88];
const ZOOM = 0.26;
const ZOOM_EASE: [number, number, number, number] = [0.7, 0, 0.18, 1];
/** The message card above each step */
const CARD = { w: 372, gap: 72 };

const CARD_SPRING = { damping: 13, stiffness: 170, mass: 0.8 };

/** Rail x of slot p: queue (p <= 0), the steps (1-4), then off the end (5) */
const slotX = (p: number): number => {
  if (p <= 0) return QUEUE_X + p * QUEUE_GAP;
  const stops = [QUEUE_X, ...NODE_X, EXIT_X];
  const i = Math.min(Math.floor(p), stops.length - 2);
  return lerp(p - i, stops[i], stops[i + 1]);
};

/**
 * S1 · The sequence. A grey rail with four fixed steps. The users queue
 * single file and zoom along the rail in a waterfall (user 1 hits day 2 as
 * user 2 hits day 1), and at each step the same message pops up. Everything but the rail then lifts
 * away.
 */
export const SamePathScene: React.FC = () => {
  const frame = useCurrentFrame();

  const lineW = interpolate(frame, [0, T(0.6)], [330, W], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: bez(EASE.OUT),
  });
  // The layout rises 15px as the headline arrives
  const settle = lerp(prog(frame, T(0.6), f(0.6), EASE.MOVE), 15, 0);
  const groupIn = prog(frame, T(0.45), f(0.3), EASE.OUT);
  const ringsOut = prog(frame, T(5.2), f(0.2), EASE.SOFT);
  const lift = -420 * prog(frame, T(5.3), f(0.36), EASE_IN);
  const leave = 1 - prog(frame, T(5.38), f(0.28), EASE.SOFT);

  const railY = LINE_Y + settle;
  const contentY = railY + lift;

  /** Beats completed so far (fractional mid-zoom) */
  const beats = (fr: number) => BEAT.reduce((n, b) => n + prog(fr, T(b), f(ZOOM), ZOOM_EASE), 0);
  const n = beats(frame);
  const nNext = beats(frame + 1);

  return (
    <Backdrop>
      {/* Rail: the only thing that stays for the next scene */}
      <div style={{ position: "absolute", left: 0, top: railY - LINE_STROKE / 2, width: lineW, height: LINE_STROKE, background: C.rail }} />

      {/* Steps, and the message each one sends */}
      {NODE_X.map((x, i) => {
        const inP = prog(frame, T(0.35 + i * 0.08), f(0.4), EASE.OUT);
        const arrive = frame - T(BEAT[i]) - f(ZOOM * 0.6);
        const pulse = arrive > 0 ? Math.sin(Math.min(1, arrive / 14) * Math.PI) : 0;
        const card = spring({ frame: arrive, fps: FPS, config: CARD_SPRING });
        const node = COPY.nodes[i];
        const msg = COPY.sequence[i];
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
                transform: `scale(${(lerp(inP, 0.5, 1) * lerp(ringsOut, 1, 0.85) * (1 + pulse * 0.22)).toFixed(4)})`,
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

            {/* The step's message, popping up as the users land */}
            {arrive > 0 ? (
              <div
                style={{
                  position: "absolute",
                  left: x - CARD.w / 2,
                  bottom: 1080 - (contentY - CARD.gap),
                  width: CARD.w,
                  boxSizing: "border-box",
                  padding: "24px 28px 26px",
                  borderRadius: 24,
                  background: "#ffffff",
                  boxShadow: SHADOW_CARD,
                  opacity: Math.min(1, card * 1.6) * leave,
                  transformOrigin: "50% 100%",
                  transform: `translateY(${((1 - card) * 26).toFixed(2)}px) scale(${lerp(card, 0.72, 1).toFixed(4)})`,
                }}
              >
                <div
                  style={{
                    fontFamily: displayFont,
                    fontWeight: 400,
                    fontSize: 34,
                    lineHeight: "40px",
                    letterSpacing: "-0.02em",
                    color: C.ink,
                  }}
                >
                  {msg.title}
                </div>
                <div style={{ fontFamily: sansFont, fontWeight: 400, fontSize: 25, lineHeight: "32px", color: C.textSub, marginTop: 8 }}>{msg.body}</div>
              </div>
            ) : null}
          </React.Fragment>
        );
      })}

      {/* The users zoom step to step in single file: user k is always k slots behind user 1 */}
      {Array.from({ length: USERS }, (_, k) => {
        const x = slotX(n - k);
        // Stretch along the rail while zooming
        const stretch = 1 + Math.min(1.2, Math.abs(slotX(nNext - k) - x) / 40);
        const gone = prog(x, NODE_X[3] + 120, 260, EASE.OUT);
        return (
          <div
            key={k}
            style={{
              position: "absolute",
              left: x - DOT_R,
              top: contentY - DOT_R,
              width: DOT_R * 2,
              height: DOT_R * 2,
              borderRadius: "50%",
              background: C.walker,
              boxShadow: "0 0 0 4px " + C.bg,
              opacity: groupIn * leave * (1 - gone),
              transform: `scale(${(lerp(groupIn, 0.4, 1) * stretch).toFixed(4)}, ${lerp(groupIn, 0.4, 1).toFixed(4)})`,
            }}
          />
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
          lineHeight: 1.06,
          letterSpacing: "-0.03em",
          color: C.ink,
          maxWidth: W - 2 * 122,
          textWrap: "balance",
          opacity: leave,
        }}
      >
        <Words text={COPY.samePath} start={T(0.6)} />
      </div>
    </Backdrop>
  );
};
