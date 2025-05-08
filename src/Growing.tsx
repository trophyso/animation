import React from 'react';
import { AbsoluteFill, interpolate, useCurrentFrame } from 'remotion';

export const Growing: React.FC<{
    children: React.ReactNode;
}> = ({ children }) => {

    const frame = useCurrentFrame();
    return (
        <AbsoluteFill
            style={{
                scale: String(
                    interpolate(frame, [0, 60], [0.5, 1.5], {
                        extrapolateLeft: 'clamp',
                        extrapolateRight: 'clamp',
                    }),
                ),
            }}
        >
            {children}
        </AbsoluteFill>
    );
};