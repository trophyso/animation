import React from "react";
import { linearTiming, TransitionSeries } from "@remotion/transitions";
import { fade } from "@remotion/transitions/fade";
import { slide } from "@remotion/transitions/slide";
import { CLAIM_DURATION, ClaimScene } from "./scenes/ClaimScene";
import { CODE_DURATION, CodeScene } from "./scenes/CodeScene";
import { INTRO_DURATION, IntroScene } from "./scenes/IntroScene";
import { OUTRO_DURATION, OutroScene } from "./scenes/OutroScene";
import { TRIGGERS_DURATION, TriggersScene } from "./scenes/TriggersScene";
import { TYPES_DURATION, TypesScene } from "./scenes/TypesScene";
import { TRANSITION_FRAMES } from "./script";

/** Sum of scene durations minus the five transition overlaps. */
export const REWARDS_LAUNCH_VIDEO_DURATION =
  INTRO_DURATION +
  TRIGGERS_DURATION +
  TYPES_DURATION +
  CLAIM_DURATION +
  CODE_DURATION +
  OUTRO_DURATION -
  5 * TRANSITION_FRAMES;

export const RewardsLaunchVideo: React.FC = () => {
  return (
    <TransitionSeries>
      <TransitionSeries.Sequence durationInFrames={INTRO_DURATION} name="Intro">
        <IntroScene />
      </TransitionSeries.Sequence>
      <TransitionSeries.Transition
        presentation={fade()}
        timing={linearTiming({ durationInFrames: TRANSITION_FRAMES })}
      />
      <TransitionSeries.Sequence durationInFrames={TRIGGERS_DURATION} name="Triggers">
        <TriggersScene />
      </TransitionSeries.Sequence>
      <TransitionSeries.Transition
        presentation={slide({ direction: "from-right" })}
        timing={linearTiming({ durationInFrames: TRANSITION_FRAMES })}
      />
      <TransitionSeries.Sequence durationInFrames={TYPES_DURATION} name="Types">
        <TypesScene />
      </TransitionSeries.Sequence>
      <TransitionSeries.Transition
        presentation={slide({ direction: "from-right" })}
        timing={linearTiming({ durationInFrames: TRANSITION_FRAMES })}
      />
      <TransitionSeries.Sequence durationInFrames={CLAIM_DURATION} name="Claim">
        <ClaimScene />
      </TransitionSeries.Sequence>
      <TransitionSeries.Transition
        presentation={slide({ direction: "from-right" })}
        timing={linearTiming({ durationInFrames: TRANSITION_FRAMES })}
      />
      <TransitionSeries.Sequence durationInFrames={CODE_DURATION} name="Code">
        <CodeScene />
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
