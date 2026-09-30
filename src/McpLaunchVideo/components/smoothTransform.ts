import type React from "react";

/**
 * Chrome snaps text baselines to whole pixels under axis-aligned transforms, so
 * slow zooms and drifts shimmer as glyphs jump a pixel at different frames. An
 * imperceptible rotation takes text off that snapping path. will-change is
 * avoided on purpose: its cached raster differs between parallel render tabs.
 */
export const smoothTransform = (transform: string): React.CSSProperties => ({
  transform: `${transform} rotate(0.02deg)`,
});
