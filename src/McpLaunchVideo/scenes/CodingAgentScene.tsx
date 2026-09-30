import React from "react";
import { ChevronDown, FileCode2, FileText } from "lucide-react";
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import {
  TypingCodeBlock,
  getTypingCodeDurationInFrames,
} from "../../components/TypingCodeBlock";
import {
  CursorStyleIde,
  IDE_AGENT_WIDTH,
  IDE_COLORS,
  IDE_EXPLORER_WIDTH,
  IDE_TAB_HEIGHT,
  IDE_TITLE_HEIGHT,
} from "../components/CursorStyleIde";
import { Camera } from "../components/Camera";
import { Reveal } from "../components/Reveal";
import { SceneBackground } from "../components/SceneBackground";
import { StepCaption } from "../components/StepCaption";
import { Spinner, ToolCallRow } from "../components/ToolCallRow";
import { TypedText, getTypingEndFrame } from "../components/TypedText";
import { monoFont } from "../fonts";
import {
  AGENT_DONE_MESSAGE,
  AGENT_FILE_EDITS,
  AGENT_PROMPT,
  AGENT_TOOL_CALLS,
  INTEGRATION_CODE,
} from "../script";

const DIFF_ADDED = "#73c991";
const DIFF_REMOVED = "#f48771";

const WINDOW_TOP = 250;
const WINDOW_SIDE = 100;
const WINDOW_BOTTOM = 36;
const IDE_WIDTH = 1920 - WINDOW_SIDE * 2;
const IDE_HEIGHT = 1080 - WINDOW_TOP - WINDOW_BOTTOM;
const EDITOR_WIDTH = IDE_WIDTH - IDE_EXPLORER_WIDTH - IDE_AGENT_WIDTH - 2;
const EDITOR_HEIGHT = IDE_HEIGHT - IDE_TITLE_HEIGHT - IDE_TAB_HEIGHT - 2;
const CODE_SCALE = 0.72;

const TYPE_START = 30;
const CHARS_PER_FRAME = 0.75;
const TYPE_END = getTypingEndFrame(AGENT_PROMPT, TYPE_START, CHARS_PER_FRAME);
const SEND = TYPE_END + 14;
const THINK_START = SEND + 30;
const TOOLS_START = THINK_START + 24;
const TOOL_STAGGER = 44;
const TOOL_DURATION = 34;
const EDIT_START =
  TOOLS_START +
  (AGENT_TOOL_CALLS.length - 1) * TOOL_STAGGER +
  TOOL_DURATION +
  30;
const CODE_START = EDIT_START + 8;
const CODE_FRAMES_PER_LINE = 22;
const CODE_LINE_TYPING_FRAMES = 40;
const CODE_FRAMES = getTypingCodeDurationInFrames({
  code: INTEGRATION_CODE,
  availableWidth: EDITOR_WIDTH / CODE_SCALE,
  framesPerLine: CODE_FRAMES_PER_LINE,
  lineTypingFrames: CODE_LINE_TYPING_FRAMES,
  holdFrames: 0,
});
const CODE_END = CODE_START + CODE_FRAMES;
const OTHER_EDIT_STAGGER = 26;
const OTHER_EDIT_DURATION = 20;
const DONE_START =
  CODE_END +
  12 +
  (AGENT_FILE_EDITS.length - 1) * OTHER_EDIT_STAGGER +
  OTHER_EDIT_DURATION +
  12;

export const CODING_DURATION = DONE_START + 90;

const COMPOSER_SHOT = {
  scale: 2.1,
  x: WINDOW_SIDE + IDE_WIDTH - IDE_AGENT_WIDTH / 2 - 120,
  y: WINDOW_TOP + IDE_HEIGHT - 215,
};
const AGENT_SHOT = {
  scale: 1.4,
  x: WINDOW_SIDE + IDE_WIDTH - 920 / 1.4,
  y: WINDOW_TOP + IDE_TITLE_HEIGHT + 540 / 1.4,
};
const FULL_SHOT = { scale: 1, x: 960, y: 540 };
const editTiming = (index: number) => {
  if (index === 0) {
    return { start: EDIT_START, done: CODE_END };
  }
  const start = CODE_END + 12 + index * OTHER_EDIT_STAGGER;
  return { start, done: start + OTHER_EDIT_DURATION };
};

const EXPLORER_TREE: {
  name: string;
  depth: number;
  folder?: boolean;
  editIndex?: number;
  isNew?: boolean;
}[] = [
  { name: "app", depth: 0, folder: true },
  { name: "components", depth: 1, folder: true },
  { name: "LeaderboardCard.tsx", depth: 2, editIndex: 3, isNew: true },
  { name: "StreakCard.tsx", depth: 2, editIndex: 1, isNew: true },
  { name: "WorkoutButton.tsx", depth: 2 },
  { name: "XpLevelCard.tsx", depth: 2, editIndex: 2, isNew: true },
  { name: "screens", depth: 1, folder: true },
  { name: "HomeScreen.tsx", depth: 2, editIndex: 4 },
  { name: "server", depth: 0, folder: true },
  { name: "users.ts", depth: 1 },
  { name: "workouts.ts", depth: 1, editIndex: 0 },
  { name: ".env", depth: 0 },
  { name: "package.json", depth: 0 },
];

const Explorer: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  return (
    <div style={{ display: "flex", flexDirection: "column" }}>
      {EXPLORER_TREE.map((item) => {
        const timing =
          item.editIndex !== undefined ? editTiming(item.editIndex) : null;
        const appear =
          item.isNew && timing
            ? spring({
                frame: frame - timing.start,
                fps,
                config: { damping: 18, mass: 0.5 },
              })
            : 1;
        const touched = timing ? frame >= timing.start : false;
        const active =
          item.editIndex === 0 && frame >= EDIT_START && frame < CODE_END + 12;
        const Icon = item.folder
          ? ChevronDown
          : item.name.endsWith(".tsx") || item.name.endsWith(".ts")
            ? FileCode2
            : FileText;

        return (
          <div
            key={`${item.depth}-${item.name}`}
            style={{
              height: appear * 38,
              opacity: appear,
              overflow: "hidden",
              display: "flex",
              alignItems: "center",
              gap: 7,
              paddingLeft: 14 + item.depth * 12,
              paddingRight: 10,
              fontSize: 16,
              color: touched ? "#e8e8e8" : IDE_COLORS.muted,
              backgroundColor: active
                ? "rgba(255,255,255,0.07)"
                : "transparent",
            }}
          >
            <Icon
              size={17}
              color={
                item.folder
                  ? IDE_COLORS.muted
                  : item.name.endsWith("x")
                    ? "#4fc1ff"
                    : "#8b8b8b"
              }
              style={{ flexShrink: 0 }}
            />
            <span
              style={{
                flex: 1,
                minWidth: 0,
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              {item.name}
            </span>
            {touched ? (
              <span
                style={{
                  fontSize: 15,
                  fontWeight: 700,
                  color: item.isNew ? DIFF_ADDED : "#e2c08d",
                }}
              >
                {item.isNew ? "A" : "M"}
              </span>
            ) : null}
          </div>
        );
      })}
    </div>
  );
};

const FileEditRow: React.FC<{
  path: string;
  added: number;
  removed: number;
  start: number;
  done: number;
}> = ({ path, added, removed, start, done }) => {
  const frame = useCurrentFrame();
  const isDone = frame >= done;

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 12,
        height: 42,
        padding: "0 14px",
        borderRadius: 10,
        backgroundColor: "#232323",
        border: `1px solid ${IDE_COLORS.border}`,
        fontSize: 18,
        opacity: frame >= start ? 1 : 0,
      }}
    >
      <div
        style={{
          width: 20,
          height: 20,
          flexShrink: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {isDone ? (
          <FileCode2 size={18} color="#4fc1ff" />
        ) : (
          <Spinner size={18} track="#333" head="#bdbdbd" />
        )}
      </div>
      <span
        style={{
          flex: 1,
          minWidth: 0,
          fontFamily: monoFont,
          color: "#e8e8e8",
          whiteSpace: "nowrap",
          overflow: "hidden",
          textOverflow: "ellipsis",
        }}
      >
        {path}
      </span>
      <span
        style={{
          fontFamily: monoFont,
          fontWeight: 600,
          opacity: isDone ? 1 : 0.35,
          whiteSpace: "nowrap",
        }}
      >
        <span style={{ color: DIFF_ADDED }}>+{added}</span>{" "}
        <span style={{ color: DIFF_REMOVED }}>-{removed}</span>
      </span>
    </div>
  );
};

export const CodingAgentScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const windowEnter = spring({
    frame,
    fps,
    config: { damping: 18, mass: 0.7, stiffness: 100 },
  });
  const toAgent = spring({
    frame: frame - SEND,
    fps,
    config: { damping: 200 },
    durationInFrames: 50,
  });
  const toFullWindow = spring({
    frame: frame - EDIT_START,
    fps,
    config: { damping: 200 },
    durationInFrames: 55,
  });
  const cameraAt = (key: keyof typeof FULL_SHOT) =>
    interpolate(
      toFullWindow,
      [0, 1],
      [
        interpolate(toAgent, [0, 1], [COMPOSER_SHOT[key], AGENT_SHOT[key]]),
        FULL_SHOT[key],
      ],
    );
  const hasSent = frame >= SEND;

  return (
    <SceneBackground>
      <Camera
        focus={{ x: cameraAt("x"), y: cameraAt("y") }}
        scale={cameraAt("scale")}
      >
        <AbsoluteFill style={{ alignItems: "center" }}>
          <StepCaption
            eyebrow="Coding agent + Trophy MCP"
            title="Integrate it in your code"
            delay={EDIT_START}
            style={{ marginTop: 56 }}
          />
          <div
            style={{
              position: "absolute",
              top: WINDOW_TOP,
              left: WINDOW_SIDE,
              width: IDE_WIDTH,
              height: IDE_HEIGHT,
              opacity: windowEnter,
              transform: `translateY(${(1 - windowEnter) * 40}px)`,
            }}
          >
            <CursorStyleIde
              style={{ width: "100%", height: "100%" }}
              editorTab="workouts.ts"
              explorer={<Explorer />}
              editor={
                <div
                  style={{
                    position: "absolute",
                    inset: 0,
                    overflow: "hidden",
                  }}
                >
                  <div
                    style={{
                      width: EDITOR_WIDTH / CODE_SCALE,
                      height: EDITOR_HEIGHT / CODE_SCALE,
                      transform: `scale(${CODE_SCALE})`,
                      transformOrigin: "top left",
                    }}
                  >
                    <TypingCodeBlock
                      code={INTEGRATION_CODE}
                      language="typescript"
                      filename="workouts.ts"
                      availableWidth={EDITOR_WIDTH / CODE_SCALE}
                      delayInFrames={CODE_START}
                      framesPerLine={CODE_FRAMES_PER_LINE}
                      lineTypingFrames={CODE_LINE_TYPING_FRAMES}
                      showHeader={false}
                      style={{
                        borderRadius: 0,
                        backgroundColor: IDE_COLORS.background,
                      }}
                    />
                  </div>
                </div>
              }
              agentComposer={
                hasSent ? (
                  <span style={{ color: IDE_COLORS.muted }}>
                    Plan, search, build anything…
                  </span>
                ) : (
                  <TypedText
                    text={AGENT_PROMPT}
                    startFrame={TYPE_START}
                    charsPerFrame={CHARS_PER_FRAME}
                    caretColor="#e8e8e8"
                  />
                )
              }
              agent={
                <div
                  style={{
                    position: "absolute",
                    left: 22,
                    right: 22,
                    bottom: 8,
                    display: "flex",
                    flexDirection: "column",
                  }}
                >
                  <Reveal startFrame={SEND} maxHeight={260}>
                    <div
                      style={{
                        padding: "16px 18px",
                        borderRadius: 14,
                        backgroundColor: IDE_COLORS.bubble,
                        border: "1px solid #353535",
                        fontSize: 19,
                        lineHeight: 1.45,
                        color: "#e8e8e8",
                      }}
                    >
                      {AGENT_PROMPT}
                    </div>
                  </Reveal>

                  <Reveal startFrame={THINK_START} maxHeight={60}>
                    <div
                      style={{
                        paddingTop: 18,
                        fontSize: 18,
                        color: IDE_COLORS.muted,
                      }}
                    >
                      Thought for 3s
                    </div>
                  </Reveal>

                  {AGENT_TOOL_CALLS.map((call, index) => {
                    const start = TOOLS_START + index * TOOL_STAGGER;
                    return (
                      <Reveal key={call.tool} startFrame={start} maxHeight={56}>
                        <div style={{ paddingTop: 14 }}>
                          <ToolCallRow
                            server={call.server}
                            tool={call.tool}
                            startFrame={start}
                            doneFrame={start + TOOL_DURATION}
                            fontSize={18}
                          />
                        </div>
                      </Reveal>
                    );
                  })}

                  {AGENT_FILE_EDITS.map((edit, index) => {
                    const { start, done } = editTiming(index);
                    return (
                      <Reveal key={edit.path} startFrame={start} maxHeight={60}>
                        <div style={{ paddingTop: index === 0 ? 18 : 8 }}>
                          <FileEditRow {...edit} start={start} done={done} />
                        </div>
                      </Reveal>
                    );
                  })}

                  <Reveal startFrame={DONE_START} maxHeight={140}>
                    <div
                      style={{
                        paddingTop: 18,
                        fontSize: 19,
                        lineHeight: 1.45,
                        color: "#e8e8e8",
                      }}
                    >
                      {AGENT_DONE_MESSAGE}
                    </div>
                  </Reveal>
                </div>
              }
            />
          </div>
        </AbsoluteFill>
      </Camera>
    </SceneBackground>
  );
};
