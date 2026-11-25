import React, { createContext, useContext, useMemo } from "react";
import { z } from "zod";
import { GROUNDS, groundFor, type Ground, type GroundName } from "./ground";
import type { SceneName } from "./script";
import { STORIES, STORY_KEYS, type Narrator, type Story, type StoryKey } from "./stories";
import { buildTimeline, type Timeline } from "./timeline";
import { TAKES } from "./voiceover/takes";
import type { VoiceoverTake } from "./voiceover/types";

/**
 * What a "One agent per user" video can be switched by (Remotion Studio shows
 * these as controls). The voice follows the story: its narrator matches the
 * person (Story.narrator).
 */
export const videoSchema = z.object({
  story: z.enum(STORY_KEYS as [StoryKey, ...StoryKey[]]),
  /** "story" uses the story's own sky from the website */
  sky: z.enum(["story", ...GROUNDS] as ["story", ...GroundName[]]),
});
export type VideoProps = z.infer<typeof videoSchema>;

export type Video = {
  story: Story;
  ground: Ground;
  narrator: Narrator;
  /** The voice take, if it has been generated (npm run voiceover) */
  take: VoiceoverTake | undefined;
  timeline: Timeline;
};

/** The take for a story: voiceover/takes/<story>-<narrator>.ts */
export const takeKey = (story: Story) => `${story.key}-${story.narrator}`;

export const resolveVideo = ({ story, sky }: VideoProps): Video => {
  const s = STORIES[story];
  const take = TAKES[takeKey(s)];
  return {
    story: s,
    ground: groundFor(sky === "story" ? s.sky : sky),
    narrator: s.narrator,
    take,
    timeline: buildTimeline(s, take),
  };
};

const VideoContext = createContext<Video | null>(null);

export const VideoProvider: React.FC<{ props: VideoProps; children: React.ReactNode }> = ({ props, children }) => {
  const { story, sky } = props;
  const video = useMemo(() => resolveVideo({ story, sky }), [story, sky]);
  return <VideoContext.Provider value={video}>{children}</VideoContext.Provider>;
};

export const useVideo = (): Video => {
  const v = useContext(VideoContext);
  if (!v) throw new Error("useVideo must be used inside a VideoProvider (the OneAgentPerUser composition)");
  return v;
};

/** A scene's view of the video: `T(s)` is frames from the scene's start to source-clock second `s` */
export const useScene = (scene: SceneName) => {
  const video = useVideo();
  const T = (s: number) => video.timeline.at(scene, s);
  return { ...video, T };
};
