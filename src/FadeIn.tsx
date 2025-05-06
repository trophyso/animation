import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";

interface Props {
    children: React.ReactNode;
    duration?: number;
    delay?: number;
}

export const FadeIn: React.FC<Props> = ({ children, duration = 15, delay = 0 }) => {
    const currentFrame = useCurrentFrame();
    const opacity = interpolate(
        currentFrame - delay,
        [0, duration],
        [0, 1],
        {
            extrapolateLeft: 'clamp',
            extrapolateRight: 'clamp',
        }
    );

    return (
        <AbsoluteFill
            style={{
                opacity,
            }}
        >
            {children}
        </AbsoluteFill>
    );
};