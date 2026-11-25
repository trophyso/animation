import "@fontsource/roboto/100.css";
import "@fontsource/roboto/200.css";
import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/600.css";
import "@fontsource/roboto/700.css";
import "@fontsource/roboto/800.css";
import "@fontsource/roboto/900.css";
import { createLocalFont } from "./local-font";

export const loadFont = createLocalFont("Roboto", [
  "100", "200", "300", "400", "500", "600", "700", "800", "900",
]);
