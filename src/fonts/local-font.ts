import { cancelRender, continueRender, delayRender } from "remotion";

type LoadFontOptions = {
  weights?: readonly string[];
  subsets?: readonly string[];
};

/**
 * Drop-in replacement for `loadFont` from `@remotion/google-fonts`, for fonts
 * bundled locally with @fontsource. Each family module imports the font CSS;
 * this blocks rendering until the requested weights are ready.
 *
 * Renders never fetch fonts from the network, so they work offline and behind
 * proxies that Remotion's Chrome bypasses (it launches with --no-proxy-server).
 * Subsets are all bundled; the browser picks them by unicode-range.
 */
export const createLocalFont = (
  fontFamily: string,
  availableWeights: readonly string[],
) => {
  const pending = new Map<string, Promise<void>>();

  return (style = "normal", options: LoadFontOptions = {}) => {
    if (style !== "normal") {
      throw new Error(
        `${fontFamily}: only the normal style is bundled locally (asked for "${style}"). Import the italic CSS from @fontsource in src/fonts.`,
      );
    }
    const weights = options.weights ?? availableWeights;
    const key = weights.join(",");

    if (typeof document !== "undefined" && !pending.has(key)) {
      const handle = delayRender(`Loading font ${fontFamily} (${key})`);
      pending.set(
        key,
        Promise.all(
          weights.map((weight) =>
            document.fonts.load(`${weight} 16px "${fontFamily}"`),
          ),
        )
          .then(() => continueRender(handle))
          .catch((err) => cancelRender(err)),
      );
    }

    return {
      fontFamily,
      waitUntilDone: () => pending.get(key) ?? Promise.resolve(),
    };
  };
};
