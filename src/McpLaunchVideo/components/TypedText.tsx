import React from "react";
import { random, useCurrentFrame } from "remotion";

const PUNCTUATION_PAUSE_FRAMES: Record<string, number> = {
  ",": 9,
  ";": 12,
  ":": 14,
  ".": 20,
  "?": 20,
  "!": 20,
};
const HESITATION_CHANCE = 0.08;

const scheduleCache = new Map<string, number[]>();

/**
 * Frame offset (from typing start) at which each character appears.
 * Keystrokes vary in speed, and there are pauses after punctuation and occasional
 * hesitations before a word, like a person thinking while they type.
 * `charsPerFrame` is the average speed within a burst of typing.
 */
const getTypingSchedule = (text: string, charsPerFrame: number) => {
  const key = `${charsPerFrame}:${text}`;
  const cached = scheduleCache.get(key);
  if (cached) {
    return cached;
  }

  const base = 1 / charsPerFrame;
  const times: number[] = [];
  let t = 0;
  for (let i = 0; i < text.length; i++) {
    t += base * (0.55 + random(`${text}-key-${i}`) * 0.9);
    const previous = text[i - 1];
    if (previous !== undefined && previous in PUNCTUATION_PAUSE_FRAMES && text[i] === " ") {
      t += PUNCTUATION_PAUSE_FRAMES[previous] * (0.8 + random(`${text}-punct-${i}`) * 0.5);
    } else if (previous === " ") {
      t += random(`${text}-word-${i}`) * 3;
      if (random(`${text}-hesitate-${i}`) < HESITATION_CHANCE) {
        t += 10 + random(`${text}-hesitate-length-${i}`) * 14;
      }
    }
    times.push(t);
  }

  scheduleCache.set(key, times);
  return times;
};

export const getTypingEndFrame = (
  text: string,
  startFrame: number,
  charsPerFrame: number,
) => {
  const times = getTypingSchedule(text, charsPerFrame);
  return startFrame + Math.ceil(times[times.length - 1] ?? 0);
};

export const TypedText: React.FC<{
  text: string;
  startFrame?: number;
  charsPerFrame?: number;
  showCaret?: boolean;
  caretColor?: string;
  /** Frame after which the caret is hidden entirely (e.g. once the message is sent). */
  hideCaretAfter?: number;
  style?: React.CSSProperties;
}> = ({
  text,
  startFrame = 0,
  charsPerFrame = 1.5,
  showCaret = true,
  caretColor = "currentColor",
  hideCaretAfter,
  style,
}) => {
  const frame = useCurrentFrame();
  const times = getTypingSchedule(text, charsPerFrame);
  const elapsed = frame - startFrame;
  let visibleChars = 0;
  while (visibleChars < times.length && times[visibleChars] <= elapsed) {
    visibleChars++;
  }

  const recentlyTyped =
    visibleChars > 0 && elapsed - times[visibleChars - 1] < 12;
  const blinkOn = Math.floor(frame / 16) % 2 === 0;
  const caretVisible =
    showCaret &&
    (hideCaretAfter === undefined || frame < hideCaretAfter) &&
    (recentlyTyped || blinkOn);

  return (
    <span style={{ whiteSpace: "pre-wrap", ...style }}>
      {text.slice(0, visibleChars)}
      {showCaret ? (
        <span
          style={{
            display: "inline-block",
            width: "0.08em",
            minWidth: 2,
            height: "1.05em",
            marginLeft: 2,
            verticalAlign: "text-bottom",
            backgroundColor: caretColor,
            opacity: caretVisible ? 1 : 0,
          }}
        />
      ) : null}
    </span>
  );
};
