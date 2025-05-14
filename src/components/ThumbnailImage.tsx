import { staticFile } from "remotion";
import { Img } from "remotion";
import { AbsoluteFill } from "remotion";
import { HashBackground } from "./HashBackground";
import { fontFamily } from "@remotion/google-fonts/Montserrat";

interface Props {
    title: string;
}

export const ThumbnailImage: React.FC<Props> = ({ title }) => {
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
        </AbsoluteFill>
    );
};