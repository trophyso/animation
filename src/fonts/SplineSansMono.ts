import "@fontsource/spline-sans-mono/300.css";
import "@fontsource/spline-sans-mono/400.css";
import "@fontsource/spline-sans-mono/500.css";
import "@fontsource/spline-sans-mono/600.css";
import "@fontsource/spline-sans-mono/700.css";
import { createLocalFont } from "./local-font";

export const loadFont = createLocalFont("Spline Sans Mono", [
  "300", "400", "500", "600", "700",
]);
