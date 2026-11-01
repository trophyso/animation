import React from "react";
import { Check } from "lucide-react";
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
import { COLORS, TRANSITION_FRAMES, WHY_POINTS } from "../script";

export const OUTRO_DURATION = 240;

export const OutroScene: React.FC = () => {
  const frame = useCurrentFrame() - TRANSITION_FRAMES;
  const { fps } = useVideoConfig();

  const headline = spring({ frame, fps, config: { damping: 16, mass: 0.5 } });
  const live = spring({
    frame: frame - 60,
    fps,
    config: { damping: 18, mass: 0.5 },
  });
  const logo = spring({
    frame: frame - 76,
    fps,
    config: { damping: 18, mass: 0.6 },
  });
  const zoom = interpolate(frame, [0, OUTRO_DURATION], [1.02, 1]);

  return (
    <SceneBackground>
      <AbsoluteFill
        style={{
          fontFamily: sansFont,
          alignItems: "center",
          justifyContent: "center",
          textAlign: "center",
          transform: `scale(${zoom})`,
        }}
      >
        <div
          style={{
            fontSize: 108,
            fontWeight: 800,
            letterSpacing: "-0.045em",
            lineHeight: 1.04,
            color: COLORS.ink,
            opacity: headline,
            transform: `translateY(${(1 - headline) * 30}px)`,
          }}
        >
          A pre-built rewards engine
          <br />
          <span style={{ color: COLORS.green }}>for consumer apps</span>
        </div>

        <div style={{ display: "flex", gap: 20, marginTop: 52 }}>
          {WHY_POINTS.map((point, index) => {
            const chip = spring({
              frame: frame - 18 - index * 8,
              fps,
              config: { damping: 14, mass: 0.4, stiffness: 140 },
            });
            return (
              <div
                key={point}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 14,
                  padding: "14px 28px 14px 16px",
                  borderRadius: 999,
                  backgroundColor: "#fff",
                  border: `1px solid ${COLORS.border}`,
                  boxShadow: "0 6px 18px rgba(15, 23, 42, 0.06)",
                  fontSize: 36,
                  fontWeight: 600,
                  color: COLORS.ink,
                  opacity: chip,
                  transform: `translateY(${(1 - chip) * 16}px) scale(${0.9 + chip * 0.1})`,
                }}
              >
                <span
                  style={{
                    width: 42,
                    height: 42,
                    borderRadius: 999,
                    backgroundColor: COLORS.ink,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Check size={24} color="#fff" strokeWidth={3} />
                </span>
                {point}
              </div>
            );
          })}
        </div>

        <div
          style={{
            marginTop: 56,
            fontSize: 36,
            fontWeight: 500,
            color: COLORS.muted,
            opacity: live,
          }}
        >
          Live now · trophy.so/features/rewards
        </div>

        <Img
          src={staticFile("brand/logo_light.svg")}
          style={{
            width: 230,
            marginTop: 56,
            opacity: logo,
            transform: `translateY(${(1 - logo) * 16}px)`,
          }}
        />
      </AbsoluteFill>
    </SceneBackground>
  );
};
