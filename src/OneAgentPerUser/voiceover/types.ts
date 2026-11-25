/** One voiced take (scripts/generate-voiceover.mjs writes these to takes/) */
export type VoiceoverTake = {
  /** Under public/OneAgentPerUser/voiceover/ */
  file: string;
  hash: string;
  /** Where speech starts and ends in the file, seconds */
  speechStart: number;
  speechEnd: number;
  /** Stop playing here (seconds): in the pause before the script's unheard "Tail" line */
  playUntil?: number;
  /** Section labels from script.txt, in order */
  sections: string[];
  /** Every spoken word: start and end in the file (seconds) and its section index */
  words: { w: string; s: number; e: number; section: number }[];
};

export const VOICEOVER_DIR = "OneAgentPerUser/voiceover";
