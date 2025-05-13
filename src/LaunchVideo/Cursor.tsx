import { MousePointer } from "lucide-react";
import { AbsoluteFill, spring, useCurrentFrame, useVideoConfig } from "remotion";

interface Props {
    duration?: number;
    delay?: number;
}

export const Cursor: React.FC<Props> = ({ duration = 90, delay = 0 }) => {
    const frame = useCurrentFrame();
    const { fps, width, height } = useVideoConfig();

    const translateX = spring({
        frame: frame - delay,
        fps,
        from: width / 2,
        to: 0,
        durationInFrames: duration,
        config: {
            damping: 12,
            mass: 0.5,
            stiffness: 100,
        },
    });

    const translateY = spring({
        frame: frame - delay,
        fps,
        from: height / 2,
        to: 0,
        durationInFrames: duration,
        config: {
            damping: 12,
            mass: 0.5,
            stiffness: 100,
        },
    });

    // First scale up as it moves in
    const initialScale = spring({
        frame: frame - delay,
        fps,
        from: 0.5,
        to: 1.5,
        durationInFrames: duration,
        config: {
            mass: 0.5,
            damping: 12,
            stiffness: 100,
        }
    });

    // Then create a click effect by scaling down and up
    const clickDownScale = spring({
        frame: frame - delay - duration * 0.5,
        fps,
        from: 1.5,
        to: 0.8,
        durationInFrames: duration * 0.50,
        config: {
            mass: 2,
            damping: 20,
            stiffness: 100,
        }
    });

    const clickUpScale = spring({
        frame: frame - delay - duration * 0.5 - duration * 0.25,
        fps,
        from: 0.5,
        to: 0.8,
        durationInFrames: duration * 0.25,
        config: {
            mass: 2,
            damping: 20,
            stiffness: 100,
        }
    });

    const finalScale = frame - delay < duration * 0.5
        ? initialScale
        : frame - delay < duration * 0.5 + duration * 0.25
            ? clickDownScale
            : clickUpScale;

    return (
        <AbsoluteFill
            style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                transform: `translate(${translateX}px, ${translateY}px) scale(${finalScale})`,
                transformOrigin: 'center center',
            }}
        >
            <MousePointer style={{ scale: finalScale, fill: "white" }} />
        </AbsoluteFill>
    );
};