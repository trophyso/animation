import React from "react";
import { Audio, interpolate, staticFile, useVideoConfig } from "remotion";
import { VO_OFFSET, f } from "../script";
import { useVideo } from "../video";

/**
 * Music level while the voice speaks. Measured on Aisha: the voice averages
 * about -17 dBFS and the track about -16, so 0.12 (-18 dB) sits the music
 * roughly 17 dB under the voice.
 */
const UNDER_VOICE = 0.12;
/** Level once the voice has finished, so the logo gets a bit of a lift */
const AFTER_VOICE = 0.3;
const FADE_IN = f(0.5);
const LIFT = f(0.3);
const FADE_OUT = f(0.4);

/**
 * The background music bed: under the voice for the whole video, lifted
 * when the voice finishes, and faded out over the last few frames in case the
 * track hasn't ended by itself.
 */
export const Music: React.FC = () => {
  const { music, take } = useVideo();
  const { durationInFrames } = useVideoConfig();
  if (!music) return null;
  const voiceEnd = take ? f(VO_OFFSET + (take.playUntil ?? take.speechEnd)) : durationInFrames;
  const volume = (fr: number) => {
    const base = interpolate(fr, [voiceEnd, voiceEnd + LIFT], [UNDER_VOICE, AFTER_VOICE], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
    const fade = interpolate(fr, [0, FADE_IN, durationInFrames - FADE_OUT, durationInFrames], [0, 1, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
    return base * fade;
  };
  return <Audio name="Music" src={staticFile(music.file)} trimBefore={f(music.startAt)} volume={volume} />;
};
