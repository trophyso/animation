import { AbsoluteFill, spring, useCurrentFrame, useVideoConfig } from "remotion";

interface Props {
    children: React.ReactNode;
    duration?: number;
    delay?: number;
    min?: number;
}

export const FadeOut: React.FC<Props> = ({
    children,
    duration = 30,
    delay = 0,
    min = 0
}) => {
    const currentFrame = useCurrentFrame();
    const { fps } = useVideoConfig();

    const opacity = spring({
        frame: currentFrame - delay,
        fps,
        from: 1,
        to: min,
        durationInFrames: duration,
        config: {
            damping: 12,
            mass: 0.5,
            stiffness: 100,
        }
    });

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