import { staticFile } from "remotion";
import { Img } from "remotion";
import { AbsoluteFill, useVideoConfig } from "remotion";
import { FlickeringGrid } from "./FlickeringGrid";
import { loadFont } from "@remotion/google-fonts/PlusJakartaSans";
import { HeroHomepageComposition, type HeroCompositionConfig } from "./widgets/HeroHomepageComposition";

const { fontFamily } = loadFont();

const defaultWidgetComposition: HeroCompositionConfig = {
    streak: { label: "day streak" },
    level: { rankTitle: "Intermediate" },
    achievement: {
        name: "Power user",
        description: "5,000 pts",
        icon: "rocket",
        color: "#4cc74a",
    },
    achievement2: {
        name: "30 day streak",
        description: "Awesome work",
        icon: "flame",
        color: "#ff7a00",
    },
};

interface Props {
    title: string;
    imageUrl?: string;
    /** When false, no frame (border / shadow / rounded corners) on the right-side image. */
    imageBorder?: boolean;
}

export const ThumbnailImage: React.FC<Props> = ({
    title,
    imageUrl,
    imageBorder = true,
}) => {
    const { width, height } = useVideoConfig();

    return (
        <AbsoluteFill style={{ backgroundColor: "#fff" }}>
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
                maxOpacity={0.15}
                flickerChance={0}
                width={width}
                height={height}
            />
            <AbsoluteFill
                style={{
                    justifyContent: "start",
                    top: "10%",
                    left: "7%"
                }}
            >
                <Img
                    src={staticFile('brand/logo_light.svg')}
                    style={{ width: 275 }}
                />
            </AbsoluteFill>
            <AbsoluteFill
                style={{
                    fontSize: '80px',
                    fontWeight: 'bold',
                    color: 'black',
                    fontFamily: fontFamily,
                    top: "25%",
                    left: "7%",
                    width: "44%",
                }}
            >
                {title}
            </AbsoluteFill>
            <div
                style={{
                    position: "absolute",
                    left: "54%",
                    top: "5%",
                    width: "42%",
                    height: "90%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                }}
            >
                {imageUrl ? (
                    <Img
                        src={staticFile(imageUrl)}
                        style={{
                            maxWidth: "100%",
                            maxHeight: "100%",
                            ...(imageBorder
                                ? {
                                    borderRadius: "50px",
                                    border: "7px solid rgba(0, 0, 0, 0.05)",
                                    boxShadow:
                                        "0 0 10px 0 rgba(0, 0, 0, 0.3)",
                                }
                                : {}),
                        }}
                    />
                ) : (
                    <HeroHomepageComposition
                        composition={defaultWidgetComposition}
                        style={{
                            width: "100%",
                            height: "100%",
                            maxWidth: "100%",
                            minHeight: "unset",
                            transform: "scale(1.75)",
                            translate: "20% -5%",
                        }}
                    />
                )}
            </div>
        </AbsoluteFill>
    );
};