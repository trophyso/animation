import React from "react";
import { Check } from "lucide-react";
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";
import { monoFont, sansFont } from "../../McpLaunchVideo/fonts";
import { SceneBackground } from "../../McpLaunchVideo/components/SceneBackground";
import { Caption } from "../components/Caption";
import { COLORS, DEV_POINTS, REDEEM_CODE, TRANSITION_FRAMES } from "../script";

export const CODE_DURATION = 260;

const CARD_IN = 22;
const TYPE_START = 36;
const TYPE_FRAMES = 60;
const RESPONSE = TYPE_START + TYPE_FRAMES + 10;
const CHIPS = RESPONSE + 24;

export const CodeScene: React.FC = () => {
  const frame = useCurrentFrame() - TRANSITION_FRAMES;
  const { fps } = useVideoConfig();

  const card = spring({
    frame: frame - CARD_IN,
    fps,
    config: { damping: 16, mass: 0.6, stiffness: 110 },
  });
  const typed = Math.round(
    interpolate(frame, [TYPE_START, TYPE_START + TYPE_FRAMES], [0, REDEEM_CODE.length], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    }),
  );
  const response = spring({
    frame: frame - RESPONSE,
    fps,
    config: { damping: 14, mass: 0.5, stiffness: 130 },
  });
  const zoom = interpolate(frame, [0, 260], [1, 1.04]);

  return (
    <SceneBackground>
      <AbsoluteFill
        style={{
          fontFamily: sansFont,
          alignItems: "center",
          justifyContent: "center",
          gap: 56,
          transform: `scale(${zoom})`,
        }}
      >
        <Caption eyebrow="For developers" title="One API call to redeem" delay={TRANSITION_FRAMES} />

        <div
          style={{
            width: 1360,
            borderRadius: 28,
            backgroundColor: "#0f1117",
            boxShadow: "0 40px 80px -24px rgba(15, 23, 42, 0.45)",
            overflow: "hidden",
            opacity: card,
            transform: `translateY(${(1 - card) * 60}px) scale(${0.95 + card * 0.05})`,
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 12,
              padding: "20px 28px",
              borderBottom: "1px solid rgba(255, 255, 255, 0.08)",
            }}
          >
            {["#ff5f57", "#febc2e", "#28c840"].map((c) => (
              <span key={c} style={{ width: 16, height: 16, borderRadius: 999, backgroundColor: c }} />
            ))}
            <span style={{ marginLeft: 16, fontFamily: monoFont, fontSize: 24, color: "#8b949e" }}>
              claim-reward.ts
            </span>
          </div>
          <div style={{ padding: "26px 28px 30px", minHeight: 4 * 62 }}>
            <SyntaxHighlighter
              language="typescript"
              style={vscDarkPlus}
              customStyle={{
                margin: 0,
                padding: 0,
                background: "transparent",
                fontSize: 40,
                lineHeight: 1.55,
                fontFamily: monoFont,
              }}
              codeTagProps={{ style: { fontFamily: monoFont } }}
            >
              {REDEEM_CODE.slice(0, typed) || " "}
            </SyntaxHighlighter>
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 16,
              padding: "20px 28px",
              backgroundColor: "rgba(76, 199, 74, 0.12)",
              borderTop: "1px solid rgba(76, 199, 74, 0.3)",
              fontFamily: monoFont,
              fontSize: 30,
              color: "#c9f7c8",
              opacity: response,
              transform: `translateY(${(1 - response) * 20}px)`,
            }}
          >
            <span
              style={{
                width: 36,
                height: 36,
                borderRadius: 999,
                backgroundColor: COLORS.green,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Check size={22} color="#fff" strokeWidth={3.2} />
            </span>
            200 OK · +500 XP granted · reward.redeemed sent
          </div>
        </div>

        <div style={{ display: "flex", gap: 20 }}>
          {DEV_POINTS.map((point, index) => {
            const chip = spring({
              frame: frame - CHIPS - index * 8,
              fps,
              config: { damping: 14, mass: 0.4, stiffness: 140 },
            });
            return (
              <div
                key={point}
                style={{
                  padding: "14px 28px",
                  borderRadius: 999,
                  backgroundColor: "#fff",
                  border: `1px solid ${COLORS.border}`,
                  boxShadow: "0 6px 18px rgba(15, 23, 42, 0.06)",
                  fontSize: 32,
                  fontWeight: 600,
                  color: COLORS.ink,
                  opacity: chip,
                  transform: `translateY(${(1 - chip) * 16}px) scale(${0.9 + chip * 0.1})`,
                }}
              >
                {point}
              </div>
            );
          })}
        </div>
      </AbsoluteFill>
    </SceneBackground>
  );
};
