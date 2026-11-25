import React from "react";
import { Audio, Sequence, staticFile } from "remotion";
import { VO_OFFSET, f } from "../script";
import { VOICEOVER, VOICEOVER_DIR } from "../voiceover/timings";

/** The ElevenLabs voiceover: one continuous take, starting VO_OFFSET into the video */
export const Voiceover: React.FC = () =>
  VOICEOVER ? (
    <Sequence name="Voiceover" from={f(VO_OFFSET)} layout="none">
      <Audio src={staticFile(`${VOICEOVER_DIR}/${VOICEOVER.file}`)} />
    </Sequence>
  ) : null;
