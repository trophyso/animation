import "@fontsource/lora/400.css";
import "@fontsource/lora/500.css";
import "@fontsource/lora/600.css";
import "@fontsource/lora/700.css";
import { createLocalFont } from "./local-font";

export const loadFont = createLocalFont("Lora", [
  "400", "500", "600", "700",
]);
