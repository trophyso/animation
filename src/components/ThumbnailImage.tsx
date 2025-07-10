import { staticFile } from "remotion";
import { Img } from "remotion";
import { AbsoluteFill } from "remotion";
import { HashBackground } from "./HashBackground";
import { fontFamily } from "@remotion/google-fonts/Montserrat";

interface Props {
    title: string;
    imageUrl: string;
}

export const ThumbnailImage: React.FC<Props> = ({ title, imageUrl }) => {
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
                {title}
            </AbsoluteFill>
            {imageUrl && (
                <AbsoluteFill
                    style={{
                        top: "40%",
                        left: "15%",
                        width: "65%",
                    }}
                >
                    <Img
                        src={staticFile(imageUrl)}
                        style={{
                            width: "100%",
                            borderRadius: "50px",
                            border: "7px solid rgba(0, 0, 0, 0.05)",
                            boxShadow: "0 0 10px 0 rgba(0, 0, 0, 0.3)"
                        }}
                    />
                </AbsoluteFill>
            )}
        </AbsoluteFill>
    );
};