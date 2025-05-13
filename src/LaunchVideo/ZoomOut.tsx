import { AbsoluteFill, spring, useCurrentFrame, useVideoConfig } from "remotion";

interface Props {
    children: React.ReactNode;
    duration?: number;
    delay?: number;
    startScale?: number;
    endScale?: number;
}

export const ZoomOut: React.FC<Props> = ({
    children,
    duration = 60,
    delay = 0,
    startScale = 2,
    endScale = 1
}) => {
    const currentFrame = useCurrentFrame();
    const { fps } = useVideoConfig();

    const scale = spring({
        frame: currentFrame - delay,
        fps,
        from: startScale,
        to: endScale,
        durationInFrames: duration,
        config: {
            damping: 100,
            mass: 0.5,
            stiffness: 100,
        }
    });

    return (
        <AbsoluteFill
            style={{
                transform: `scale(${scale})`,
                transformOrigin: 'center center',
            }}
        >
            {children}
        </AbsoluteFill>
    );
}; 