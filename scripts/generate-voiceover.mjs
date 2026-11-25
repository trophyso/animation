#!/usr/bin/env node
/**
 * Voices the "One agent per user" videos: one ElevenLabs take per story and
 * voice, each the whole script read in ONE go, so the tone and pace stay
 * consistent from start to finish. The with-timestamps endpoint returns when
 * every word is spoken; the composition uses those word timings to hold its
 * animation until the voice catches up (src/OneAgentPerUser/timeline.ts).
 *
 * The script is src/OneAgentPerUser/voiceover/script.txt (the lines every
 * video shares) with the story's own sections from voiceover/stories/<story>.txt
 * dropped in where the labels match. Each story file names its narrator
 * ("voice: female" or "voice: male"), matching the person in the story.
 *
 * Writes, per take (<story>-<voice>, e.g. mei-female):
 *   public/OneAgentPerUser/voiceover/<story>-<voice>.mp3
 *   src/OneAgentPerUser/voiceover/takes/<story>-<voice>.ts
 * and regenerates src/OneAgentPerUser/voiceover/takes/index.ts.
 *
 * Usage: npm run voiceover -- [--story mei|joe|…|all] [--voice female|male] [--force]
 * (default: every story, in its own narrator's voice; --voice tries another).
 * An unchanged take is kept unless --force.
 *
 * Env (shell or .env): ELEVENLABS_API_KEY (required), ELEVENLABS_MODEL_ID,
 * ELEVENLABS_SEED (default 7; a different seed gives a different take). A
 * story file can pin its own take with a "seed: N" line (e.g. one whose
 * delivery came out right); --seed N overrides both, for trying takes.
 */
import { createHash } from "node:crypto";
import { existsSync, mkdirSync, readFileSync, readdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const VO_SRC = join(ROOT, "src/OneAgentPerUser/voiceover");
const BASE_SCRIPT = join(VO_SRC, "script.txt");
const STORY_DIR = join(VO_SRC, "stories");
const TAKES_DIR = join(VO_SRC, "takes");
const PUBLIC_DIR = "OneAgentPerUser/voiceover";
const OUT_DIR = join(ROOT, "public", PUBLIC_DIR);

const loadDotEnv = () => {
  const file = join(ROOT, ".env");
  if (!existsSync(file)) return;
  for (const line of readFileSync(file, "utf8").split("\n")) {
    const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*?)\s*$/);
    if (m && !process.env[m[1]]) process.env[m[1]] = m[2].replace(/^["']|["']$/g, "");
  }
};
loadDotEnv();

const API_KEY = process.env.ELEVENLABS_API_KEY;
/**
 * Both voices are young, energetic British founder types from the ElevenLabs
 * voice library. Others tried for the female read: Verity oW8bn5YtBB89X2nJ0DT9,
 * Cass WbwwsO6cCyUItWWlHOKN, Charlotte 6fZce9LFNG3iEITDfqZZ, Alice
 * Xb7hH8MSUJpSbSDYk0k2. Also tried for the male read: James
 * yBXjgyIwt8fF3slvxWZi (cold), Archie kmSVBPu7loj4ayNinwWM, Ned
 * fNYuJl2dBlX9V7NxmjnV, Ryan 50y2RdLRjpTShM4ZFm5D; the very first take used
 * Liam TX3LPaxmHKxFdv7VOQHJ.
 */
const VOICES = {
  /** "Lucy - Fresh & Casual" */
  female: "lcMyyd2HUfFzxdCaC4Ta",
  /** "Axell - Energetic YouTube Personality": trendy, young (Charlie's pick from the samples) */
  male: "2mltbVQP21Fq8XgIfRQJ",
};
/**
 * eleven_v3 takes audio tags like [excited] for delivery. It has no
 * <break /> tags: pause with "…", dashes and paragraph breaks.
 */
const MODEL_ID = process.env.ELEVENLABS_MODEL_ID || "eleven_v3";
const IS_V3 = MODEL_ID.startsWith("eleven_v3");
/**
 * An off-the-cuff founder read. v3 stability is 0 (Creative), 0.5 (Natural)
 * or 1 (Robust): Creative is the most expressive and least even, which is the
 * point; the audio tags drive the mood of each section.
 */
const VOICE_SETTINGS = IS_V3
  ? { stability: 0, similarity_boost: 0.75, use_speaker_boost: true, speed: 1.05 }
  : { stability: 0.3, similarity_boost: 0.75, style: 0.5, use_speaker_boost: true, speed: 1.12 };
const DEFAULT_SEED = Number(process.env.ELEVENLABS_SEED || 7);

const arg = (name, fallback) => {
  const i = process.argv.indexOf(`--${name}`);
  return i > 0 && process.argv[i + 1] ? process.argv[i + 1] : fallback;
};
const FORCE = process.argv.includes("--force");
const ALL_STORIES = readdirSync(STORY_DIR)
  .filter((f) => f.endsWith(".txt"))
  .map((f) => f.slice(0, -4))
  .sort();
const storyArg = arg("story", "all");
const voiceArg = arg("voice", null);
const stories = storyArg === "all" ? ALL_STORIES : storyArg.split(",");
for (const s of stories) if (!ALL_STORIES.includes(s)) throw new Error(`No voiceover/stories/${s}.txt (have: ${ALL_STORIES.join(", ")})`);
if (voiceArg && !VOICES[voiceArg]) throw new Error(`Unknown voice "${voiceArg}" (have: ${Object.keys(VOICES).join(", ")})`);

if (!API_KEY) {
  console.error("Missing ELEVENLABS_API_KEY. Add it to .env (gitignored) or export it, then rerun.");
  process.exit(1);
}

/** Sections start with "@ Label"; each becomes a paragraph of the one take. Empty sections are kept, to be filled by a story */
const parseScript = (src, name) => {
  const sections = [];
  for (const raw of src.split("\n")) {
    const line = raw.trim();
    if (!line || line.startsWith("#")) continue;
    if (/^(voice|seed):/.test(line)) continue;
    const head = line.match(/^@\s*(.*)$/);
    if (head) sections.push({ label: head[1] || `Section ${sections.length + 1}`, text: "" });
    else if (sections.length) {
      const s = sections[sections.length - 1];
      s.text = s.text ? `${s.text} ${line}` : line;
    } else throw new Error(`${name}: text before the first "@ Label" line: "${line}"`);
  }
  return sections;
};

/** The story's narrator, from its "voice: female|male" line */
const narratorOf = (story) => {
  const m = readFileSync(join(STORY_DIR, `${story}.txt`), "utf8").match(/^voice:\s*(\w+)\s*$/m);
  if (!m || !VOICES[m[1]]) throw new Error(`stories/${story}.txt needs a "voice: female" or "voice: male" line`);
  return m[1];
};

/** The story's seed: --seed, else its "seed: N" line, else the default */
const seedOf = (story) => {
  const flag = arg("seed", null);
  if (flag !== null) return Number(flag);
  const m = readFileSync(join(STORY_DIR, `${story}.txt`), "utf8").match(/^seed:\s*(\d+)\s*$/m);
  return m ? Number(m[1]) : DEFAULT_SEED;
};

/** The shared script with the story's sections dropped in by label */
const scriptFor = (story) => {
  const base = parseScript(readFileSync(BASE_SCRIPT, "utf8"), "script.txt");
  const own = parseScript(readFileSync(join(STORY_DIR, `${story}.txt`), "utf8"), `stories/${story}.txt`);
  for (const s of own) {
    const slot = base.find((b) => b.label === s.label);
    if (!slot) throw new Error(`stories/${story}.txt: script.txt has no "@ ${s.label}" section`);
    slot.text = s.text;
  }
  const empty = base.filter((s) => !s.text).map((s) => s.label);
  if (empty.length) throw new Error(`stories/${story}.txt leaves these sections empty: ${empty.join(", ")}`);
  return base;
};

/** Audio and break tags come back in the alignment as if spoken */
const tagMask = (chars) => {
  let depth = 0;
  return chars.map((c) => {
    if (c === "<" || c === "[") depth++;
    const inside = depth > 0;
    if ((c === ">" || c === "]") && depth > 0) depth--;
    return inside;
  });
};

const readPrevious = (file) => {
  if (!existsSync(file)) return null;
  const m = readFileSync(file, "utf8").match(/\/\* DATA \*\/([\s\S]*?)\/\* END \*\//);
  return m ? JSON.parse(m[1]) : null;
};

const voice = async (story, voiceName) => {
  const key = `${story}-${voiceName}`;
  const file = `${key}.mp3`;
  const takeFile = join(TAKES_DIR, `${key}.ts`);
  const voiceId = VOICES[voiceName];
  const SEED = seedOf(story);
  const sections = scriptFor(story);
  const text = sections.map((s) => s.text).join("\n\n");
  const hash = createHash("sha1")
    .update(JSON.stringify([text, voiceId, MODEL_ID, VOICE_SETTINGS, SEED]))
    .digest("hex")
    .slice(0, 12);

  const previous = readPrevious(takeFile);
  if (!FORCE && previous && previous.hash === hash && existsSync(join(OUT_DIR, file))) {
    console.log(`${key}: script unchanged; keeping the current take (pass --force to regenerate).`);
    return;
  }

  const res = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voiceId}/with-timestamps?output_format=mp3_44100_128`, {
    method: "POST",
    headers: { "xi-api-key": API_KEY, "Content-Type": "application/json" },
    body: JSON.stringify({ text, model_id: MODEL_ID, voice_settings: VOICE_SETTINGS, seed: SEED }),
  });
  if (!res.ok) throw new Error(`${key}: ElevenLabs ${res.status}: ${await res.text()}`);
  const json = await res.json();
  const a = json.alignment;

  // Words, skipping tag text, each tagged with the section it belongs to
  const mask = tagMask(a.characters);
  const words = [];
  let cur = null;
  let section = 0;
  a.characters.forEach((c, i) => {
    if (c === "\n" && a.characters[i - 1] === "\n") section++;
    if (c.trim() && !mask[i]) {
      if (!cur) cur = { w: "", s: a.character_start_times_seconds[i], e: 0, section };
      cur.w += c;
      cur.e = a.character_end_times_seconds[i];
    } else if (cur) {
      words.push(cur);
      cur = null;
    }
  });
  if (cur) words.push(cur);
  const said = words.filter((w) => /[a-z0-9]/i.test(w.w));
  // A "Tail" section is voiced only so the last real word isn't clipped; the
  // video stops the audio in the pause before it
  const tail = sections.findIndex((s) => s.label === "Tail");
  const spoken = said.filter((w) => w.section !== tail);
  const tailStart = said.find((w) => w.section === tail)?.s;
  const lastEnd = spoken[spoken.length - 1].e;
  const playUntil = tailStart === undefined ? undefined : Math.min(lastEnd + 0.6, (lastEnd + tailStart) / 2);

  mkdirSync(OUT_DIR, { recursive: true });
  writeFileSync(join(OUT_DIR, file), Buffer.from(json.audio_base64, "base64"));

  const take = {
    file,
    hash,
    speechStart: Number(spoken[0].s.toFixed(3)),
    speechEnd: Number(lastEnd.toFixed(3)),
    ...(playUntil === undefined ? {} : { playUntil: Number(playUntil.toFixed(3)) }),
    sections: sections.map((s) => s.label),
    words: spoken.map((w) => ({ w: w.w, s: Number(w.s.toFixed(3)), e: Number(w.e.toFixed(3)), section: w.section })),
  };
  mkdirSync(TAKES_DIR, { recursive: true });
  writeFileSync(
    takeFile,
    `// Generated by scripts/generate-voiceover.mjs from script.txt and stories/${story}.txt. Do not edit by hand.
import type { VoiceoverTake } from "../types";

export const TAKE: VoiceoverTake = /* DATA */ ${JSON.stringify(take, null, 2)} /* END */;
`,
  );

  console.log(`\n${key}: one take, ${(take.speechEnd - take.speechStart).toFixed(2)} s of speech:`);
  sections.forEach((s, i) => {
    const ws = take.words.filter((w) => w.section === i);
    if (ws.length) console.log(`  ${ws[0].s.toFixed(2).padStart(6)}–${ws[ws.length - 1].e.toFixed(2).padStart(6)}  ${s.label}`);
  });
};

/** Every take on disk, so the composition can pick one by story and voice */
const writeIndex = () => {
  const keys = readdirSync(TAKES_DIR)
    .filter((f) => f.endsWith(".ts") && f !== "index.ts")
    .map((f) => f.slice(0, -3))
    .sort();
  const id = (k) => k.replace(/-/g, "_");
  writeFileSync(
    join(TAKES_DIR, "index.ts"),
    `// Generated by scripts/generate-voiceover.mjs. Do not edit by hand.
import type { VoiceoverTake } from "../types";
${keys.map((k) => `import { TAKE as ${id(k)} } from "./${k}";`).join("\n")}

/** Every voiced take, by "<story>-<voice>" */
export const TAKES: Record<string, VoiceoverTake> = {
${keys.map((k) => `  "${k}": ${id(k)},`).join("\n")}
};
`,
  );
};

// ElevenLabs allows a few requests at once; one at a time keeps it simple
for (const story of stories) await voice(story, voiceArg ?? narratorOf(story));
writeIndex();
console.log(`\nTakes: src/OneAgentPerUser/voiceover/takes/, audio: public/${PUBLIC_DIR}/`);
