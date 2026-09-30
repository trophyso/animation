import React from "react";
import { BookOpen, Plus, Settings2 } from "lucide-react";
import {
  AbsoluteFill,
  interpolate,
  Sequence,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { SceneBackground } from "../components/SceneBackground";
import { monoFont, sansFont } from "../fonts";
import { CARD_SHADOW, COLORS, SERVERS, TRANSITION_FRAMES } from "../script";

const CARD_WIDTH = 780;

const ServerCard: React.FC<{
  server: (typeof SERVERS)[number];
  delay: number;
}> = ({ server, delay }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const enter = spring({
    frame: frame - delay,
    fps,
    config: { damping: 15, mass: 0.6, stiffness: 110 },
  });
  const Icon = server.server === "docs" ? BookOpen : Settings2;
  const isAccount = server.server === "account";

  return (
    <div
      style={{
        width: CARD_WIDTH,
        boxSizing: "border-box",
        padding: 48,
        borderRadius: 32,
        backgroundColor: "#fff",
        border: `1px solid ${COLORS.border}`,
        boxShadow: CARD_SHADOW,
        display: "flex",
        flexDirection: "column",
        gap: 28,
        opacity: enter,
        transform: `translateY(${(1 - enter) * 80}px) scale(${0.94 + enter * 0.06})`,
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 22 }}>
        <div
          style={{
            width: 84,
            height: 84,
            borderRadius: 22,
            backgroundColor: isAccount ? COLORS.ink : COLORS.surface,
            border: isAccount ? "none" : `1px solid ${COLORS.border}`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Icon
            size={44}
            color={isAccount ? "#fff" : COLORS.ink}
            strokeWidth={2.2}
          />
        </div>
        <div
          style={{
            fontSize: 58,
            fontWeight: 800,
            letterSpacing: "-0.03em",
            color: COLORS.ink,
          }}
        >
          {server.name}
        </div>
      </div>

      <div
        style={{
          fontSize: 34,
          lineHeight: 1.4,
          fontWeight: 500,
          color: "#344054",
          minHeight: 144,
        }}
      >
        {server.description}
      </div>

      <div style={{ display: "flex", flexWrap: "wrap", gap: 12 }}>
        {server.tools.map((tool, index) => {
          const chip = spring({
            frame: frame - delay - 24 - index * 6,
            fps,
            config: { damping: 16, mass: 0.4, stiffness: 140 },
          });
          return (
            <div
              key={tool}
              style={{
                padding: "10px 16px",
                borderRadius: 12,
                backgroundColor: COLORS.surface,
                border: `1px solid ${COLORS.border}`,
                fontFamily: monoFont,
                fontSize: 22,
                fontWeight: 500,
                color: COLORS.ink,
                opacity: chip,
                transform: `translateY(${(1 - chip) * 12}px)`,
              }}
            >
              {tool}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export const SERVERS_DURATION = 300;

const ServersContent: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const title = spring({ frame, fps, config: { damping: 16, mass: 0.5 } });
  const plus = spring({
    frame: frame - 40,
    fps,
    config: { damping: 10, mass: 0.5, stiffness: 160 },
  });
  const tagline = spring({
    frame: frame - 120,
    fps,
    config: { damping: 16, mass: 0.5 },
  });
  const drift = interpolate(frame, [0, SERVERS_DURATION], [0, -20]);

  return (
    <AbsoluteFill
      style={{
        fontFamily: sansFont,
        alignItems: "center",
        justifyContent: "center",
        transform: `translateY(${drift}px)`,
      }}
    >
      <div
        style={{
          fontSize: 84,
          fontWeight: 800,
          letterSpacing: "-0.035em",
          color: COLORS.ink,
          opacity: title,
          transform: `translateY(${(1 - title) * 24}px)`,
        }}
      >
        Two servers. One workflow.
      </div>

      <div
        style={{
          marginTop: 64,
          display: "flex",
          alignItems: "stretch",
          gap: 40,
        }}
      >
        <ServerCard server={SERVERS[0]} delay={14} />
        <div
          style={{
            width: 72,
            height: 72,
            borderRadius: 999,
            backgroundColor: COLORS.ink,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            transform: `scale(${plus})`,
            flexShrink: 0,
            alignSelf: "center",
          }}
        >
          <Plus size={40} color="#fff" strokeWidth={3} />
        </div>
        <ServerCard server={SERVERS[1]} delay={30} />
      </div>

      <div
        style={{
          marginTop: 64,
          fontSize: 52,
          fontWeight: 700,
          letterSpacing: "-0.02em",
          color: COLORS.muted,
          opacity: tagline,
          transform: `translateY(${(1 - tagline) * 20}px)`,
        }}
      >
        Docs for <span style={{ color: COLORS.ink }}>context</span>. Account for{" "}
        <span style={{ color: COLORS.ink }}>action</span>.
      </div>
    </AbsoluteFill>
  );
};

export const ServersScene: React.FC = () => (
  <SceneBackground>
    <Sequence from={TRANSITION_FRAMES} layout="none">
      <ServersContent />
    </Sequence>
  </SceneBackground>
);
