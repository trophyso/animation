import React from "react";
import { Audio, Sequence, interpolate, staticFile } from "remotion";
import { VO_OFFSET, f } from "../script";
import { useVideo } from "../video";
import { VOICEOVER_DIR } from "../voiceover/types";

/** Frames the voice fades out over before `playUntil` */
const FADE = 8;

/**
 * The story's voice take: one continuous file, played from the start; the
 * animation follows it (timeline.ts). It stops in the pause before the
 * script's unheard "Tail" line, with a short fade.
 */
export const Voiceover: React.FC = () => {
  const { take } = useVideo();
  if (!take) return null;
  const end = take.playUntil === undefined ? undefined : f(take.playUntil);
  return (
    <Sequence name="Voiceover" from={f(VO_OFFSET)} layout="none">
      <Audio
        src={staticFile(`${VOICEOVER_DIR}/${take.file}`)}
        trimAfter={end}
        volume={(fr) => (end === undefined ? 1 : interpolate(fr, [end - FADE, end], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }))}
      />
    </Sequence>
  );
};
