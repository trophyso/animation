import React from 'react';
import { AbsoluteFill } from 'remotion';

export const DarkBackground: React.FC = () => {
    return (
        <AbsoluteFill
            style={{
                backgroundColor: '#000',
                alignItems: 'center',
                justifyContent: 'center',
            }}
        />
    );
};