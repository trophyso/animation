/**
 * Background music tracks, made with ElevenLabs' Eleven Music by
 * scripts/generate-music.mjs (npm run music -- --track <key>) and kept under
 * public/music/. Add a track here once it has been generated.
 */
export type MusicTrack = {
  /** Under public/ */
  file: string;
  /** Seconds into the file where the music starts (skips leading silence) */
  startAt: number;
};

export const MUSIC = {
  /**
   * Bright indie electronic, ~118 BPM. Its 45s take ends by itself, fading from
   * about 39.2s and gone by 41.5s, which lines up with the logo at the end of
   * the ~40s story videos.
   */
  "indie-electronic": { file: "music/indie-electronic.mp3", startAt: 0.4 },
} satisfies Record<string, MusicTrack>;

export type MusicKey = keyof typeof MUSIC;
export const MUSIC_KEYS = Object.keys(MUSIC) as MusicKey[];
