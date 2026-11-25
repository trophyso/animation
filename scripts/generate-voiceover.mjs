#!/usr/bin/env node
/**
 * Voices src/OneAgentPerUser/voiceover/script.txt as ONE ElevenLabs take, so
 * the tone and pace stay consistent from start to finish. The
 * with-timestamps endpoint returns when every word is spoken; the composition
 * uses those word timings to hold its animation until the voice catches up
 * (see SYNC in src/OneAgentPerUser/script.ts).
 *
 * Writes:
 *   public/OneAgentPerUser/voiceover/voiceover.mp3
 *   src/OneAgentPerUser/voiceover/timings.ts   (read by the composition)
 *
 * Env (shell or .env): ELEVENLABS_API_KEY (required), ELEVENLABS_VOICE_ID,
 * ELEVENLABS_MODEL_ID, ELEVENLABS_SEED (default 7; a different seed gives a different take). Pass --force to regenerate an unchanged script.
 */
import { createHash } from "node:crypto";
import { existsSync, mkdirSync, readFileSync, readdirSync, rmSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const SCRIPT = join(ROOT, "src/OneAgentPerUser/voiceover/script.txt");
const TIMINGS = join(ROOT, "src/OneAgentPerUser/voiceover/timings.ts");
const PUBLIC_DIR = "OneAgentPerUser/voiceover";
const OUT_DIR = join(ROOT, "public", PUBLIC_DIR);
const FILE = "voiceover.mp3";

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
 * "Lucy - Fresh & Casual": young, energetic British woman from the ElevenLabs
 * voice library. Other casual British voices tried: Verity oW8bn5YtBB89X2nJ0DT9,
 * Cass WbwwsO6cCyUItWWlHOKN, Charlotte 6fZce9LFNG3iEITDfqZZ; earlier takes used
 * Alice Xb7hH8MSUJpSbSDYk0k2 and Liam TX3LPaxmHKxFdv7VOQHJ.
 */
const VOICE_ID = process.env.ELEVENLABS_VOICE_ID || "lcMyyd2HUfFzxdCaC4Ta";
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
const SEED = Number(process.env.ELEVENLABS_SEED || 7);
const FORCE = process.argv.includes("--force");

if (!API_KEY) {
  console.error("Missing ELEVENLABS_API_KEY. Add it to .env (gitignored) or export it, then rerun.");
  process.exit(1);
}

/** Sections start with "@ Label"; each becomes a paragraph of the one take */
const parseScript = (src) => {
  const sections = [];
  for (const raw of src.split("\n")) {
    const line = raw.trim();
    if (!line || line.startsWith("#")) continue;
    const head = line.match(/^@\s*(.*)$/);
    if (head) sections.push({ label: head[1] || `Section ${sections.length + 1}`, text: "" });
    else if (sections.length) {
      const s = sections[sections.length - 1];
      s.text = s.text ? `${s.text} ${line}` : line;
    } else throw new Error(`Text before the first "@ Label" line: "${line}"`);
  }
  return sections.filter((s) => s.text);
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

const readPrevious = () => {
  if (!existsSync(TIMINGS)) return null;
  const m = readFileSync(TIMINGS, "utf8").match(/\/\* DATA \*\/([\s\S]*?)\/\* END \*\//);
  return m ? JSON.parse(m[1]) : null;
};

const sections = parseScript(readFileSync(SCRIPT, "utf8"));
const text = sections.map((s) => s.text).join("\n\n");
const hash = createHash("sha1")
  .update(JSON.stringify([text, VOICE_ID, MODEL_ID, VOICE_SETTINGS, SEED]))
  .digest("hex")
  .slice(0, 12);

const previous = readPrevious();
if (!FORCE && previous && previous.hash === hash && existsSync(join(OUT_DIR, FILE))) {
  console.log("Script unchanged; keeping the current take (pass --force to regenerate).");
  process.exit(0);
}

const res = await fetch(
  `https://api.elevenlabs.io/v1/text-to-speech/${VOICE_ID}/with-timestamps?output_format=mp3_44100_128`,
  {
    method: "POST",
    headers: { "xi-api-key": API_KEY, "Content-Type": "application/json" },
    body: JSON.stringify({ text, model_id: MODEL_ID, voice_settings: VOICE_SETTINGS, seed: SEED }),
  },
);
if (!res.ok) throw new Error(`ElevenLabs ${res.status}: ${await res.text()}`);
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
const spoken = words.filter((w) => /[a-z0-9]/i.test(w.w));

mkdirSync(OUT_DIR, { recursive: true });
for (const old of readdirSync(OUT_DIR)) if (old.endsWith(".mp3") && old !== FILE) rmSync(join(OUT_DIR, old));
writeFileSync(join(OUT_DIR, FILE), Buffer.from(json.audio_base64, "base64"));

const take = {
  file: FILE,
  hash,
  speechStart: Number(spoken[0].s.toFixed(3)),
  speechEnd: Number(spoken[spoken.length - 1].e.toFixed(3)),
  sections: sections.map((s) => s.label),
  words: spoken.map((w) => ({ w: w.w, s: Number(w.s.toFixed(3)), e: Number(w.e.toFixed(3)), section: w.section })),
};

writeFileSync(
  TIMINGS,
  `// Generated by scripts/generate-voiceover.mjs from script.txt. Do not edit by hand.
export type VoiceoverTake = {
  /** Under public/${PUBLIC_DIR}/ */
  file: string;
  hash: string;
  /** Where speech starts and ends in the file, seconds */
  speechStart: number;
  speechEnd: number;
  /** Section labels from script.txt, in order */
  sections: string[];
  /** Every spoken word: start and end in the file (seconds) and its section index */
  words: { w: string; s: number; e: number; section: number }[];
};

export const VOICEOVER_DIR = "${PUBLIC_DIR}";

export const VOICEOVER: VoiceoverTake | null = /* DATA */ ${JSON.stringify(take, null, 2)} /* END */;
`,
);

console.log(`\nOne take, ${(take.speechEnd - take.speechStart).toFixed(2)} s of speech:`);
sections.forEach((s, i) => {
  const ws = take.words.filter((w) => w.section === i);
  if (ws.length) console.log(`  ${ws[0].s.toFixed(2).padStart(6)}–${ws[ws.length - 1].e.toFixed(2).padStart(6)}  ${s.label}`);
});
console.log(`\nWrote public/${PUBLIC_DIR}/${FILE} and src/OneAgentPerUser/voiceover/timings.ts`);
