import React from "react";
import { Gift } from "lucide-react";
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { sansFont } from "../../McpLaunchVideo/fonts";
import { SceneBackground } from "../../McpLaunchVideo/components/SceneBackground";
import { Caption } from "../components/Caption";
import { RewardIcon } from "../components/RewardIcon";
import { CARD_SHADOW, COLORS, TRANSITION_FRAMES, TRIGGERS } from "../script";

export const TRIGGERS_DURATION = 270;

const CARDS_IN = 24;
const FIRST_FIRE = 80;
const FIRE_GAP = 26;

const TriggerCard: React.FC<{
  trigger: (typeof TRIGGERS)[number];
  index: number;
}> = ({ trigger, index }) => {
  const frame = useCurrentFrame() - TRANSITION_FRAMES;
  const { fps } = useVideoConfig();

  const enter = spring({
    frame: frame - CARDS_IN - index * 6,
    fps,
    config: { damping: 15, mass: 0.6, stiffness: 120 },
  });
  const fireFrame = FIRST_FIRE + index * FIRE_GAP;
  const fire = spring({
    frame: frame - fireFrame,
    fps,
    config: { damping: 11, mass: 0.5, stiffness: 160 },
  });
  const fired = frame >= fireFrame;
  const pulse = Math.sin(Math.min(fire, 1) * Math.PI);

  return (
    <div style={{ position: "relative", width: 380 }}>
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: -86,
          display: "flex",
          justifyContent: "center",
          opacity: fired ? Math.min(fire * 1.4, 1) : 0,
          transform: `translateY(${(1 - fire) * 50}px) scale(${0.6 + fire * 0.4})`,
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
            padding: "12px 22px 12px 14px",
            borderRadius: 999,
            backgroundColor: COLORS.ink,
            color: "#fff",
            fontSize: 26,
            fontWeight: 700,
            boxShadow: "0 12px 26px -8px rgba(15, 23, 42, 0.45)",
          }}
        >
          <span
            style={{
              width: 38,
              height: 38,
              borderRadius: 999,
              backgroundColor: COLORS.green,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Gift size={22} color="#fff" strokeWidth={2.6} />
          </span>
          Reward awarded
        </div>
      </div>

      <div
        style={{
          boxSizing: "border-box",
          height: 300,
          padding: "36px 34px",
          borderRadius: 30,
          backgroundColor: "#fff",
          border: `2px solid ${fired ? COLORS.green : COLORS.border}`,
          boxShadow: fired
            ? `0 0 0 ${8 * pulse}px ${COLORS.greenSoft}, ${CARD_SHADOW}`
            : CARD_SHADOW,
          display: "flex",
          flexDirection: "column",
          gap: 22,
          opacity: enter,
          transform: `translateY(${(1 - enter) * 80}px) scale(${(0.94 + enter * 0.06) * (1 + pulse * 0.04)})`,
        }}
      >
        <div
          style={{
            width: 76,
            height: 76,
            borderRadius: 20,
            backgroundColor: fired ? COLORS.green : COLORS.surface,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <RewardIcon
            name={trigger.icon}
            size={40}
            color={fired ? "#fff" : COLORS.ink}
          />
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          <span
            style={{
              fontSize: 26,
              fontWeight: 700,
              letterSpacing: "0.04em",
              textTransform: "uppercase",
              color: COLORS.muted,
            }}
          >
            {trigger.type}
          </span>
          <span
            style={{
              fontSize: 40,
              fontWeight: 800,
              letterSpacing: "-0.03em",
              lineHeight: 1.1,
              color: COLORS.ink,
            }}
          >
            {trigger.detail}
          </span>
        </div>
      </div>
    </div>
  );
};

export const TriggersScene: React.FC = () => {
  const frame = useCurrentFrame();
  const zoom = interpolate(frame, [0, TRIGGERS_DURATION], [1, 1.04]);

  return (
    <SceneBackground>
      <AbsoluteFill
        style={{
          fontFamily: sansFont,
          alignItems: "center",
          justifyContent: "center",
          gap: 150,
          transform: `scale(${zoom})`,
        }}
      >
        <Caption
          eyebrow="Awarded automatically"
          title="Reward any milestone"
          delay={TRANSITION_FRAMES}
        />
        <div style={{ display: "flex", gap: 32 }}>
          {TRIGGERS.map((trigger, index) => (
            <TriggerCard key={trigger.type} trigger={trigger} index={index} />
          ))}
        </div>
      </AbsoluteFill>
    </SceneBackground>
  );
};
