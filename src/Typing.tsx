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
    const cursorOpacity = Math.sin(currentFrame * 0.2) > 0 ? 1 : 0;

    return (
        <AbsoluteFill>
            <AbsoluteFill
                style={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                }}
            >
                <Text text={currentText} theme={theme} />
            </AbsoluteFill>
            <AbsoluteFill
                style={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                }}
            >
                <div
                    style={{
                        width: '2px',
                        height: '60px',
                        backgroundColor: theme === 'light' ? '#333' : theme === 'dark' ? '#fff' : '#4CC74A',
                        opacity: cursorOpacity,
                        marginLeft: `${currentText.length * 34}px`,
                    }}
                />
            </AbsoluteFill>
        </AbsoluteFill>
    )
}