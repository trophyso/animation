/**
 * Trophy Daylight type: Funnel Display for headlines and figures, Funnel Sans
 * for reading, Spline Sans Mono for every time, place, id and probability.
 * loadFont blocks rendering until the font is ready.
 */
import { loadFont as loadDisplayFont } from "../fonts/FunnelDisplay";
import { loadFont as loadSansFont } from "../fonts/FunnelSans";
import { loadFont as loadMonoFont } from "../fonts/SplineSansMono";

export const { fontFamily: displayFont } = loadDisplayFont("normal", {
  weights: ["400", "500"],
  subsets: ["latin", "latin-ext"],
});
export const { fontFamily: sansFont } = loadSansFont("normal", {
  weights: ["400", "500", "600"],
  subsets: ["latin", "latin-ext"],
});
export const { fontFamily: monoFont } = loadMonoFont("normal", {
  weights: ["400", "500"],
  subsets: ["latin", "latin-ext"],
});
