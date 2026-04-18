import { staticFile } from "remotion";
import { Img } from "remotion";
import { AbsoluteFill } from "remotion";
import { HashBackground } from "./HashBackground";
import { fontFamily } from "@remotion/google-fonts/Montserrat";

interface Props {
    title: string;
    imageUrl: string;
    /** When false, no frame (border / shadow / rounded corners) on the right-side image. */
    imageBorder?: boolean;
}

export const ThumbnailImage: React.FC<Props> = ({
    title,
    imageUrl,
    imageBorder = true,
}) => {
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
                    width: imageUrl ? "44%" : "86%",
                }}
            >
                {title}
            </AbsoluteFill>
            {imageUrl && (
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
                </div>
            )}
        </AbsoluteFill>
    );
};