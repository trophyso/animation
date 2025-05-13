import React from 'react';
import { AbsoluteFill } from 'remotion';

export const DarkBackground: React.FC = () => {
    return (
        <AbsoluteFill
            style={{
                backgroundColor: '#1E1E1E',
                alignItems: 'center',
                justifyContent: 'center',
            }}
        />
    );
};