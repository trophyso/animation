import "@fontsource/inter/100.css";
import "@fontsource/inter/200.css";
import "@fontsource/inter/300.css";
import "@fontsource/inter/400.css";
import "@fontsource/inter/500.css";
import "@fontsource/inter/600.css";
import "@fontsource/inter/700.css";
import "@fontsource/inter/800.css";
import "@fontsource/inter/900.css";
import { createLocalFont } from "./local-font";

export const loadFont = createLocalFont("Inter", [
  "100", "200", "300", "400", "500", "600", "700", "800", "900",
]);
