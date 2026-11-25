import "@fontsource/funnel-sans/300.css";
import "@fontsource/funnel-sans/400.css";
import "@fontsource/funnel-sans/500.css";
import "@fontsource/funnel-sans/600.css";
import "@fontsource/funnel-sans/700.css";
import "@fontsource/funnel-sans/800.css";
import { createLocalFont } from "./local-font";

export const loadFont = createLocalFont("Funnel Sans", [
  "300", "400", "500", "600", "700", "800",
]);
