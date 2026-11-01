import React from "react";
import {
  AbsoluteFill,
  Img,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { sansFont } from "../../McpLaunchVideo/fonts";
import { SceneBackground } from "../../McpLaunchVideo/components/SceneBackground";
import { smoothTransform } from "../../McpLaunchVideo/components/smoothTransform";
import { RewardIcon } from "../components/RewardIcon";
import { COLORS, FLOATING_REWARDS, GOLD } from "../script";

export const INTRO_DURATION = 180;

export const IntroScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const logo = spring({ frame, fps, config: { damping: 18, mass: 0.6 } });
  const line1 = spring({
    frame: frame - 8,
    fps,
    config: { damping: 16, mass: 0.5, stiffness: 110 },
  });
  const line2 = spring({
    frame: frame - 16,
    fps,
    config: { damping: 12, mass: 0.6, stiffness: 120 },
  });
  const subtitle = spring({
    frame: frame - 40,
    fps,
    config: { damping: 18, mass: 0.5 },
  });
  const zoom = interpolate(frame, [0, INTRO_DURATION], [1, 1.06]);

  return (
    <SceneBackground>
      <AbsoluteFill style={smoothTransform(`scale(${zoom})`)}>
        {FLOATING_REWARDS.map((reward) => {
          const appear = spring({
            frame: frame - reward.delay,
            fps,
            config: { damping: 12, mass: 0.5, stiffness: 140 },
          });
          const drift = Math.sin((frame + reward.delay * 3) / 36) * 10;
          return (
            <div
              key={reward.label}
              style={{
                position: "absolute",
                left: reward.x,
                top: reward.y,
                display: "flex",
                alignItems: "center",
                gap: 14,
                padding: "14px 24px 14px 14px",
                borderRadius: 18,
                backgroundColor: "#fff",
                border: `1px solid ${COLORS.border}`,
                boxShadow: "0 8px 20px -6px rgba(15, 23, 42, 0.12)",
                fontFamily: sansFont,
                fontSize: 30,
                fontWeight: 700,
                color: COLORS.ink,
                opacity: appear * 0.85,
                ...smoothTransform(
                  `translateY(${(1 - appear) * 40 + drift}px) scale(${0.8 + appear * 0.2})`,
                ),
              }}
            >
              <span
                style={{
                  width: 46,
                  height: 46,
                  borderRadius: 12,
                  backgroundColor: COLORS.greenSoft,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <RewardIcon name={reward.icon} size={26} color={COLORS.greenDark} />
              </span>
              {reward.label}
            </div>
          );
        })}

        <AbsoluteFill
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            fontFamily: sansFont,
            textAlign: "center",
          }}
        >
          <Img
            src={staticFile("brand/logo_light.svg")}
            style={{
              width: 250,
              marginBottom: 52,
              opacity: logo,
              transform: `translateY(${(1 - logo) * 20}px)`,
            }}
          />
          <div
            style={{
              fontSize: 64,
              fontWeight: 600,
              color: COLORS.muted,
              letterSpacing: "-0.02em",
              opacity: line1,
              transform: `translateY(${(1 - line1) * 24}px)`,
            }}
          >
            Introducing
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 36,
              fontSize: 168,
              fontWeight: 800,
              lineHeight: 1.05,
              color: COLORS.ink,
              letterSpacing: "-0.05em",
              opacity: line2,
              transform: `translateY(${(1 - line2) * 30}px) scale(${0.92 + line2 * 0.08})`,
            }}
          >
            <span
              style={{
                width: 150,
                height: 150,
                borderRadius: 40,
                background: `linear-gradient(145deg, #ffd978 0%, ${GOLD} 55%, #d9820b 100%)`,
                boxShadow: "0 18px 40px -12px rgba(217, 130, 11, 0.55)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                transform: `rotate(${(1 - line2) * -30}deg)`,
              }}
            >
              <RewardIcon name="gift" size={88} color="#fff" strokeWidth={2.4} />
            </span>
            <span style={{ color: COLORS.green }}>Rewards</span>
          </div>
          <div
            style={{
              marginTop: 40,
              fontSize: 48,
              fontWeight: 500,
              color: COLORS.muted,
              opacity: subtitle,
              transform: `translateY(${(1 - subtitle) * 20}px)`,
            }}
          >
            Celebrate every milestone with prizes users can claim
          </div>
        </AbsoluteFill>
      </AbsoluteFill>
    </SceneBackground>
  );
};
