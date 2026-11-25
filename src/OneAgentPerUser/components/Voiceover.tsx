import React from "react";
import { Audio, Sequence, staticFile } from "remotion";
import { VO_OFFSET, f } from "../script";
import { VOICEOVER, VOICEOVER_DIR } from "../voiceover/timings";

/** The ElevenLabs voiceover: one continuous take, played start to finish; the animation follows it (SYNC) */
export const Voiceover: React.FC = () => {
  if (!VOICEOVER) return null;
  return (
    <Sequence name="Voiceover" from={f(VO_OFFSET)} layout="none">
      <Audio src={staticFile(`${VOICEOVER_DIR}/${VOICEOVER.file}`)} />
    </Sequence>
  );
};
