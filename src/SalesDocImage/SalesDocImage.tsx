import { staticFile } from "remotion";
import { Img } from "remotion";
import { AbsoluteFill } from "remotion";
import { HashBackground } from "../components/HashBackground";
import { loadFont } from "@remotion/google-fonts/RobotoMono";

const { fontFamily } = loadFont();

export const SalesDocImage: React.FC = () => {
    return (
        <AbsoluteFill>
            <HashBackground showBlur={true} />
            <AbsoluteFill
                style={{
                    justifyContent: "center",
                    alignItems: "center",
                    height: "100%",
                    display: "flex",
                    flexDirection: "column"
                }}
            >
                <AbsoluteFill
                    style={{
                        justifyContent: "center",
                        alignItems: "center",
                        height: "100%",
                        top: "45%",
                        transform: "translateY(-50%)",
                        display: "flex",
                        flexDirection: "row",
                        gap: "5rem"
                    }}
                >
                    <Img
                        src={staticFile('brand/sales_logo_trophy.png')}
                        style={{ width: 250 }}
                    />
                    <div
                        style={{
                            backgroundColor: "rgba(0, 0, 0, 0.03)",
                            borderRadius: '1rem',
                            width: "5px",
                            height: "100px",
                        }}
                    />
                    <Img
                        src={staticFile('brand/sales_logo_socialchamp.png')}
                        style={{ width: 250 }}
                    />
                </AbsoluteFill>
                <AbsoluteFill
                    style={{
                        justifyContent: "center",
                        alignItems: "center",
                        height: "100%",
                        top: "65%",
                        transform: "translateY(-50%)",
                    }}
                >
                    <p
                        style={{
                            fontSize: "1.5rem",
                            fontWeight: "bold",
                            fontFamily: fontFamily,
                            color: "rgba(0, 0, 0, 0.3)",
                            letterSpacing: "0.25rem"
                        }}
                    >
                        INTEGRATION PROPOSAL
                    </p>
                </AbsoluteFill>
            </AbsoluteFill>
        </AbsoluteFill>
    );
};