import React from "react";
import { AbsoluteFill, Img, staticFile } from "remotion";
import { sansFont } from "../McpLaunchVideo/fonts";

export const SHOT_WIDTH = 1270;
export const SHOT_HEIGHT = 760;

/** Shots are laid out on a 1200px wide stage and scaled up to fill the canvas. */
const STAGE_WIDTH = 1200;
const STAGE_SCALE = SHOT_WIDTH / STAGE_WIDTH;
export const STAGE_HEIGHT = Math.round(SHOT_HEIGHT / STAGE_SCALE);
/** Vertical offset that centres UI designed for a 630px tall stage. */
export const UI_OFFSET_Y = Math.round((STAGE_HEIGHT - 630) / 2);
/** Extra stage height for UI that bleeds off the bottom edge. */
export const EXTRA_HEIGHT = STAGE_HEIGHT - 630;

export const DARK = {
  background: "#0a0a0a",
  card: "#111111",
  cardRaised: "#161616",
  border: "#232323",
  borderStrong: "#3a3a3a",
  text: "#fafafa",
  muted: "#8a8a8a",
  faint: "#5c5c5c",
  green: "#4CC74A",
  greenSoft: "rgba(76, 199, 74, 0.14)",
};

/** Dark launch-image frame: logo top left, headline and description bottom left, UI on the right. */
export const ShotLayout: React.FC<{
  title: React.ReactNode;
  description: string;
  titleSize?: number;
  children: React.ReactNode;
}> = ({ title, description, titleSize = 66, children }) => (
  <AbsoluteFill
    style={{
      backgroundColor: DARK.background,
      fontFamily: sansFont,
      overflow: "hidden",
    }}
  >
    <div
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        width: STAGE_WIDTH,
        height: STAGE_HEIGHT,
        transform: `scale(${STAGE_SCALE})`,
        transformOrigin: "top left",
      }}
    >
      {children}

      <Img
        src={staticFile("brand/logo_dark.svg")}
        style={{ position: "absolute", top: 36, left: 40, width: 168 }}
      />

      <div
        style={{
          position: "absolute",
          left: 32,
          bottom: 34,
          width: 540,
          display: "flex",
          flexDirection: "column",
          gap: 22,
        }}
      >
        <div
          style={{
            fontSize: titleSize,
            fontWeight: 500,
            lineHeight: 1.1,
            letterSpacing: "-0.025em",
            color: DARK.text,
          }}
        >
          {title}
        </div>
        <div
          style={{
            fontSize: 19,
            lineHeight: 1.45,
            fontWeight: 400,
            color: DARK.muted,
            maxWidth: 470,
          }}
        >
          {description}
        </div>
      </div>
    </div>
  </AbsoluteFill>
);
