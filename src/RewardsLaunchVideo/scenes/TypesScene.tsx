import React from "react";
import { Coins, Sparkles, Ticket, Webhook } from "lucide-react";
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { monoFont, sansFont } from "../../McpLaunchVideo/fonts";
import { SceneBackground } from "../../McpLaunchVideo/components/SceneBackground";
import { Caption } from "../components/Caption";
import { CARD_SHADOW, COLORS, GOLD, REWARD_TYPES, TRANSITION_FRAMES } from "../script";

export const TYPES_DURATION = 270;

const CARD_WIDTH = 760;

const TypeCard: React.FC<{
  type: (typeof REWARD_TYPES)[number];
  index: number;
}> = ({ type, index }) => {
  const frame = useCurrentFrame() - TRANSITION_FRAMES;
  const { fps } = useVideoConfig();

  const delay = 26 + index * 14;
  const enter = spring({
    frame: frame - delay,
    fps,
    config: { damping: 15, mass: 0.6, stiffness: 110 },
  });
  const value = spring({
    frame: frame - delay - 18,
    fps,
    config: { damping: 10, mass: 0.5, stiffness: 150 },
  });
  const chip = spring({
    frame: frame - delay - 60,
    fps,
    config: { damping: 14, mass: 0.4, stiffness: 140 },
  });
  const isPoints = type.kind === "points";
  const ripple = interpolate((frame - delay - 60) % 50, [0, 50], [0, 1]);

  return (
    <div
      style={{
        width: CARD_WIDTH,
        boxSizing: "border-box",
        padding: 52,
        borderRadius: 36,
        backgroundColor: "#fff",
        border: `1px solid ${COLORS.border}`,
        boxShadow: CARD_SHADOW,
        display: "flex",
        flexDirection: "column",
        gap: 30,
        opacity: enter,
        transform: `translateY(${(1 - enter) * 90}px) rotate(${(1 - enter) * (index ? 3 : -3)}deg)`,
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 22 }}>
        <div
          style={{
            width: 84,
            height: 84,
            borderRadius: 22,
            background: isPoints
              ? `linear-gradient(145deg, #ffd978 0%, ${GOLD} 55%, #d9820b 100%)`
              : COLORS.ink,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {isPoints ? (
            <Coins size={46} color="#fff" strokeWidth={2.3} />
          ) : (
            <Ticket size={46} color="#fff" strokeWidth={2.3} />
          )}
        </div>
        <span
          style={{
            fontSize: 44,
            fontWeight: 700,
            letterSpacing: "-0.02em",
            color: COLORS.ink,
          }}
        >
          {type.name}
        </span>
      </div>

      <div
        style={{
          fontSize: 120,
          fontWeight: 800,
          letterSpacing: "-0.05em",
          lineHeight: 1,
          color: isPoints ? "#d9820b" : COLORS.green,
          transformOrigin: "left center",
          opacity: value,
          transform: `scale(${0.7 + value * 0.3})`,
        }}
      >
        {type.value}
      </div>

      <div
        style={{
          fontSize: 36,
          fontWeight: 500,
          lineHeight: 1.3,
          color: COLORS.muted,
        }}
      >
        {type.description}
      </div>

      <div
        style={{
          alignSelf: "flex-start",
          position: "relative",
          display: "flex",
          alignItems: "center",
          gap: 12,
          padding: "12px 22px",
          borderRadius: 999,
          backgroundColor: COLORS.surface,
          border: `1px solid ${COLORS.border}`,
          fontFamily: isPoints ? sansFont : monoFont,
          fontSize: 28,
          fontWeight: 600,
          color: COLORS.ink,
          opacity: chip,
          transform: `translateY(${(1 - chip) * 16}px) scale(${0.85 + chip * 0.15})`,
        }}
      >
        {isPoints ? (
          <Sparkles size={26} color={GOLD} strokeWidth={2.4} />
        ) : (
          <span style={{ position: "relative", display: "flex" }}>
            <span
              style={{
                position: "absolute",
                inset: -6,
                borderRadius: 999,
                border: `2px solid ${COLORS.green}`,
                opacity: frame > delay + 60 ? 1 - ripple : 0,
                transform: `scale(${0.6 + ripple})`,
              }}
            />
            <Webhook size={26} color={COLORS.greenDark} strokeWidth={2.4} />
          </span>
        )}
        {type.chip}
      </div>
    </div>
  );
};

export const TypesScene: React.FC = () => {
  const frame = useCurrentFrame();
  const zoom = interpolate(frame, [0, TYPES_DURATION], [1.03, 1]);

  return (
    <SceneBackground>
      <AbsoluteFill
        style={{
          fontFamily: sansFont,
          alignItems: "center",
          justifyContent: "center",
          gap: 64,
          transform: `scale(${zoom})`,
        }}
      >
        <Caption
          eyebrow="Two reward types"
          title={
            <>
              Points, or <span style={{ color: COLORS.green }}>any prize</span> you like
            </>
          }
          delay={TRANSITION_FRAMES}
        />
        <div style={{ display: "flex", gap: 48 }}>
          {REWARD_TYPES.map((type, index) => (
            <TypeCard key={type.kind} type={type} index={index} />
          ))}
        </div>
      </AbsoluteFill>
    </SceneBackground>
  );
};
