import React from 'react';
import { AbsoluteFill, spring, useCurrentFrame } from 'remotion';

const AMOUNT = 9;

interface ExplosionProps {
    children: React.ReactElement<{ trailIndex?: number }>;
}

export const Explosion: React.FC<ExplosionProps> = ({ children }) => {
    const frame = useCurrentFrame();

    // Calculate rotation progress
    const rotationProgress = spring({
        frame,
        fps: 30,
        config: {
            damping: 200,
        },
        durationInFrames: 60,
    });

    return (
        <AbsoluteFill>
            {new Array(AMOUNT).fill(true).map((_, i) => {
                // Calculate base angle for this trail
                const baseAngle = (i / AMOUNT) * (2 * Math.PI);

                // Calculate final rotation - all arms rotate at the same speed
                // Reduced to 0.5 * Math.PI (90 degrees) for a total of 180 degrees rotation
                const rotation = baseAngle + (rotationProgress * 0.5 * Math.PI);

                return (
                    <AbsoluteFill
                        key={i}
                        style={{
                            rotate: `${rotation}rad`,
                        }}
                    >
                        {React.cloneElement(children, { trailIndex: i })}
                    </AbsoluteFill>
                );
            })}
        </AbsoluteFill>
    );
};