import { AbsoluteFill, Img, staticFile } from "remotion";
import { HashBackground } from "../components/HashBackground";
import { loadFont } from "@remotion/google-fonts/Montserrat";

const { fontFamily } = loadFont();

export const FeatureHighlight_Metrics: React.FC = () => {
    return (
        <AbsoluteFill>
            <HashBackground showBlur={true} />
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
                    width: "83%"
                }}
            >
                Powering gamification with user behavior tracking
            </AbsoluteFill>
        </AbsoluteFill>
    );
};