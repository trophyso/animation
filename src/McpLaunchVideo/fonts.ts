import { loadFont as loadJakarta } from "@remotion/google-fonts/PlusJakartaSans";
import { loadFont as loadMono } from "@remotion/google-fonts/JetBrainsMono";
import { loadFont as loadSerif } from "@remotion/google-fonts/Lora";
import { loadFont as loadInter } from "@remotion/google-fonts/Inter";

export const { fontFamily: sansFont } = loadJakarta("normal", {
  weights: ["400", "500", "600", "700", "800"],
  subsets: ["latin"],
});

export const { fontFamily: monoFont } = loadMono("normal", {
  weights: ["400", "500", "600"],
  subsets: ["latin"],
});

export const { fontFamily: serifFont } = loadSerif("normal", {
  weights: ["400", "500", "600"],
  subsets: ["latin"],
});

/** Used inside the Pulse phone mockup so it reads as its own product. */
export const { fontFamily: appFont } = loadInter("normal", {
  weights: ["400", "500", "600", "700", "800"],
  subsets: ["latin"],
});
