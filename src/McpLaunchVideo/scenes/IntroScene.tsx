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
import { SceneBackground } from "../components/SceneBackground";
import { smoothTransform } from "../components/smoothTransform";
import { monoFont, sansFont } from "../fonts";
import { COLORS } from "../script";

const FLOATING_TOOLS = [
  { label: "search_trophy_docs", x: 140, y: 170, delay: 20 },
  { label: "write_metrics", x: 1480, y: 150, delay: 28 },
  { label: "write_points_systems", x: 90, y: 820, delay: 36 },
  { label: "write_leaderboards", x: 1440, y: 850, delay: 44 },
  { label: "update_streak_settings", x: 760, y: 80, delay: 52 },
  { label: "write_achievements", x: 800, y: 950, delay: 60 },
];

export const INTRO_DURATION = 200;

export const IntroScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const logo = spring({ frame, fps, config: { damping: 18, mass: 0.6 } });
  const line1 = spring({
    frame: frame - 10,
    fps,
    config: { damping: 16, mass: 0.5, stiffness: 110 },
  });
  const line2 = spring({
    frame: frame - 20,
    fps,
    config: { damping: 14, mass: 0.6, stiffness: 110 },
  });
  const subtitle = spring({
    frame: frame - 48,
    fps,
    config: { damping: 18, mass: 0.5 },
  });
  const zoom = interpolate(frame, [0, INTRO_DURATION], [1, 1.05]);

  return (
    <SceneBackground>
      <AbsoluteFill style={smoothTransform(`scale(${zoom})`)}>
        {FLOATING_TOOLS.map((tool) => {
          const appear = spring({
            frame: frame - tool.delay,
            fps,
            config: { damping: 20, mass: 0.6 },
          });
          const drift = Math.sin((frame + tool.delay * 3) / 40) * 8;
          return (
            <div
              key={tool.label}
              style={{
                position: "absolute",
                left: tool.x,
                top: tool.y,
                padding: "12px 20px",
                borderRadius: 14,
                backgroundColor: "#fff",
                border: `1px solid ${COLORS.border}`,
                boxShadow: "0 2px 6px rgba(15, 23, 42, 0.05)",
                fontFamily: monoFont,
                fontSize: 24,
                fontWeight: 500,
                color: COLORS.ink,
                opacity: appear * 0.75,
                ...smoothTransform(
                  `translateY(${(1 - appear) * 30 + drift}px) scale(${0.9 + appear * 0.1})`,
                ),
              }}
            >
              {tool.label}
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
              marginBottom: 56,
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
            Introducing the
          </div>
          <div
            style={{
              fontSize: 124,
              fontWeight: 800,
              lineHeight: 1.05,
              color: COLORS.ink,
              letterSpacing: "-0.04em",
              opacity: line2,
              transform: `translateY(${(1 - line2) * 30}px) scale(${0.96 + line2 * 0.04})`,
            }}
          >
            Trophy <span style={{ color: COLORS.green }}>MCP Servers</span>
          </div>
          <div
            style={{
              marginTop: 36,
              fontSize: 44,
              fontWeight: 500,
              color: COLORS.muted,
              opacity: subtitle,
              transform: `translateY(${(1 - subtitle) * 20}px)`,
            }}
          >
            Build gamification with your AI agent
          </div>
        </AbsoluteFill>
      </AbsoluteFill>
    </SceneBackground>
  );
};
