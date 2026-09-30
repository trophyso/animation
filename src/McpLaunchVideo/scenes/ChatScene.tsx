import React from "react";
import { ChevronRight } from "lucide-react";
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { Camera } from "../components/Camera";
import {
  CLAUDE_COLORS,
  ClaudeMark,
  ClaudeSerifText,
  ClaudeStyleChat,
  ClaudeToolRow,
  ConnectorIcon,
} from "../components/ClaudeStyleChat";
import { Reveal } from "../components/Reveal";
import { SceneBackground } from "../components/SceneBackground";
import { StepCaption } from "../components/StepCaption";
import { TypedText, getTypingEndFrame } from "../components/TypedText";
import { serifFont } from "../fonts";
import {
  CHAT_DOCS_CALLS,
  CHAT_DOCS_INTRO,
  CHAT_DONE_MESSAGE,
  CHAT_SETUP_CALLS,
  CHAT_SETUP_INTRO,
  CHAT_SUGGESTION_INTRO,
  CHAT_SUGGESTION_ITEMS,
  CHAT_SUGGESTION_OFFER,
  CHAT_USER_MESSAGE_1,
  CHAT_USER_MESSAGE_2,
  SERVER_LABELS,
  type ToolCall,
} from "../script";

const TOOL_STAGGER = 30;
const TOOL_DURATION = 26;
const TOOL_ROW_HEIGHT = 48;
const BULLET_STAGGER = 12;

const toolsEnd = (start: number, calls: ToolCall[]) =>
  start + (calls.length - 1) * TOOL_STAGGER + TOOL_DURATION;

const TYPE_1_START = 24;
const TYPE_1_CHARS_PER_FRAME = 0.75;
const SEND_1 =
  getTypingEndFrame(CHAT_USER_MESSAGE_1, TYPE_1_START, TYPE_1_CHARS_PER_FRAME) + 12;
const DOCS_INTRO_START = SEND_1 + 30;
const DOCS_TOOLS_START = DOCS_INTRO_START + 22;
const DOCS_COLLAPSE = toolsEnd(DOCS_TOOLS_START, CHAT_DOCS_CALLS) + 12;
const SUGGESTION_START = DOCS_COLLAPSE + 16;
const OFFER_START =
  SUGGESTION_START + 16 + CHAT_SUGGESTION_ITEMS.length * BULLET_STAGGER;

const TYPE_2_START = OFFER_START + 50;
const TYPE_2_CHARS_PER_FRAME = 0.75;
const SEND_2 =
  getTypingEndFrame(CHAT_USER_MESSAGE_2, TYPE_2_START, TYPE_2_CHARS_PER_FRAME) + 12;
const SETUP_INTRO_START = SEND_2 + 20;
const SETUP_TOOLS_START = SETUP_INTRO_START + 22;
const SETUP_COLLAPSE = toolsEnd(SETUP_TOOLS_START, CHAT_SETUP_CALLS) + 12;
const DONE_START = SETUP_COLLAPSE + 16;

export const CHAT_DURATION = DONE_START + 100;

const COMPOSER_SHOT = { scale: 1.6, x: 996, y: 820 };
const CONVERSATION_SHOT = { scale: 1.3, x: 996, y: 735 };
const FULL_SHOT = { scale: 1, x: 960, y: 540 };

const serverSummary = (calls: ToolCall[]) =>
  [...new Set(calls.map((call) => SERVER_LABELS[call.server]))].join(", ");

/** Tool rows that appear one by one, then collapse into Claude's "Used N tools" line. */
const ToolGroup: React.FC<{
  calls: ToolCall[];
  start: number;
  collapseAt: number;
}> = ({ calls, start, collapseAt }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const grown = calls.map((_, index) =>
    spring({
      frame: frame - (start + index * TOOL_STAGGER),
      fps,
      config: { damping: 20, mass: 0.5, stiffness: 140 },
    }),
  );
  const collapse = spring({
    frame: frame - collapseAt,
    fps,
    config: { damping: 20, mass: 0.6, stiffness: 110 },
  });
  const listHeight = grown.reduce((sum, g) => sum + g, 0) * TOOL_ROW_HEIGHT;

  return (
    <Reveal startFrame={start - 4} maxHeight={calls.length * TOOL_ROW_HEIGHT + 20}>
      <div
        style={{
          position: "relative",
          marginTop: 14,
          height: interpolate(collapse, [0, 1], [listHeight, TOOL_ROW_HEIGHT]),
          overflow: "hidden",
        }}
      >
        <div style={{ opacity: 1 - collapse }}>
          {calls.map((call, index) => (
            <div
              key={`${call.tool}-${index}`}
              style={{
                height: grown[index] * TOOL_ROW_HEIGHT,
                opacity: grown[index],
                display: "flex",
                alignItems: "center",
                overflow: "hidden",
              }}
            >
              <ClaudeToolRow
                label={call.tool}
                detail={call.detail}
                running={frame < start + index * TOOL_STAGGER + TOOL_DURATION}
              />
            </div>
          ))}
        </div>
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            height: TOOL_ROW_HEIGHT,
            display: "flex",
            alignItems: "center",
            gap: 14,
            fontSize: 21,
            color: CLAUDE_COLORS.muted,
            opacity: collapse,
          }}
        >
          <ConnectorIcon />
          <span style={{ color: CLAUDE_COLORS.text, fontWeight: 500 }}>
            Used {calls.length} tools
          </span>
          <span>{serverSummary(calls)}</span>
          <ChevronRight size={18} color={CLAUDE_COLORS.faint} />
        </div>
      </div>
    </Reveal>
  );
};

const UserBubble: React.FC<{ text: string; startFrame: number }> = ({
  text,
  startFrame,
}) => (
  <Reveal
    startFrame={startFrame}
    maxHeight={240}
    style={{ display: "flex", justifyContent: "flex-end" }}
  >
    <div
      style={{
        maxWidth: 800,
        marginTop: 28,
        padding: "18px 24px",
        borderRadius: 20,
        backgroundColor: CLAUDE_COLORS.bubble,
        fontSize: 23,
        lineHeight: 1.45,
        color: CLAUDE_COLORS.text,
      }}
    >
      {text}
    </div>
  </Reveal>
);

const pulseAt = (frame: number, at: number) =>
  interpolate(frame, [at - 4, at, at + 6], [0, 1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

export const ChatScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const windowEnter = spring({
    frame,
    fps,
    config: { damping: 18, mass: 0.7, stiffness: 100 },
  });
  const toConversation = spring({
    frame: frame - SEND_1,
    fps,
    config: { damping: 200 },
    durationInFrames: 50,
  });
  const toFullWindow = spring({
    frame: frame - SEND_2,
    fps,
    config: { damping: 200 },
    durationInFrames: 55,
  });
  const cameraAt = (key: keyof typeof FULL_SHOT) =>
    interpolate(
      toFullWindow,
      [0, 1],
      [
        interpolate(toConversation, [0, 1], [COMPOSER_SHOT[key], CONVERSATION_SHOT[key]]),
        FULL_SHOT[key],
      ],
    );
  const greetingOpacity = interpolate(frame, [SEND_1 - 6, SEND_1 + 6], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const placeholder = (
    <span style={{ color: CLAUDE_COLORS.faint }}>Reply to Claude…</span>
  );
  const composer =
    frame < SEND_1 ? (
      <TypedText
        text={CHAT_USER_MESSAGE_1}
        startFrame={TYPE_1_START}
        charsPerFrame={TYPE_1_CHARS_PER_FRAME}
        caretColor={CLAUDE_COLORS.text}
      />
    ) : frame >= TYPE_2_START && frame < SEND_2 ? (
      <TypedText
        text={CHAT_USER_MESSAGE_2}
        startFrame={TYPE_2_START}
        charsPerFrame={TYPE_2_CHARS_PER_FRAME}
        caretColor={CLAUDE_COLORS.text}
      />
    ) : (
      placeholder
    );

  return (
    <SceneBackground>
      <Camera
        focus={{ x: cameraAt("x"), y: cameraAt("y") }}
        scale={cameraAt("scale")}
      >
        <AbsoluteFill style={{ alignItems: "center" }}>
          <StepCaption
            eyebrow="AI chat + Trophy MCP"
            title="Configure gamification from chat"
            delay={SEND_2}
            style={{ marginTop: 56 }}
          />
          <div
            style={{
              position: "absolute",
              top: 250,
              left: 100,
              right: 100,
              bottom: 36,
              opacity: windowEnter,
              transform: `translateY(${(1 - windowEnter) * 40}px)`,
            }}
          >
            <ClaudeStyleChat
              style={{ width: "100%", height: "100%" }}
              title="Pulse gamification setup"
              sendPulse={Math.max(pulseAt(frame, SEND_1), pulseAt(frame, SEND_2))}
              composer={composer}
            >
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 18,
                  opacity: greetingOpacity,
                }}
              >
                <ClaudeMark size={48} />
                <span
                  style={{
                    fontFamily: serifFont,
                    fontSize: 48,
                    color: CLAUDE_COLORS.text,
                  }}
                >
                  What should we build today?
                </span>
              </div>

              <div
                style={{
                  position: "absolute",
                  left: 0,
                  right: 0,
                  bottom: 12,
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                <UserBubble text={CHAT_USER_MESSAGE_1} startFrame={SEND_1} />

                <Reveal startFrame={DOCS_INTRO_START} maxHeight={90}>
                  <ClaudeSerifText style={{ paddingTop: 28 }}>
                    {CHAT_DOCS_INTRO}
                  </ClaudeSerifText>
                </Reveal>

                <ToolGroup
                  calls={CHAT_DOCS_CALLS}
                  start={DOCS_TOOLS_START}
                  collapseAt={DOCS_COLLAPSE}
                />

                <Reveal startFrame={SUGGESTION_START} maxHeight={420}>
                  <ClaudeSerifText style={{ paddingTop: 20 }}>
                    {CHAT_SUGGESTION_INTRO}
                    <ul style={{ margin: "8px 0 0", paddingLeft: 30 }}>
                      {CHAT_SUGGESTION_ITEMS.map((item, index) => {
                        const at = SUGGESTION_START + 6 + index * BULLET_STAGGER;
                        const appear = interpolate(frame, [at, at + 10], [0, 1], {
                          extrapolateLeft: "clamp",
                          extrapolateRight: "clamp",
                        });
                        return (
                          <li key={item.name} style={{ opacity: appear }}>
                            <strong style={{ fontWeight: 600 }}>{item.name}</strong>{" "}
                            {item.detail}
                          </li>
                        );
                      })}
                    </ul>
                  </ClaudeSerifText>
                </Reveal>

                <Reveal startFrame={OFFER_START} maxHeight={80}>
                  <ClaudeSerifText style={{ paddingTop: 12 }}>
                    {CHAT_SUGGESTION_OFFER}
                  </ClaudeSerifText>
                </Reveal>

                <UserBubble text={CHAT_USER_MESSAGE_2} startFrame={SEND_2} />

                <Reveal startFrame={SETUP_INTRO_START} maxHeight={90}>
                  <ClaudeSerifText style={{ paddingTop: 28 }}>
                    {CHAT_SETUP_INTRO}
                  </ClaudeSerifText>
                </Reveal>

                <ToolGroup
                  calls={CHAT_SETUP_CALLS}
                  start={SETUP_TOOLS_START}
                  collapseAt={SETUP_COLLAPSE}
                />

                <Reveal startFrame={DONE_START} maxHeight={140}>
                  <ClaudeSerifText style={{ paddingTop: 20 }}>
                    {CHAT_DONE_MESSAGE}
                  </ClaudeSerifText>
                </Reveal>
              </div>
            </ClaudeStyleChat>
          </div>
        </AbsoluteFill>
      </Camera>
    </SceneBackground>
  );
};
