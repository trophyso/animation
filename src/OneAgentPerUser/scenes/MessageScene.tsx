import React from "react";
import { useCurrentFrame } from "remotion";
import { AppIcon } from "../../daylight/AppIcon";
import { displayFont, monoFont, sansFont } from "../../daylight/fonts";
import { Ph } from "../../daylight/icons";
import { lerp, prog } from "../../daylight/motion";
import { EASE } from "../../daylight/tokens";
import { Backdrop } from "../components/Backdrop";
import { Words } from "../components/Words";
import type { Ground } from "../ground";
import { f } from "../script";
import type { Message, Story } from "../stories";
import { MESSAGE } from "../timeline";
import { useScene } from "../video";

/** The notification, as the website draws an agent's message (colours sampled from it) */
const N = {
  ink: "#16161c",
  meta: "#4a4953",
  muted: "#6b6a78",
  border: "#dddde2",
};

const CARD = { w: 1240, r: 52 };
const ICON = 112;
const CARD_STYLE: React.CSSProperties = {
  borderRadius: CARD.r,
  background: "#ffffff",
  border: `2px solid ${N.border}`,
  boxShadow: "0 34px 70px -30px rgba(30,40,80,0.28), 0 3px 10px rgba(30,40,80,0.06)",
  boxSizing: "border-box",
};

/** The push or email the agent wrote, written in word by word */
const Notification: React.FC<{ story: Story; m: Extract<Message, { kind: "sent" }>; ground: Ground; title: number; body: number }> = ({
  story,
  m,
  ground,
  title,
  body,
}) => (
  <div style={{ ...CARD_STYLE, display: "flex", alignItems: "flex-start", gap: 36, padding: "46px 54px 50px 46px" }}>
    <AppIcon app={story.app} size={ICON} style={{ boxShadow: "inset 0 0 0 1px rgba(0,0,0,0.06), 0 6px 14px -6px rgba(30,40,80,0.45)" }} />
    <span style={{ flex: 1, minWidth: 0, paddingTop: 2 }}>
      <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between" }}>
        <span style={{ fontFamily: sansFont, fontWeight: 500, fontSize: 34, lineHeight: "40px", color: N.meta }}>
          {story.app}
          {m.channel === "email" ? " · Email" : ""}
        </span>
        <span style={{ fontFamily: monoFont, fontWeight: 400, fontSize: 32, lineHeight: "40px", color: N.meta }}>{m.time}</span>
      </div>
      <div style={{ fontFamily: sansFont, fontWeight: 600, fontSize: 46, lineHeight: "56px", color: N.ink, marginTop: 10 }}>
        <Words text={m.title} start={title} accent={ground.accent} />
      </div>
      <div style={{ fontFamily: sansFont, fontWeight: 400, fontSize: 40, lineHeight: "54px", color: N.ink, marginTop: 8 }}>
        <Words text={m.body} start={body} accent={ground.accent} />
      </div>
    </span>
  </div>
);

/**
 * When the agent sends nothing: the website's baseline widget, full size. The
 * odds the person does it anyway fill in grey, the most a message could add
 * appears in the theme colour, then the verdict: nothing sent.
 */
const Odds: React.FC<{ story: Story; m: Extract<Message, { kind: "restraint" }>; ground: Ground; enter: number }> = ({ story, m, ground, enter }) => {
  const frame = useCurrentFrame();
  const t = MESSAGE.odds;
  const fill = prog(frame, enter + f(t.fill), f(t.fillFor), EASE.IN_OUT);
  const best = prog(frame, enter + f(t.best), f(0.35), EASE.OUT);
  const verdict = prog(frame, enter + f(t.verdict), f(0.35), EASE.OUT);
  const PAD = 60;
  const BAR = CARD.w - PAD * 2;
  return (
    <div style={{ ...CARD_STYLE, padding: PAD }}>
      <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between" }}>
        <span style={{ fontFamily: sansFont, fontSize: 40, color: N.muted }}>{m.odds.label}</span>
        <span style={{ fontFamily: displayFont, fontSize: 150, lineHeight: 1, letterSpacing: "-0.04em", color: N.ink, fontVariantNumeric: "tabular-nums" }}>
          {Math.round(m.odds.base * fill)}
          <span style={{ fontSize: 80 }}>%</span>
        </span>
      </div>
      {/* What happens anyway in grey, then the sliver a message could add */}
      <div style={{ position: "relative", height: 56, borderRadius: 16, background: "rgba(22,22,29,0.08)", overflow: "hidden", marginTop: 26 }}>
        <span style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: BAR * (m.odds.base / 100) * fill, background: "rgba(22,22,29,0.32)" }} />
        <span style={{ position: "absolute", left: BAR * (m.odds.base / 100), top: 0, bottom: 0, width: BAR * (m.odds.best / 100) * best, background: ground.brand }} />
      </div>
      <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 14, fontFamily: monoFont, fontSize: 28, color: ground.brand, opacity: best }}>
        +{m.odds.best}% at best, with a reminder
      </div>
      <div style={{ height: 2, background: "#e9e9e9", margin: "40px 0 34px", opacity: verdict }} />
      <div style={{ display: "flex", alignItems: "center", gap: 28, opacity: verdict, transform: `translateY(${((1 - verdict) * 14).toFixed(1)}px)` }}>
        <AppIcon app={story.app} size={84} style={{ filter: "grayscale(1)", opacity: 0.5 }} />
        <span style={{ flex: 1 }}>
          <div style={{ fontFamily: sansFont, fontWeight: 600, fontSize: 44, color: N.ink }}>{m.title}</div>
          <div style={{ fontFamily: sansFont, fontSize: 34, color: N.muted, marginTop: 4 }}>{m.body}</div>
        </span>
        <span style={{ fontFamily: monoFont, fontSize: 28, color: "#ffffff", background: ground.brand, borderRadius: 999, padding: "12px 22px" }}>Nothing sent</span>
      </div>
    </div>
  );
};

/**
 * S5 · What the agent did. Usually the message it wrote, as a real phone
 * notification or email: the card lands and drifts to centre while the title
 * and body write in, with the words the agent chose for this person in the
 * theme colour. When the agent chose to send nothing, the odds that made it
 * hold back. A sparkle line underneath says why.
 */
export const MessageScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { T, ground, story } = useScene("message");
  const m = story.message;

  const enterAt = T(MESSAGE.enter);
  const enter = prog(frame, enterAt, f(0.16), EASE.OUT);
  const drift = prog(frame, T(MESSAGE.enter - 0.02), f(1.1), EASE.MOVE);
  const breathe = prog(frame, T(17.8), f(1.4), EASE.SOFT);
  const exit = prog(frame, T(MESSAGE.exit), f(0.12), EASE.SOFT);
  const title = T(MESSAGE.title);
  const body = title + f(MESSAGE.bodyGap);
  const why = m.kind === "sent" ? body + f(MESSAGE.whyGap) : enterAt + f(MESSAGE.odds.why);
  // The sparkle pops in with a quarter turn, then twinkles
  const sparkle = prog(frame, why - f(0.1), f(0.35), EASE.OUT);
  const twinkle = 1 + 0.12 * Math.sin(Math.max(0, frame - why - f(0.25)) / 9);

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
        {m.kind === "sent" ? <Notification story={story} m={m} ground={ground} title={title} body={body} /> : <Odds story={story} m={m} ground={ground} enter={enterAt} />}

        {/* Why the agent sent it then (or didn't) */}
        <div style={{ display: "flex", alignItems: "center", gap: 18, marginTop: 34, paddingLeft: 50 }}>
          <Ph
            name="Sparkle"
            size={40}
            color={ground.sub}
            style={{
              opacity: sparkle,
              transform: `rotate(${lerp(sparkle, -90, 0).toFixed(2)}deg) scale(${(lerp(sparkle, 0.3, 1) * twinkle).toFixed(4)})`,
            }}
          />
          <span style={{ fontFamily: monoFont, fontWeight: 400, fontSize: 32, lineHeight: "40px", color: ground.sub }}>
            <Words text={m.why} start={why} />
          </span>
        </div>
      </div>
    </Backdrop>
  );
};
