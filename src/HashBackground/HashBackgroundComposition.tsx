import { AbsoluteFill } from "remotion";
import { HashBackground as HashBackgroundComponent } from "../components/HashBackground";

export const HashBackground: React.FC = () => {
    return (
        <AbsoluteFill>
            <HashBackgroundComponent />
        </AbsoluteFill>
    );
};