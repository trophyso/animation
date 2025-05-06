import { AbsoluteFill, Easing, interpolate, useCurrentFrame } from "remotion";

export interface Props {
    children: React.ReactNode;
    direction: 'up' | 'down' | 'left' | 'right';
    duration?: number;
    delay?: number;
    distance?: number;
}

export const Bump: React.FC<Props> = ({
    children,
    direction,
    duration = 15,
    delay = 0,
    distance = 100
}) => {
    const currentFrame = useCurrentFrame();
    const translate = interpolate(
        currentFrame - delay,
        [0, duration],
        [0, distance],
        {
            extrapolateLeft: 'clamp',
            extrapolateRight: 'clamp',
            easing: Easing.bezier(0.25, 0.1, 0.25, 1.0),
        }
    );

    return (
        <AbsoluteFill
            style={{
                transform: direction === 'up' ? `translateY(-${translate}px)` : direction === 'down' ? `translateY(${translate}px)` : direction === 'left' ? `translateX(-${translate}px)` : `translateX(${translate}px)`,
            }}
        >
            {children}
        </AbsoluteFill>
    )
}