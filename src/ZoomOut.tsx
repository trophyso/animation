import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";

interface Props {
    children: React.ReactNode;
    duration?: number;
    delay?: number;
    startScale?: number;
    endScale?: number;
}

export const ZoomOut: React.FC<Props> = ({
    children,
    duration = 30,
    delay = 0,
    startScale = 2,
    endScale = 1
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