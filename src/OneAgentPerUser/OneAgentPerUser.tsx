import React from "react";
import { AbsoluteFill, Sequence, type CalculateMetadataFunction } from "remotion";
import { Voiceover } from "./components/Voiceover";
import { f, type SceneName } from "./script";
import { ChartScene } from "./scenes/ChartScene";
import { DecisionScene } from "./scenes/DecisionScene";
import { FanOutScene } from "./scenes/FanOutScene";
import { MessageScene } from "./scenes/MessageScene";
import { OneAgentScene } from "./scenes/OneAgentScene";
import { OutroScene } from "./scenes/OutroScene";
import { SamePathScene } from "./scenes/SamePathScene";
import { VideoProvider, resolveVideo, useVideo, type VideoProps } from "./video";

export { videoSchema, type VideoProps } from "./video";

const SCENES: [SceneName, string, React.FC][] = [
  ["samePath", "Same path", SamePathScene],
  ["oneAgent", "One agent", OneAgentScene],
  ["fanOut", "Fan out", FanOutScene],
  ["decision", "Decision", DecisionScene],
  ["message", "Message", MessageScene],
  ["chart", "Chart", ChartScene],
  ["outro", "Outro", OutroScene],
];

/** Mei's story on the flat ground: the original video */
export const DEFAULT_VIDEO: VideoProps = { story: "mei", sky: "plain" };

/** The video runs as long as its story's voice take needs */
export const calculateVideoMetadata: CalculateMetadataFunction<VideoProps> = ({ props }) => ({
  durationInFrames: resolveVideo(props).timeline.totalFrames,
});

const Scenes: React.FC = () => {
  const { ground, timeline } = useVideo();
  return (
    <AbsoluteFill style={{ background: ground.background }}>
      <Voiceover />
      {SCENES.map(([scene, name, Scene]) => (
        <Sequence key={scene} name={name} from={f(timeline.cue[scene])} durationInFrames={timeline.duration(scene)}>
          <Scene />
        </Sequence>
      ))}
    </AbsoluteFill>
  );
};

/**
 * "One agent per user", for any of the website's user stories, on any ground,
 * voiced by a narrator who matches the person. Scenes are hard cuts at the cue points; every scene paints
 * its own ground and handles its own exit (the agent dot flooding the frame
 * with indigo and collapsing back, the decision and chart frames blurring
 * away), so no transition layer is needed.
 */
export const OneAgentPerUser: React.FC<VideoProps> = (props) => (
  <VideoProvider props={props}>
    <Scenes />
  </VideoProvider>
);

/** One scene on its own, for previewing in the Studio */
export const OneAgentPerUserScene: React.FC<VideoProps & { scene: SceneName }> = ({ scene, ...props }) => {
  const Scene = SCENES.find(([s]) => s === scene)![2];
  return (
    <VideoProvider props={props}>
      <Scene />
    </VideoProvider>
  );
};

export const sceneDuration = (scene: SceneName, props: VideoProps = DEFAULT_VIDEO) => resolveVideo(props).timeline.duration(scene);
export { SCENES as ONE_AGENT_SCENES };
