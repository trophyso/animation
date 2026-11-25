import React from "react";
import { AbsoluteFill, Sequence } from "remotion";
import { Voiceover } from "./components/Voiceover";
import { C, CUE, TOTAL_FRAMES, f } from "./script";
import { SAME_PATH_DURATION, SamePathScene } from "./scenes/SamePathScene";
import { FAN_OUT_DURATION, FanOutScene } from "./scenes/FanOutScene";
import { ONE_AGENT_DURATION, OneAgentScene } from "./scenes/OneAgentScene";
import { DECISION_DURATION, DecisionScene } from "./scenes/DecisionScene";
import { PUSH_DURATION, PushScene } from "./scenes/PushScene";
import { CHART_DURATION, ChartScene } from "./scenes/ChartScene";
import { OUTRO_DURATION, OutroScene } from "./scenes/OutroScene";

/** 1770 frames at 60fps */
export const ONE_AGENT_PER_USER_DURATION = TOTAL_FRAMES;

/**
 * Scenes are hard cuts at the source's cue points; every scene paints its own
 * ground and handles its own exit (the agent dot flooding the frame with indigo and collapsing back, the
 * decision and chart frames blurring away), so no transition layer is needed.
 */
export const OneAgentPerUser: React.FC = () => (
  <AbsoluteFill style={{ background: C.bg }}>
    <Voiceover />
    <Sequence name="Same path" from={f(CUE.samePath)} durationInFrames={SAME_PATH_DURATION}>
      <SamePathScene />
    </Sequence>
    <Sequence name="One agent" from={f(CUE.oneAgent)} durationInFrames={ONE_AGENT_DURATION}>
      <OneAgentScene />
    </Sequence>
    <Sequence name="Fan out" from={f(CUE.fanOut)} durationInFrames={FAN_OUT_DURATION}>
      <FanOutScene />
    </Sequence>
    <Sequence name="Decision" from={f(CUE.decision)} durationInFrames={DECISION_DURATION}>
      <DecisionScene />
    </Sequence>
    <Sequence name="Push" from={f(CUE.push)} durationInFrames={PUSH_DURATION}>
      <PushScene />
    </Sequence>
    <Sequence name="Chart" from={f(CUE.chart)} durationInFrames={CHART_DURATION}>
      <ChartScene />
    </Sequence>
    <Sequence name="Outro" from={f(CUE.outro)} durationInFrames={OUTRO_DURATION}>
      <OutroScene />
    </Sequence>
  </AbsoluteFill>
);
