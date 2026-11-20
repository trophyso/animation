import { AbsoluteFill, Img, random, staticFile } from "remotion";
import { loadFont as loadDisplayFont } from "@remotion/google-fonts/FunnelDisplay";
import { loadFont as loadMonoFont } from "@remotion/google-fonts/SplineSansMono";
import { OG_INK, OG_SIZE, SKIES, type Sky, skyAsset } from "../og/constants";
import { OgLogo } from "../og/OgLogo";
import { PEOPLE, type PersonKey } from "../og/people";
import { personDots } from "../og/person-dots";

const { fontFamily: displayFont } = loadDisplayFont("normal", {
    weights: ["400"],
    subsets: ["latin", "latin-ext"],
});
const { fontFamily: monoFont } = loadMonoFont("normal", {
    weights: ["400"],
    subsets: ["latin", "latin-ext"],
});

const CAST = Object.keys(PEOPLE) as PersonKey[];

/** Keep absurdly long copy from slowing the layout; the clamp does the rest */
const clip = (text: string, max: number) =>
    text.length > max ? `${text.slice(0, max).trimEnd()}…` : text;

interface Props {
    title: string;
    /** Pin the sky; otherwise picked from the title, so a title always gets the same one */
    sky?: Sky;
    /** Pin the person; otherwise picked from the title */
    person?: PersonKey;
}

/**
 * The web repo's Open Graph image (src/app/og/route.tsx, Trophy Daylight's
 * homepage OG), rendered as a still: the title on a sky, with one person from
 * the cast drawn as a dots portrait. The web route picks the sky from the
 * current hour and the person at random; here both are seeded by the title so
 * re-running the generator gives the same image.
 */
export const ThumbnailImage: React.FC<Props> = ({ title, sky, person }) => {
    const text = clip(title.trim(), 200);
    const skyName =
        sky ?? SKIES[Math.floor(random(`sky:${text}`) * SKIES.length)];
    const who =
        person ?? CAST[Math.floor(random(`person:${text}`) * CAST.length)];
    const ink = skyName === "night" ? OG_INK.night : OG_INK.day;
    const dots = personDots(who);

    return (
        <AbsoluteFill style={{ overflow: "hidden", color: ink.text }}>
            <Img
                src={staticFile(skyAsset(skyName))}
                width={OG_SIZE.width}
                height={OG_SIZE.height}
                style={{ position: "absolute", top: 0, left: 0 }}
            />

            {/* The person: right of the sky, rising from the bottom, facing left */}
            <svg
                width={446}
                height={520}
                viewBox="0 0 120 140"
                style={{ position: "absolute", right: -14, bottom: 0 }}
            >
                {dots.map((d, i) => (
                    <circle
                        key={i}
                        cx={d.x}
                        cy={d.y}
                        r={d.r}
                        fill={ink.text}
                        fillOpacity={d.o}
                    />
                ))}
                {/* The one point lit where the agent acted */}
                <circle cx={60} cy={122} r={9} fill={ink.glow} fillOpacity={0.12} />
                <circle cx={60} cy={122} r={5.5} fill={ink.glow} fillOpacity={0.3} />
                <circle cx={60} cy={122} r={3} fill={ink.glow} />
            </svg>

            <div style={{ display: "flex", position: "absolute", left: 64, top: 56 }}>
                <OgLogo width={146} color={ink.text} />
            </div>

            <div
                style={{
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    position: "absolute",
                    left: 64,
                    top: 120,
                    bottom: 120,
                    // Up to the person's head
                    width: 780,
                }}
            >
                <div
                    style={{
                        display: "-webkit-box",
                        WebkitBoxOrient: "vertical",
                        WebkitLineClamp: 3,
                        overflow: "hidden",
                        fontFamily: displayFont,
                        fontWeight: 400,
                        fontSize: 60,
                        lineHeight: "64px",
                        letterSpacing: "-0.045em",
                        color: ink.text,
                    }}
                >
                    {text}
                </div>
            </div>

            <div
                style={{
                    display: "flex",
                    position: "absolute",
                    left: 64,
                    bottom: 52,
                    fontFamily: monoFont,
                    fontWeight: 400,
                    fontSize: 22,
                    lineHeight: "28px",
                    letterSpacing: "0.01em",
                    color: ink.muted,
                }}
            >
                trophy.so
            </div>
        </AbsoluteFill>
    );
};
