import React from "react";
import { useCurrentFrame } from "remotion";
import { blurIn } from "../../daylight/motion";
import { f } from "../script";

/** One entrance for all on-screen copy: words fade up out of a light blur, one after another */
export const WORD_STAGGER = 0.09;
const WORD_DUR = 0.3;
const WORD_RISE = 10;

type Part = { t: string; accent: boolean };

/** Splits copy into words; text inside {braces} is marked as accent (it may span words) */
const parse = (text: string): Part[][] => {
  let inAccent = false;
  return text.split(" ").map((word) => {
    const parts: Part[] = [];
    let cur = "";
    for (const ch of word) {
      if (ch === "{" || ch === "}") {
        if (cur) parts.push({ t: cur, accent: inAccent });
        cur = "";
        inAccent = ch === "{";
      } else cur += ch;
    }
    if (cur) parts.push({ t: cur, accent: inAccent });
    return parts;
  });
};

/**
 * Writes `text` in word by word (the close's statement animation). `start` is
 * the scene frame the first word starts on; `index` continues the stagger from
 * an earlier line of the same sentence. Words stay inline, so the text wraps
 * and aligns like plain text. Text in {braces} is drawn in `accent`: the
 * variables an agent chose.
 */
export const Words: React.FC<{ text: string; start: number; index?: number; accent?: string }> = ({ text, start, index = 0, accent }) => {
  const frame = useCurrentFrame();
  const words = parse(text);
  return (
    <>
      {words.map((parts, i) => (
        <React.Fragment key={i}>
          <span style={{ display: "inline-block", ...blurIn(frame, start + f((index + i) * WORD_STAGGER), f(WORD_DUR), WORD_RISE) }}>
            {parts.map((p, k) => (
              <span key={k} style={p.accent && accent ? { color: accent } : undefined}>
                {p.t}
              </span>
            ))}
          </span>
          {i < words.length - 1 ? " " : null}
        </React.Fragment>
      ))}
    </>
  );
};

/** How many words `lines` hold, for continuing a stagger onto the next line */
export const wordCount = (lines: readonly string[]): number => lines.reduce((n, l) => n + l.split(" ").length, 0);
