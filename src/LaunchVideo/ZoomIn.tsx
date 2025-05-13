import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";

interface Props {
    children: React.ReactNode;
    duration?: number;
    delay?: number;
    startScale?: number;
    endScale?: number;
}

export const ZoomIn: React.FC<Props> = ({
    children,
    duration = 60,
    delay = 0,
    startScale = 1,
    endScale = 2
}) => {
    const currentFrame = useCurrentFrame();

    const scale = interpolate(
        currentFrame - delay,
        [0, duration],
        [startScale, endScale],
        {
            extrapolateLeft: 'clamp',
            extrapolateRight: 'clamp',
        }
    );

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