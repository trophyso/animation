// This is your entry file! Refer to it when you render:
// npx remotion render <entry-file> HelloWorld out/video.mp4

// Must come before ./Root. Evaluating remotion/no-react resets Remotion's list
// of pending delayRender() handles but not their timers. @remotion/transitions
// imports it, so before this line it ran partway through Root's imports and
// orphaned the handles that fonts loaded earlier (Montserrat, Roboto…) take in
// src/fonts. Their continueRender() then found nothing to clear, and every
// render longer than ~28s failed with "Loading font … not cleared".
import "remotion/no-react";
import { registerRoot } from "remotion";
import { RemotionRoot } from "./Root";

registerRoot(RemotionRoot);
