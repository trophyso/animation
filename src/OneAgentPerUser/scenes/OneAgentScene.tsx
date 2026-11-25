import React from "react";
import { useCurrentFrame } from "remotion";
import { displayFont } from "../../daylight/fonts";
import { lerp, prog } from "../../daylight/motion";
import { EASE } from "../../daylight/tokens";
import { Backdrop } from "../components/Backdrop";
import { Words, wordCount } from "../components/Words";
import { C, COPY, CUE, EASE_IN, H, W, at, f } from "../script";

export const ONE_AGENT_DURATION = f(CUE.fanOut - CUE.oneAgent);
const T = (s: number) => at("oneAgent", s);

/** The grey rail left behind by the first scene, and where the agent lands on it */
const RAIL_Y = 420;
export const AGENT_LAND = { x: 560, y: RAIL_Y };
const AGENT_R = 28;

const LEFT = 116;
const SIZE = 220;
/** Line pitch keeps the source's 232/296 ratio */
const PITCH = Math.round(SIZE * 0.784);
/** The accent line sits lower and slightly left of a plain line (source offsets, scaled) */
const ACCENT = { dx: Math.round(-21 * (SIZE / 296)), dy: Math.round(46 * (SIZE / 296)) };
/** Vertically centred: the lead lines, then the accent line and its drop */
const TOP = Math.round((H - (COPY.oneAgent.length * PITCH + ACCENT.dy)) / 2);

const LEAD = COPY.oneAgent.slice(0, -1);
const ACCENT_LINE = COPY.oneAgent[COPY.oneAgent.length - 1];

/**
 * S2 · The thesis on indigo. An indigo agent drops onto the grey rail and
 * floods the frame. The lead lines write in word by word; "for each user"
 * follows with the read. Everything lifts away and the indigo collapses back into the
 * agent node for the split paths.
 */
export const OneAgentScene: React.FC = () => {
  const frame = useCurrentFrame();

  // The agent drops onto the rail and swells to fill the frame
  const drop = prog(frame, T(6.8), f(0.2), EASE.OUT);
  const dotIn = prog(frame, T(6.8), f(0.08), EASE.SOFT);
  const flood = prog(frame, T(7.0), f(0.25), EASE_IN);
  const agentR = lerp(flood, AGENT_R, Math.hypot(W, H) * 1.1);
  const agentY = AGENT_LAND.y - (1 - drop) * 320;

  const exit = prog(frame, T(9.0), f(0.14), EASE_IN);

  return (
    <Backdrop>
      {flood < 1 ? (
        <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} style={{ position: "absolute", inset: 0 }}>
          <line x1={0} x2={W} y1={RAIL_Y} y2={RAIL_Y} stroke={C.rail} strokeWidth={8} />
        </svg>
      ) : null}
      <div
        style={{
          position: "absolute",
          left: AGENT_LAND.x - agentR,
          top: agentY - agentR,
          width: agentR * 2,
          height: agentR * 2,
          borderRadius: "50%",
          background: C.indigo,
          opacity: dotIn,
        }}
      />

      <div
        style={{
          position: "absolute",
          left: LEFT,
          top: TOP - exit * 320,
          fontFamily: displayFont,
          fontWeight: 400,
          fontSize: SIZE,
          lineHeight: `${PITCH}px`,
          letterSpacing: "-0.04em",
          whiteSpace: "nowrap",
          opacity: 1 - exit,
          filter: exit > 0 ? `blur(${(exit * 12).toFixed(2)}px)` : undefined,
        }}
      >
        <div style={{ color: C.onIndigo }}>
          {LEAD.map((line, k) => (
            <div key={line}>
              <Words text={line} start={T(7.2)} index={wordCount(LEAD.slice(0, k))} />
            </div>
          ))}
        </div>
        <div style={{ color: C.indigoLight, marginLeft: ACCENT.dx, translate: `0px ${ACCENT.dy}px` }}>
          <Words text={ACCENT_LINE} start={T(7.95)} />
        </div>
      </div>
    </Backdrop>
  );
};
