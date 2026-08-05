import {
    AbsoluteFill,
    Img,
    interpolate,
    spring,
    staticFile,
    useCurrentFrame,
    useVideoConfig,
} from "remotion";
import { loadFont } from "@remotion/google-fonts/PlusJakartaSans";
import { FlickeringGrid } from "../components/FlickeringGrid";

const { fontFamily } = loadFont();

const TITLE_FONT_SIZE = 64;
const TITLE_LINE_HEIGHT = 1.15;
/** Approximate advance width for Plus Jakarta Sans Bold at 1px. */
const TITLE_CHAR_WIDTH_RATIO = 0.58;

const wrapTitle = (text: string, maxWidth: number, fontSize: number): string[] => {
    const normalized = text.replace(/\s+/g, " ").trim();
    if (!normalized) return [];

    const maxChars = Math.max(1, Math.floor(maxWidth / (fontSize * TITLE_CHAR_WIDTH_RATIO)));
    const words = normalized.split(" ");
    const lines: string[] = [];
    let current = "";

    for (const word of words) {
        const next = current ? `${current} ${word}` : word;
        if (next.length > maxChars && current) {
            lines.push(current);
            current = word;
        } else {
            current = next;
        }
    }

    if (current) lines.push(current);
    return lines;
};

type GenericFeatureLaunchProps = {
    imagePath?: string;
    title?: string;
};

export const GenericFeatureLaunch: React.FC<GenericFeatureLaunchProps> = ({
    imagePath = "assets/leaderboard_schedule_form.png",
    title = "Custom schedules for every leaderboard",
}) => {
    const { width, height, fps } = useVideoConfig();
    const frame = useCurrentFrame();

    const bumpDelay = Math.round(fps * 0.5);
    const titleDelay = Math.round(fps * 1);
    const lineStagger = Math.round(fps * 0.18);

    const bumpProgress = spring({
        frame: frame - bumpDelay,
        fps,
        from: 0,
        to: 1,
        config: {
            damping: 14,
            mass: 0.55,
            stiffness: 120,
        },
    });

    const topPadding = 250;
    const titleSidePadding = 80;
    const titleMaxWidth = (width - titleSidePadding * 2) * 0.72;
    const imageMaxWidth = width * 0.68;
    // Leave room to bump down from center without clipping the bottom.
    const imageMaxHeight = height * 0.62;
    const bumpDistance = 140;

    const lines = wrapTitle(title, titleMaxWidth, TITLE_FONT_SIZE);

    // Stay centered via translate(-50%, -50%), then shift down by bumpDistance.
    const bumpOffset = interpolate(bumpProgress, [0, 1], [0, bumpDistance]);
    const zoom = interpolate(bumpProgress, [0, 1], [1, 1.08]);

    return (
        <AbsoluteFill
            style={{
                backgroundColor: "#fff",
                transform: `scale(${zoom})`,
                transformOrigin: "center center",
            }}
        >
            <FlickeringGrid
                className="absolute inset-0 z-0"
                style={{
                    maskImage:
                        "radial-gradient(1200px circle at center, white, transparent)",
                    WebkitMaskImage:
                        "radial-gradient(1200px circle at center, white, transparent)",
                }}
                squareSize={10}
                gridGap={14}
                color="#4CAF50"
                maxOpacity={0.25}
                flickerChance={0}
                width={width}
                height={height}
            />
            <AbsoluteFill style={{ zIndex: 1 }}>
                <div
                    style={{
                        position: "absolute",
                        top: topPadding,
                        left: 0,
                        right: 0,
                        textAlign: "center",
                        fontFamily,
                        fontSize: TITLE_FONT_SIZE,
                        fontWeight: 700,
                        color: "#0f172a",
                        lineHeight: TITLE_LINE_HEIGHT,
                        letterSpacing: "-0.02em",
                        paddingLeft: titleSidePadding,
                        paddingRight: titleSidePadding,
                    }}
                >
                    {lines.map((line, index) => {
                        const progress = spring({
                            frame: frame - (titleDelay + index * lineStagger),
                            fps,
                            from: 0,
                            to: 1,
                            config: {
                                damping: 16,
                                mass: 0.5,
                                stiffness: 110,
                            },
                        });

                        return (
                            <div
                                key={`${index}-${line}`}
                                style={{
                                    opacity: progress,
                                    transform: `translateY(${(1 - progress) * 28}px)`,
                                }}
                            >
                                {line}
                            </div>
                        );
                    })}
                </div>

                {/* Liquid glass frame — centered at start, bumps down */}
                <div
                    style={{
                        position: "absolute",
                        top: "50%",
                        left: "50%",
                        transform: `translate(-50%, calc(-50% + ${bumpOffset}px))`,
                        width: imageMaxWidth,
                        maxHeight: imageMaxHeight,
                        borderRadius: 32,
                        padding: 12,
                        boxSizing: "border-box",
                        background:
                            "linear-gradient(155deg, rgba(255,255,255,0.92) 0%, rgba(255,255,255,0.4) 42%, rgba(255,255,255,0.65) 100%)",
                        boxShadow: [
                            "0 1px 0 rgba(255,255,255,0.95) inset",
                            "0 -1px 0 rgba(255,255,255,0.25) inset",
                            "0 2px 4px rgba(15, 23, 42, 0.03)",
                            "0 12px 28px -6px rgba(15, 23, 42, 0.1)",
                            "0 32px 64px -12px rgba(15, 23, 42, 0.14)",
                        ].join(", "),
                    }}
                >
                    <div
                        style={{
                            borderRadius: 20,
                            overflow: "hidden",
                            background: "#fff",
                            maxHeight: imageMaxHeight - 24,
                            boxShadow: "0 0 0 1px rgba(15, 23, 42, 0.06)",
                        }}
                    >
                        <Img
                            src={staticFile(imagePath)}
                            style={{
                                display: "block",
                                width: "100%",
                                height: "auto",
                                maxHeight: imageMaxHeight - 24,
                                objectFit: "contain",
                                borderRadius: 20,
                                // scale: 1.25,
                            }}
                        />
                    </div>
                </div>
            </AbsoluteFill>
        </AbsoluteFill>
    );
};
