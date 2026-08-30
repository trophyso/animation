import { loadFont } from "@remotion/google-fonts/PlusJakartaSans";
import { AbsoluteFill, Img, Interactive, staticFile, useVideoConfig } from "remotion";
import { FlickeringGrid } from "../components/FlickeringGrid";
import { G2Rating } from "../components/G2Rating";

const { fontFamily } = loadFont("normal", {
  weights: ["600", "700"],
  subsets: ["latin"],
});

type BannerProps = {
  headline: string;
  rating: number;
};

export const Banner: React.FC<BannerProps> = ({ headline, rating }) => {
  const { width, height } = useVideoConfig();

  return (
    <AbsoluteFill style={{ backgroundColor: "#ffffff" }}>
      <FlickeringGrid
        className="absolute inset-0 z-0"
        style={{
          maskImage:
            "radial-gradient(900px circle at 80% 70%, white, transparent)",
          WebkitMaskImage:
            "radial-gradient(900px circle at 80% 70%, white, transparent)",
        }}
        squareSize={6}
        gridGap={10}
        color="#4CAF50"
        maxOpacity={0.25}
        flickerChance={0}
        width={width}
        height={height}
      />
      <Img
        name="Trophy logo"
        src={staticFile("brand/logo_light.svg")}
        style={{
          position: "absolute",
          top: 30,
          left: 30,
          width: 220,
        }}
      />
      <Interactive.Div
        name="Social proof"
        style={{
          position: "absolute",
          right: 30,
          bottom: 30,
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-end",
          gap: 16,
        }}
      >
        <Interactive.Div
          name="Headline"
          style={{
            fontFamily,
            fontSize: 32,
            fontWeight: 600,
            color: "#1a1a1a",
            letterSpacing: -0.4,
            lineHeight: 1.2,
          }}
        >
          {headline}
        </Interactive.Div>
        <Interactive.Div name="G2 rating">
          <G2Rating rating={rating} starSize={32} markSize={36} />
        </Interactive.Div>
      </Interactive.Div>
    </AbsoluteFill>
  );
};
