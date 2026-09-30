import React from "react";
import { linearTiming, TransitionSeries } from "@remotion/transitions";
import { fade } from "@remotion/transitions/fade";
import { slide } from "@remotion/transitions/slide";
import { CHAT_DURATION, ChatScene } from "./scenes/ChatScene";
import { CODING_DURATION, CodingAgentScene } from "./scenes/CodingAgentScene";
import { INTRO_DURATION, IntroScene } from "./scenes/IntroScene";
import { MOBILE_DURATION, MobileAppScene } from "./scenes/MobileAppScene";
import { OUTRO_DURATION, OutroScene } from "./scenes/OutroScene";
import { SERVERS_DURATION, ServersScene } from "./scenes/ServersScene";
import { TRANSITION_FRAMES } from "./script";

/** Sum of scene durations minus the five transition overlaps. */
export const MCP_LAUNCH_VIDEO_DURATION =
  INTRO_DURATION +
  SERVERS_DURATION +
  CHAT_DURATION +
  CODING_DURATION +
  MOBILE_DURATION +
  OUTRO_DURATION -
  5 * TRANSITION_FRAMES;

export const McpLaunchVideo: React.FC = () => {
  return (
    <TransitionSeries>
      <TransitionSeries.Sequence durationInFrames={INTRO_DURATION} name="Intro">
        <IntroScene />
      </TransitionSeries.Sequence>
      <TransitionSeries.Transition
        presentation={fade()}
        timing={linearTiming({ durationInFrames: TRANSITION_FRAMES })}
      />
      <TransitionSeries.Sequence durationInFrames={SERVERS_DURATION} name="Servers">
        <ServersScene />
      </TransitionSeries.Sequence>
      <TransitionSeries.Transition
        presentation={slide({ direction: "from-right" })}
        timing={linearTiming({ durationInFrames: TRANSITION_FRAMES })}
      />
      <TransitionSeries.Sequence durationInFrames={CHAT_DURATION} name="Chat">
        <ChatScene />
      </TransitionSeries.Sequence>
      <TransitionSeries.Transition
        presentation={slide({ direction: "from-right" })}
        timing={linearTiming({ durationInFrames: TRANSITION_FRAMES })}
      />
      <TransitionSeries.Sequence durationInFrames={CODING_DURATION} name="CodingAgent">
        <CodingAgentScene />
      </TransitionSeries.Sequence>
      <TransitionSeries.Transition
        presentation={slide({ direction: "from-right" })}
        timing={linearTiming({ durationInFrames: TRANSITION_FRAMES })}
      />
      <TransitionSeries.Sequence durationInFrames={MOBILE_DURATION} name="MobileApp">
        <MobileAppScene />
      </TransitionSeries.Sequence>
      <TransitionSeries.Transition
        presentation={fade()}
        timing={linearTiming({ durationInFrames: TRANSITION_FRAMES })}
      />
      <TransitionSeries.Sequence durationInFrames={OUTRO_DURATION} name="Outro">
        <OutroScene />
      </TransitionSeries.Sequence>
    </TransitionSeries>
  );
};
