import { AbsoluteFill, useCurrentFrame } from "remotion"
import { Text } from "./Text"
import { Theme } from "./types/theme";

interface Props {
    text: string;
    theme?: Theme;
}

export const Typing: React.FC<Props> = ({ text, theme = 'light' }) => {
    const currentFrame = useCurrentFrame();
    const currentText = text.slice(0, Math.floor(currentFrame / 2));

    return (
        <AbsoluteFill>
            <Text text={currentText} theme={theme} />
        </AbsoluteFill>
    )
}