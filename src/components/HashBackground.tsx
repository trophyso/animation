import React from 'react';
import { AbsoluteFill } from 'remotion';

interface Props {
    showBlur?: boolean;
}

const BlurredOval: React.FC = () => {
    return (
        <div
            style={{
                position: 'absolute',
                bottom: "10%",
                right: "10%",
                transform: 'translate(50%, 50%)',
                width: '80%',
                height: '60%',
                backgroundColor: '#4CAF50',
                borderRadius: '50%',
                filter: 'blur(100px)',
                opacity: 0.3,
            }}
        />
    );
};

export const HashBackground: React.FC<Props> = ({ showBlur = false }) => {
    return (
        <AbsoluteFill
            style={{
                background: `
                    linear-gradient(to right, #eee 1px, transparent 1px),
                    linear-gradient(to bottom, #eee 1px, transparent 1px)
                `,
                backgroundSize: '250px 250px',
                backgroundColor: '#fff',
                alignItems: 'center',
                justifyContent: 'center',
            }}
        >
            {showBlur && <BlurredOval />}
        </AbsoluteFill>
    );
};