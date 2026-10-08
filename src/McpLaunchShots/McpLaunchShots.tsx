import React from "react";
import {
  Activity,
  BookOpen,
  Check,
  Flame,
  Medal,
  Search,
  Settings2,
  Sparkles,
  Trophy,
} from "lucide-react";
import { monoFont } from "../McpLaunchVideo/fonts";
import {
  CLAUDE_COLORS,
  ClaudeSerifText,
  ClaudeStyleChat,
  ConnectorIcon,
} from "../McpLaunchVideo/components/ClaudeStyleChat";
import {
  CursorStyleIde,
  IDE_COLORS,
} from "../McpLaunchVideo/components/CursorStyleIde";
import { ToolCallRow } from "../McpLaunchVideo/components/ToolCallRow";
import { TrophyMark } from "../McpLaunchVideo/components/TrophyMark";
import {
  AGENT_DONE_MESSAGE,
  AGENT_FILE_EDITS,
  AGENT_PROMPT,
  AGENT_TOOL_CALLS,
  CHAT_DOCS_INTRO,
  CHAT_SUGGESTION_INTRO,
  CHAT_SUGGESTION_ITEMS,
  INTEGRATION_CODE,
} from "../McpLaunchVideo/script";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";
import { DARK, EXTRA_HEIGHT, ShotLayout, UI_OFFSET_Y } from "./ShotLayout";

const IconTile: React.FC<{
  children: React.ReactNode;
  size?: number;
  tone?: "neutral" | "green";
}> = ({ children, size = 36, tone = "neutral" }) => (
  <div
    style={{
      width: size,
      height: size,
      flexShrink: 0,
      borderRadius: 10,
      backgroundColor: tone === "green" ? DARK.greenSoft : DARK.cardRaised,
      border: `1px solid ${tone === "green" ? "rgba(76, 199, 74, 0.3)" : DARK.border}`,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    }}
  >
    {children}
  </div>
);

const Card: React.FC<{
  children: React.ReactNode;
  style?: React.CSSProperties;
}> = ({ children, style }) => (
  <div
    style={{
      boxSizing: "border-box",
      borderRadius: 14,
      backgroundColor: DARK.card,
      border: `1px solid ${DARK.border}`,
      ...style,
    }}
  >
    {children}
  </div>
);

const DoneBadge: React.FC = () => (
  <div
    style={{
      width: 22,
      height: 22,
      borderRadius: 999,
      backgroundColor: DARK.greenSoft,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      flexShrink: 0,
    }}
  >
    <Check size={13} color={DARK.green} strokeWidth={3} />
  </div>
);

const Chip: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div
    style={{
      padding: "4px 10px",
      borderRadius: 999,
      border: `1px solid ${DARK.border}`,
      backgroundColor: DARK.cardRaised,
      fontSize: 12,
      fontWeight: 600,
      color: DARK.muted,
      whiteSpace: "nowrap",
    }}
  >
    {children}
  </div>
);

/* ------------------------------------------------------------------ */
/* 1. Intro                                                            */
/* ------------------------------------------------------------------ */

const INTRO_ROWS = [
  { tool: "search_trophy_docs", detail: "Streaks", server: "docs" },
  { tool: "search_trophy_docs", detail: "Points & levels", server: "docs" },
  { tool: "write_metrics", detail: "workouts-completed", server: "account" },
  {
    tool: "update_streak_settings",
    detail: "Weekly · 3 workouts",
    server: "account",
  },
  {
    tool: "write_points_systems",
    detail: "XP · +10 per workout",
    server: "account",
  },
  {
    tool: "write_achievements",
    detail: "10, 25 & 50 workouts",
    server: "account",
  },
  { tool: "write_leaderboards", detail: "weekly-workouts", server: "account" },
] as const;

const ServerTile: React.FC<{
  name: string;
  caption: string;
  icon: React.ReactNode;
}> = ({ name, caption, icon }) => (
  <Card
    style={{
      flex: 1,
      padding: "18px 20px",
      display: "flex",
      alignItems: "center",
      gap: 14,
    }}
  >
    <IconTile size={44}>{icon}</IconTile>
    <div style={{ display: "flex", flexDirection: "column", gap: 3 }}>
      <div style={{ fontSize: 20, fontWeight: 600, color: DARK.text }}>
        {name}
      </div>
      <div style={{ fontSize: 14, color: DARK.muted }}>{caption}</div>
    </div>
  </Card>
);

export const IntroShot: React.FC = () => (
  <ShotLayout
    title={
      <>
        Trophy
        <br />
        MCP Servers
      </>
    }
    description="Build gamification with your AI agent."
    titleSize={72}
  >
    <div
      style={{
        position: "absolute",
        left: 608,
        top: 40 + UI_OFFSET_Y,
        width: 552,
        display: "flex",
        flexDirection: "column",
        gap: 14,
      }}
    >
      <div style={{ display: "flex", gap: 14, width: 552 }}>
        <ServerTile
          name="Docs MCP"
          caption="Context"
          icon={<BookOpen size={22} color={DARK.text} />}
        />
        <ServerTile
          name="Account MCP"
          caption="Action"
          icon={<Settings2 size={22} color={DARK.text} />}
        />
      </div>

      <Card style={{ overflow: "hidden" }}>
        {INTRO_ROWS.map((row, index) => (
          <div
            key={`${row.tool}-${index}`}
            style={{
              height: 62,
              boxSizing: "border-box",
              display: "flex",
              alignItems: "center",
              gap: 14,
              padding: "0 20px",
              borderTop: index === 0 ? "none" : `1px solid ${DARK.border}`,
              backgroundColor: index === 2 ? DARK.cardRaised : "transparent",
              boxShadow:
                index === 2 ? `inset 0 0 0 1px ${DARK.borderStrong}` : "none",
            }}
          >
            <IconTile
              size={32}
              tone={row.server === "docs" ? "neutral" : "green"}
            >
              {row.server === "docs" ? (
                <Search size={16} color={DARK.text} />
              ) : (
                <Check size={16} color={DARK.green} strokeWidth={3} />
              )}
            </IconTile>
            <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
              <div
                style={{
                  fontFamily: monoFont,
                  fontSize: 16,
                  fontWeight: 500,
                  color: DARK.text,
                }}
              >
                {row.tool}
              </div>
              <div style={{ fontSize: 13, color: DARK.muted }}>
                {row.detail}
              </div>
            </div>
            <div style={{ flex: 1 }} />
            <Chip>{row.server === "docs" ? "Docs" : "Account"}</Chip>
          </div>
        ))}
      </Card>
    </div>
  </ShotLayout>
);

/* ------------------------------------------------------------------ */
/* 2. Docs MCP                                                         */
/* ------------------------------------------------------------------ */

const DOCS_RESULTS = [
  {
    title: "Submit a metric event",
    tag: "API reference",
    snippet:
      "Send an event when a user completes an action to update their streaks, points and achievements.",
  },
  {
    title: "Streaks",
    tag: "Guide",
    snippet:
      "Reward users for coming back regularly, on a daily, weekly or monthly cadence.",
  },
  {
    title: "Points & levels",
    tag: "Guide",
    snippet: "Award XP for any activity and let users progress through levels.",
  },
  {
    title: "Achievements & leaderboards",
    tag: "Guide",
    snippet: "Recognise milestones and add friendly competition between users.",
  },
];

export const DocsShot: React.FC = () => (
  <ShotLayout
    title="Docs MCP"
    description="Live, always up-to-date Trophy docs. Your agent searches guides and API reference on demand."
    titleSize={76}
  >
    <div
      style={{
        position: "absolute",
        left: 608,
        top: 40 + UI_OFFSET_Y,
        width: 552,
        display: "flex",
        flexDirection: "column",
        gap: 14,
      }}
    >
      <Card
        style={{
          width: 552,
          padding: "16px 20px",
          display: "flex",
          alignItems: "center",
          gap: 14,
        }}
      >
        <IconTile size={40}>
          <TrophyMark size={20} color={DARK.text} />
        </IconTile>
        <div style={{ display: "flex", flexDirection: "column", gap: 3 }}>
          <div
            style={{
              fontFamily: monoFont,
              fontSize: 17,
              fontWeight: 500,
              color: DARK.text,
            }}
          >
            search_trophy_docs
          </div>
          <div style={{ fontSize: 13, color: DARK.muted }}>Trophy Docs</div>
        </div>
        <div style={{ flex: 1 }} />
        <DoneBadge />
      </Card>

      <Card
        style={{
          width: 552,
          height: 52,
          padding: "0 18px",
          display: "flex",
          alignItems: "center",
          gap: 12,
          borderColor: DARK.borderStrong,
        }}
      >
        <Search size={18} color={DARK.muted} />
        <div style={{ fontSize: 17, color: DARK.text }}>
          Submit a metric event
        </div>
      </Card>

      <Card style={{ overflow: "hidden" }}>
        {DOCS_RESULTS.map((result, index) => (
          <div
            key={result.title}
            style={{
              padding: "18px 22px",
              display: "flex",
              flexDirection: "column",
              gap: 8,
              borderTop: index === 0 ? "none" : `1px solid ${DARK.border}`,
              backgroundColor: index === 0 ? DARK.cardRaised : "transparent",
              boxShadow:
                index === 0 ? `inset 0 0 0 1px ${DARK.borderStrong}` : "none",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <div style={{ fontSize: 18, fontWeight: 600, color: DARK.text }}>
                {result.title}
              </div>
              <Chip>{result.tag}</Chip>
            </div>
            <div
              style={{
                fontSize: 15,
                lineHeight: 1.45,
                color: DARK.muted,
                maxWidth: 520,
              }}
            >
              {result.snippet}
            </div>
          </div>
        ))}
      </Card>
    </div>
  </ShotLayout>
);

/* ------------------------------------------------------------------ */
/* 3. Account MCP                                                      */
/* ------------------------------------------------------------------ */

const ACCOUNT_TILES = [
  {
    icon: <Activity size={20} color={DARK.text} />,
    label: "Metric",
    value: "workouts-completed",
    tool: "write_metrics",
  },
  {
    icon: <Flame size={20} color={DARK.text} />,
    label: "Streak",
    value: "Weekly · 3 workouts",
    tool: "update_streak_settings",
  },
  {
    icon: <Sparkles size={20} color={DARK.text} />,
    label: "Points",
    value: "+10 XP per workout",
    tool: "write_points_systems",
  },
  {
    icon: <Trophy size={20} color={DARK.text} />,
    label: "Achievements",
    value: "10, 25 & 50 workouts",
    tool: "write_achievements",
  },
];

const LEADERBOARD_ROWS = [
  { rank: 1, name: "Ava Turner", value: "24" },
  { rank: 2, name: "Leo Harrison", value: "22" },
  { rank: 3, name: "Rowan Elijah", value: "19" },
];

export const AccountShot: React.FC = () => (
  <ShotLayout
    title="Account MCP"
    description="Configure metrics, streaks, points, achievements and leaderboards straight from chat."
    titleSize={76}
  >
    <div
      style={{
        position: "absolute",
        left: 608,
        top: 40 + UI_OFFSET_Y,
        width: 552,
        display: "flex",
        flexDirection: "column",
        gap: 14,
      }}
    >
      <div style={{ display: "flex", flexWrap: "wrap", gap: 14, width: 552 }}>
        {ACCOUNT_TILES.map((tile) => (
          <Card
            key={tile.label}
            style={{
              width: 269,
              padding: "18px 20px",
              display: "flex",
              flexDirection: "column",
              gap: 16,
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <IconTile size={38}>{tile.icon}</IconTile>
              <DoneBadge />
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
              <div style={{ fontSize: 13, color: DARK.muted }}>
                {tile.label}
              </div>
              <div style={{ fontSize: 18, fontWeight: 600, color: DARK.text }}>
                {tile.value}
              </div>
            </div>
            <div
              style={{
                fontFamily: monoFont,
                fontSize: 12,
                fontWeight: 500,
                color: DARK.faint,
              }}
            >
              {tile.tool}
            </div>
          </Card>
        ))}
      </div>

      <Card style={{ overflow: "hidden" }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
            padding: "16px 20px",
            borderBottom: `1px solid ${DARK.border}`,
          }}
        >
          <IconTile size={32}>
            <Medal size={16} color={DARK.text} />
          </IconTile>
          <div style={{ fontSize: 16, fontWeight: 600, color: DARK.text }}>
            weekly-workouts
          </div>
          <div
            style={{
              fontFamily: monoFont,
              fontSize: 12,
              color: DARK.faint,
            }}
          >
            write_leaderboards
          </div>
          <div style={{ flex: 1 }} />
          <DoneBadge />
        </div>
        {LEADERBOARD_ROWS.map((row, index) => (
          <div
            key={row.name}
            style={{
              height: 52,
              boxSizing: "border-box",
              display: "flex",
              alignItems: "center",
              gap: 16,
              padding: "0 22px",
              borderTop: index === 0 ? "none" : `1px solid ${DARK.border}`,
              fontSize: 16,
              color: DARK.text,
            }}
          >
            <div style={{ width: 16, color: DARK.muted, fontWeight: 600 }}>
              {row.rank}
            </div>
            <div style={{ flex: 1, fontWeight: 500 }}>{row.name}</div>
            <div style={{ fontWeight: 700 }}>{row.value}</div>
          </div>
        ))}
      </Card>
    </div>
  </ShotLayout>
);

/* ------------------------------------------------------------------ */
/* 4. Brainstorm in Claude                                             */
/* ------------------------------------------------------------------ */

const CHAT_WINDOW = { width: 795, height: 960, column: 660 };
const CHAT_SCALE = 0.78;
const CHAT_PROMPT =
  "I'm building Pulse, a fitness app. I want members to build a habit and get some friendly competition going. What should I set up in Trophy?";

export const ChatShot: React.FC = () => (
  <ShotLayout
    title={<>Brainstorm Trophy features with Claude</>}
    description="Describe your app and Claude uses Trophy's docs to suggest what to build."
    titleSize={52}
  >
    <div
      style={{
        position: "absolute",
        left: 582,
        top: 34,
        width: CHAT_WINDOW.width,
        height: CHAT_WINDOW.height,
        transform: `scale(${CHAT_SCALE})`,
        transformOrigin: "top left",
      }}
    >
      <ClaudeStyleChat
        style={{
          width: "100%",
          height: "100%",
          borderTopRightRadius: 0,
          borderBottomRightRadius: 0,
        }}
        title="Pulse gamification setup"
        columnWidth={CHAT_WINDOW.column}
        composer={
          <span style={{ color: CLAUDE_COLORS.faint }}>Reply to Claude…</span>
        }
      >
        <div
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            top: 0,
            display: "flex",
            flexDirection: "column",
          }}
        >
          <div style={{ display: "flex", justifyContent: "flex-end" }}>
            <div
              style={{
                maxWidth: 540,
                marginTop: 40,
                padding: "18px 24px",
                borderRadius: 20,
                backgroundColor: CLAUDE_COLORS.bubble,
                fontSize: 23,
                lineHeight: 1.45,
                color: CLAUDE_COLORS.text,
              }}
            >
              {CHAT_PROMPT}
            </div>
          </div>

          <ClaudeSerifText style={{ paddingTop: 28 }}>
            {CHAT_DOCS_INTRO}
          </ClaudeSerifText>

          <div
            style={{
              marginTop: 14,
              height: 48,
              display: "flex",
              alignItems: "center",
              gap: 14,
              fontSize: 21,
              color: CLAUDE_COLORS.muted,
            }}
          >
            <ConnectorIcon />
            <span style={{ color: CLAUDE_COLORS.text, fontWeight: 500 }}>
              Used 3 tools
            </span>
            <span>Trophy Docs</span>
          </div>

          <ClaudeSerifText style={{ paddingTop: 20 }}>
            {CHAT_SUGGESTION_INTRO}
            <ul style={{ margin: "8px 0 0", paddingLeft: 30 }}>
              {CHAT_SUGGESTION_ITEMS.map((item) => (
                <li key={item.name}>
                  <strong style={{ fontWeight: 600 }}>{item.name}</strong>{" "}
                  {item.detail}
                </li>
              ))}
            </ul>
          </ClaudeSerifText>
        </div>
      </ClaudeStyleChat>
    </div>
  </ShotLayout>
);

/* ------------------------------------------------------------------ */
/* 5. Coding agent                                                     */
/* ------------------------------------------------------------------ */

const IDE_WINDOW = { width: 903, height: 840, agent: 480 };
const IDE_SCALE = 0.7;
const DIFF_ADDED = "#73c991";
const DIFF_REMOVED = "#f48771";

export const CodingAgentShot: React.FC = () => (
  <ShotLayout
    title={<>Integrate Trophy with your coding agent</>}
    description="Your agent reads the docs and your Trophy setup, then integrates it into your codebase."
    titleSize={52}
  >
    <div
      style={{
        position: "absolute",
        left: 570,
        top: 34,
        width: IDE_WINDOW.width,
        height: IDE_WINDOW.height + EXTRA_HEIGHT / IDE_SCALE,
        transform: `scale(${IDE_SCALE})`,
        transformOrigin: "top left",
      }}
    >
      <CursorStyleIde
        style={{
          width: "100%",
          height: "100%",
          borderTopRightRadius: 0,
          borderBottomRightRadius: 0,
        }}
        hideExplorer
        agentWidth={IDE_WINDOW.agent}
        editorTab="workouts.ts"
        explorer={null}
        editor={
          <div style={{ position: "absolute", inset: 0, overflow: "hidden" }}>
            <SyntaxHighlighter
              language="typescript"
              style={vscDarkPlus}
              showLineNumbers
              wrapLongLines={false}
              customStyle={{
                margin: 0,
                padding: "16px 8px",
                background: "transparent",
                fontSize: 17,
                lineHeight: 1.55,
                fontFamily: monoFont,
              }}
              codeTagProps={{ style: { fontFamily: monoFont } }}
            >
              {INTEGRATION_CODE}
            </SyntaxHighlighter>
          </div>
        }
        agentComposer={
          <span style={{ color: IDE_COLORS.muted }}>
            Plan, search, build anything…
          </span>
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

            <div
              style={{ paddingTop: 18, fontSize: 18, color: IDE_COLORS.muted }}
            >
              Thought for 3s
            </div>

            {AGENT_TOOL_CALLS.map((call) => (
              <div key={call.tool} style={{ paddingTop: 14 }}>
                <ToolCallRow
                  server={call.server}
                  tool={call.tool}
                  startFrame={-100}
                  doneFrame={-100}
                />
              </div>
            ))}

            {AGENT_FILE_EDITS.slice(0, 3).map((edit, index) => (
              <div key={edit.path} style={{ paddingTop: index === 0 ? 18 : 8 }}>
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
                  }}
                >
                  <span
                    style={{
                      flex: 1,
                      fontFamily: monoFont,
                      color: "#e8e8e8",
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    }}
                  >
                    {edit.path}
                  </span>
                  <span style={{ fontFamily: monoFont, fontWeight: 600 }}>
                    <span style={{ color: DIFF_ADDED }}>+{edit.added}</span>{" "}
                    <span style={{ color: DIFF_REMOVED }}>-{edit.removed}</span>
                  </span>
                </div>
              </div>
            ))}

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
          </div>
        }
      />
    </div>
  </ShotLayout>
);
