import { useLayoutEffect, useRef, useState } from "react";
import { AbsoluteFill, continueRender, delayRender, random } from "remotion";
import { loadFont as loadDisplayFont } from "../fonts/FunnelDisplay";
import { loadFont as loadMonoFont } from "../fonts/SplineSansMono";
import {
    GRAIN,
    OG_INK,
    SKIES,
    SKY_BACKGROUND,
    type Sky,
    THUMBNAIL_SIZE,
} from "../og/constants";
import { OgLogo } from "../og/OgLogo";
import { PEOPLE, type PersonKey } from "../og/people";
import { personDots } from "../og/person-dots";

const display = loadDisplayFont("normal", {
    weights: ["400"],
    subsets: ["latin", "latin-ext"],
});
const mono = loadMonoFont("normal", {
    weights: ["400"],
    subsets: ["latin", "latin-ext"],
});

const CAST = Object.keys(PEOPLE) as PersonKey[];

/**
 * The web OG layout (1200 × 630) scaled by 4/3 onto the 16:10 canvas, with the
 * logo and footer pulled in so a 2:1 social crop (100px off top and bottom)
 * keeps them.
 */
const S = THUMBNAIL_SIZE.width / 1200;
const EDGE = Math.round(64 * S);
const LOGO_TOP = 136;
const FOOTER_BOTTOM = 128;

/** The person, a little taller than a straight 4/3 scale so it fills the taller canvas */
const PERSON_HEIGHT = 760;
const PERSON_WIDTH = Math.round((PERSON_HEIGHT * 120) / 140);

/** Title sizing: the largest size from MAX down to MIN that fits in MAX_LINES */
const TITLE_MAX = 80;
const TITLE_MIN = 56;
const TITLE_STEP = 2;
const MAX_LINES = 4;
const LINE_HEIGHT = 64 / 60;
/** Up to the person's head */
const TITLE_WIDTH = Math.round(780 * S);

const lineHeightAt = (size: number) => Math.round(size * LINE_HEIGHT);

/** Keep absurdly long copy from slowing the layout; the clamp does the rest */
const clip = (text: string, max: number) =>
    text.length > max ? `${text.slice(0, max).trimEnd()}…` : text;

/**
 * Where things sit. The default is the blog card (16:10, logo and footer
 * pulled in for a 2:1 social crop); "youtube" is 16:9, viewed small, so the
 * title is bigger and the margins hug the frame.
 */
type Layout = "blog" | "youtube";
const LAYOUTS: Record<Layout, { logoTop: number; footerBottom: number; titleMax: number; titleMin: number; maxLines: number; titleWidth: number }> = {
    blog: { logoTop: LOGO_TOP, footerBottom: FOOTER_BOTTOM, titleMax: TITLE_MAX, titleMin: TITLE_MIN, maxLines: MAX_LINES, titleWidth: TITLE_WIDTH },
    // Narrower, so a long title wraps instead of running into the head
    youtube: { logoTop: 84, footerBottom: 80, titleMax: 112, titleMin: 76, maxLines: 3, titleWidth: 940 },
};

interface Props {
    title: string;
    layout?: Layout;
    /** Pin the sky; otherwise picked from the title, so a title always gets the same one */
    sky?: Sky;
    /** Pin the person; otherwise picked from the title */
    person?: PersonKey;
}

/**
 * The web repo's Open Graph image design (src/app/og/route.tsx, Trophy
 * Daylight's homepage OG) as a blog feature image: the title on a sky, with
 * one person from the cast drawn as a dots portrait. The web route picks the
 * sky from the current hour and the person at random; here both are seeded by
 * the title so re-running the generator gives the same image.
 */
export const ThumbnailImage: React.FC<Props> = ({ title, sky, person, layout = "blog" }) => {
    const L = LAYOUTS[layout];
    const text = clip(title.trim(), 200);
    const skyName =
        sky ?? SKIES[Math.floor(random(`sky:${text}`) * SKIES.length)];
    const who =
        person ?? CAST[Math.floor(random(`person:${text}`) * CAST.length)];
    const ink = skyName === "night" ? OG_INK.night : OG_INK.day;
    const dots = personDots(who);

    const measureRef = useRef<HTMLDivElement>(null);
    const [fontSize, setFontSize] = useState<number | null>(null);
    const [handle] = useState(() => delayRender("Fitting the title"));

    useLayoutEffect(() => {
        let cancelled = false;
        Promise.all([display.waitUntilDone(), mono.waitUntilDone()])
            .then(() => document.fonts.ready)
            .then(() => {
                if (cancelled) return;
                const el = measureRef.current;
                let fit = L.titleMin;
                if (el) {
                    for (let size = L.titleMax; size >= L.titleMin; size -= TITLE_STEP) {
                        el.style.fontSize = `${size}px`;
                        el.style.lineHeight = `${lineHeightAt(size)}px`;
                        if (el.scrollHeight <= lineHeightAt(size) * L.maxLines + 1) {
                            fit = size;
                            break;
                        }
                    }
                }
                setFontSize(fit);
                continueRender(handle);
            });
        return () => {
            cancelled = true;
        };
    }, [handle, text, L]);

    const titleStyle: React.CSSProperties = {
        fontFamily: display.fontFamily,
        fontWeight: 400,
        letterSpacing: "-0.045em",
        width: L.titleWidth,
        overflowWrap: "break-word",
    };
    const size = fontSize ?? L.titleMax;

    return (
        <AbsoluteFill
            style={{
                overflow: "hidden",
                color: ink.text,
                ...SKY_BACKGROUND[skyName],
            }}
        >
            {/* Grain, as .dl-grain::after */}
            <AbsoluteFill
                style={{
                    opacity: GRAIN.opacity,
                    mixBlendMode: "overlay",
                    backgroundImage: GRAIN.backgroundImage,
                }}
            />

            {/* Off-screen copy of the title, measured to pick its size */}
            <div
                ref={measureRef}
                aria-hidden
                style={{
                    ...titleStyle,
                    position: "absolute",
                    left: -10000,
                    top: 0,
                    visibility: "hidden",
                }}
            >
                {text}
            </div>

            {/* The person: right of the sky, rising from the bottom, facing left */}
            <svg
                width={PERSON_WIDTH}
                height={PERSON_HEIGHT}
                viewBox="0 0 120 140"
                style={{ position: "absolute", right: Math.round(-14 * S), bottom: 0 }}
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

            <div
                style={{
                    display: "flex",
                    position: "absolute",
                    left: EDGE,
                    top: L.logoTop,
                }}
            >
                <OgLogo width={Math.round(146 * S)} color={ink.text} />
            </div>

            <div
                style={{
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    position: "absolute",
                    left: EDGE,
                    top: L.logoTop + 90,
                    bottom: L.footerBottom + 90,
                }}
            >
                <div
                    style={{
                        ...titleStyle,
                        display: "-webkit-box",
                        WebkitBoxOrient: "vertical",
                        WebkitLineClamp: L.maxLines,
                        overflow: "hidden",
                        fontSize: size,
                        lineHeight: `${lineHeightAt(size)}px`,
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
                    left: EDGE,
                    bottom: L.footerBottom,
                    fontFamily: mono.fontFamily,
                    fontWeight: 400,
                    fontSize: Math.round(22 * S),
                    lineHeight: `${Math.round(28 * S)}px`,
                    letterSpacing: "0.01em",
                    color: ink.muted,
                }}
            >
                trophy.so
            </div>
        </AbsoluteFill>
    );
};
