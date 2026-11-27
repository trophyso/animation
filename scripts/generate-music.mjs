#!/usr/bin/env node
/**
 * Generates instrumental background music with ElevenLabs' Eleven Music
 * (POST /v1/music) and writes it to public/music/<track>.mp3. The videos pick
 * a track by key (src/music.ts) and mix it under the voice.
 *
 * Usage: npm run music -- --track indie-electronic [--seconds 45] [--force]
 * An existing file is kept unless --force (every generation is different, so
 * regenerating replaces the track you have been listening to).
 *
 * Env (shell or .env): ELEVENLABS_API_KEY. Starter plan: about 10 credits a
 * second of music, and at most 2 requests at once.
 */
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const OUT_DIR = join(ROOT, "public", "music");

const loadDotEnv = () => {
  const file = join(ROOT, ".env");
  if (!existsSync(file)) return;
  for (const line of readFileSync(file, "utf8").split("\n")) {
    const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*?)\s*$/);
    if (m && !process.env[m[1]]) process.env[m[1]] = m[2].replace(/^["']|["']$/g, "");
  }
};
loadDotEnv();

/** Said of every track: it sits under a casual British founder voiceover */
const BED =
  "Instrumental background bed for a short, friendly tech product explainer with a casual British voiceover on top. No vocals. Sparse midrange so speech stays clear, steady energy, no big drops.";

/**
 * The five styles sampled on 2026-11-27 (out/music-samples/). Charlie picked
 * indie-electronic for the first video with music (Aisha).
 */
const TRACKS = {
  "marimba-pop":
    "Light, optimistic modern tech explainer, around 110 BPM. Soft marimba and pizzicato plucks, warm synth pad, light brushed percussion, gentle claps on the backbeat. Playful and confident.",
  "lofi-keys":
    "Warm lo-fi chillhop, around 90 BPM. Mellow Rhodes electric piano chords, soft vinyl texture, relaxed boom-bap drums, round sub bass. Laid-back, cosy, friendly.",
  "indie-electronic":
    "Bright indie electronic, around 118 BPM. Shimmering synth arpeggio, clean four-on-the-floor kick with soft hats, plucky bass, airy pads. Upbeat, forward-moving startup energy.",
  "acoustic-claps":
    "Feel-good acoustic pop, around 105 BPM. Strummed acoustic guitar, hand claps, stomps, light glockenspiel melody, ukulele accents. Warm, human, sunny.",
  "minimal-piano-pulse":
    "Minimal modern piano with a soft electronic pulse, around 100 BPM. Repeating felt-piano motif, subtle ticking percussion, warm low synth, gentle build. Calm, clever, premium.",
};

const args = process.argv.slice(2);
const opt = (name) => {
  const i = args.indexOf(`--${name}`);
  return i === -1 ? undefined : args[i + 1];
};
const track = opt("track");
const seconds = Number(opt("seconds") ?? 45);
const force = args.includes("--force");

if (!track || !TRACKS[track]) {
  console.error(`Usage: npm run music -- --track <${Object.keys(TRACKS).join("|")}> [--seconds 45] [--force]`);
  process.exit(1);
}
if (!process.env.ELEVENLABS_API_KEY) {
  console.error("ELEVENLABS_API_KEY is not set (shell or .env)");
  process.exit(1);
}

const out = join(OUT_DIR, `${track}.mp3`);
if (existsSync(out) && !force) {
  console.log(`${out} exists; pass --force to replace it`);
  process.exit(0);
}

const body = JSON.stringify({
  prompt: `${TRACKS[track]} ${BED}`,
  music_length_ms: Math.round(seconds * 1000),
  model_id: "music_v1",
  force_instrumental: true,
});

for (let attempt = 1; ; attempt++) {
  const res = await fetch("https://api.elevenlabs.io/v1/music?output_format=mp3_44100_128", {
    method: "POST",
    headers: { "xi-api-key": process.env.ELEVENLABS_API_KEY, "Content-Type": "application/json" },
    body,
  });
  if (res.status === 429 && attempt < 6) {
    console.log("ElevenLabs is busy, retrying…");
    await new Promise((r) => setTimeout(r, 5000 * attempt));
    continue;
  }
  if (!res.ok) {
    console.error(`ElevenLabs ${res.status}: ${await res.text()}`);
    process.exit(1);
  }
  mkdirSync(OUT_DIR, { recursive: true });
  writeFileSync(out, Buffer.from(await res.arrayBuffer()));
  console.log(`Wrote ${out} (${seconds}s)`);
  break;
}
