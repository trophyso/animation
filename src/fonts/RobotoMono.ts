import "@fontsource/roboto-mono/100.css";
import "@fontsource/roboto-mono/200.css";
import "@fontsource/roboto-mono/300.css";
import "@fontsource/roboto-mono/400.css";
import "@fontsource/roboto-mono/500.css";
import "@fontsource/roboto-mono/600.css";
import "@fontsource/roboto-mono/700.css";
import { createLocalFont } from "./local-font";

export const loadFont = createLocalFont("Roboto Mono", [
  "100", "200", "300", "400", "500", "600", "700",
]);
