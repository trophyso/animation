import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";

interface Props {
    children: React.ReactNode;
    duration?: number;
    delay?: number;
    min?: number;
}

export const FadeOut: React.FC<Props> = ({
    children,
    duration = 15,
    delay = 0,
    min = 0
}) => {
    const currentFrame = useCurrentFrame();
    const opacity = interpolate(
        currentFrame - delay,
        [0, duration],
        [1, min],
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