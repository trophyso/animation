import { AbsoluteFill, spring, useCurrentFrame } from "remotion";

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
    const opacity = spring({
        frame: currentFrame - delay,
        fps: 30,
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