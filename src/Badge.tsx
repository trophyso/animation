import React from 'react';
import { AbsoluteFill, staticFile, Img } from 'remotion';

export const Badge: React.FC<{
    imagePath: string;
}> = ({ imagePath }) => {
    return (
        <AbsoluteFill
            style={{
                justifyContent: 'center',
                alignItems: 'center',
            }}
        >
            <Img
                src={staticFile(imagePath)}
                style={{
                    height: 48,
                    width: 48,
                    objectFit: 'contain',
                }}
            />
        </AbsoluteFill>
    );
};