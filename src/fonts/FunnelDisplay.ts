import "@fontsource/funnel-display/300.css";
import "@fontsource/funnel-display/400.css";
import "@fontsource/funnel-display/500.css";
import "@fontsource/funnel-display/600.css";
import "@fontsource/funnel-display/700.css";
import "@fontsource/funnel-display/800.css";
import { createLocalFont } from "./local-font";

export const loadFont = createLocalFont("Funnel Display", [
  "300", "400", "500", "600", "700", "800",
]);
