import React from 'react';
import {
    AbsoluteFill,
    interpolate,
    spring,
    useCurrentFrame,
    useVideoConfig,
} from 'remotion';

interface MoveProps {
    children: React.ReactElement<{ trailIndex?: number; badgeIndex?: number }>;
    delay?: number;
    index?: number;
    trailIndex?: number;
    badgeIndex?: number;
}

export const Move: React.FC<MoveProps> = ({
    children,
    delay = 0,
    index = 0,
    trailIndex,
    badgeIndex
}) => {
    const { fps } = useVideoConfig();
    const frame = useCurrentFrame();

    const down = spring({
        fps,
        frame: frame - delay,
        config: {
            damping: 200,
        },
        durationInFrames: 60,
    });

    // Calculate fixed distance for each badge
    const baseDistance = -400; // Base distance for the first badge
    const spacing = 200; // Fixed spacing between badges
    const y = interpolate(down, [0, 1], [0, baseDistance + (index * spacing)]);

    return (
        <AbsoluteFill
            style={{
                translate: `0 ${y}px`,
            }}
        >
            {React.cloneElement(children, { trailIndex, badgeIndex })}
        </AbsoluteFill>
    );
};