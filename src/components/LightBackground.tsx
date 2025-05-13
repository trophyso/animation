import React from 'react';
import { AbsoluteFill } from 'remotion';

export const LightBackground: React.FC = () => {
    return (
        <AbsoluteFill
            style={{
                backgroundColor: '#fff',
                alignItems: 'center',
                justifyContent: 'center',
            }}
        />
    );
};