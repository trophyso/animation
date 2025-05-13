import React from 'react';
import { AbsoluteFill } from 'remotion';

// const BlurredOval: React.FC = () => {
//     return (
//         <div
//             style={{
//                 position: 'absolute',
//                 top: '50%',
//                 left: '50%',
//                 transform: 'translate(-50%, -50%)',
//                 width: '80%',
//                 height: '60%',
//                 backgroundColor: '#4CAF50',
//                 borderRadius: '50%',
//                 filter: 'blur(100px)',
//                 opacity: 0.3,
//             }}
//         />
//     );
// };

export const HashBackground: React.FC = () => {
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
        />
    );
};