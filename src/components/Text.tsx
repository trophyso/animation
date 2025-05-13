import { loadFont } from '@remotion/google-fonts/Montserrat';
import { AbsoluteFill } from 'remotion';
import { Theme } from '../types/theme';

interface Props {
    text: string;
    theme?: Theme;
}

const { fontFamily } = loadFont();

export const Text: React.FC<Props> = ({ text, theme = 'light' }) => {
    return (
        <AbsoluteFill
            style={{
                fontSize: '60px',
                fontWeight: 'bold',
                color: theme === 'light'
                    ? '#333'
                    : theme === 'dark'
                        ? '#fff'
                        : '#4CC74A',
                fontFamily: fontFamily,
                justifyContent: 'center',
                alignItems: 'center',
            }}
        >
            {text}
        </AbsoluteFill>
    );
};