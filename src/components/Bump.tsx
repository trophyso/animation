import { AbsoluteFill, spring, useCurrentFrame, useVideoConfig } from "remotion";

export interface Props {
    children: React.ReactNode;
    direction: 'up' | 'down' | 'left' | 'right';
    delay?: number;
    distance?: number;
    offset?: number;
    damping?: number;
    mass?: number;
    stiffness?: number;
}

export const Bump: React.FC<Props> = ({
    children,
    direction,
    delay = 0,
    distance = 100,
    offset = 0,
    damping = 10,
    mass = 0.5,
    stiffness = 100
}) => {
    const currentFrame = useCurrentFrame();
    const { fps } = useVideoConfig();

    const translate = spring({
        frame: currentFrame - delay,
        fps,
        config: {
            damping,
            mass,
            stiffness,
        },
        from: offset,
        to: offset - distance,
    });

    return (
        <AbsoluteFill
            style={{
                transform: direction === 'up' ? `translateY(${translate}px)` : direction === 'down' ? `translateY(-${translate}px)` : direction === 'left' ? `translateX(${translate}px)` : `translateX(-${translate}px)`,
            }}
        >
            {children}
        </AbsoluteFill>
    )
}