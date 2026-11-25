import "@fontsource/jetbrains-mono/100.css";
import "@fontsource/jetbrains-mono/200.css";
import "@fontsource/jetbrains-mono/300.css";
import "@fontsource/jetbrains-mono/400.css";
import "@fontsource/jetbrains-mono/500.css";
import "@fontsource/jetbrains-mono/600.css";
import "@fontsource/jetbrains-mono/700.css";
import "@fontsource/jetbrains-mono/800.css";
import { createLocalFont } from "./local-font";

export const loadFont = createLocalFont("JetBrains Mono", [
  "100", "200", "300", "400", "500", "600", "700", "800",
]);
