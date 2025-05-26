import { AbsoluteFill } from "remotion";
import { loadFont } from "@remotion/google-fonts/Montserrat";
import { Image, Trophy } from "lucide-react";
import { LightBackground } from "../components/LightBackground";

const { fontFamily } = loadFont();

const AchievementBadge = () => {
    const size = 80;
    const center = size / 2;
    const innerCircleRadius = 15;
    const outerCircleRadius = 35;
    const lines = 8; // Number of radiating lines
    const lineExtension = 25; // How far the lines extend beyond the outer circle

    return (
        <svg
            width={size}
            height={size}
            viewBox={`0 0 ${size} ${size}`}
        >
            <defs>
                <mask id="lineMask">
                    <rect width={size} height={size} fill="white" />
                    <circle
                        cx={center}
                        cy={center}
                        r={outerCircleRadius + lineExtension}
                        fill="url(#fadeGradient)"
                    />
                </mask>
                <radialGradient id="fadeGradient" cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
                    <stop offset="0%" stopColor="white" />
                    <stop offset={`${(outerCircleRadius / (outerCircleRadius + lineExtension)) * 100}%`} stopColor="white" />
                    <stop offset="100%" stopColor="black" />
                </radialGradient>
            </defs>

            {/* Outer circle */}
            <circle
                cx={center}
                cy={center}
                r={outerCircleRadius}
                fill="none"
                stroke="#ddd"
                strokeWidth="1.5"
            />
            {/* Inner circle */}
            <circle
                cx={center}
                cy={center}
                r={innerCircleRadius}
                fill="#4CC74A"
            />
            {/* Radiating lines */}
            <g mask="url(#lineMask)">
                {Array.from({ length: lines }).map((_, i) => {
                    const angle = (i * 360) / lines;
                    const radians = (angle * Math.PI) / 180;
                    const x1 = center + innerCircleRadius * Math.cos(radians);
                    const y1 = center + innerCircleRadius * Math.sin(radians);
                    const x2 = center + (outerCircleRadius + lineExtension) * Math.cos(radians);
                    const y2 = center + (outerCircleRadius + lineExtension) * Math.sin(radians);

                    return (
                        <line
                            key={i}
                            x1={x1}
                            y1={y1}
                            x2={x2}
                            y2={y2}
                            stroke="#ddd"
                            strokeWidth="2"
                        />
                    );
                })}
            </g>
            {/* Icon in center */}
            <g transform={`translate(${center - 7.5}, ${center - 7.5})`}>
                <Image size={15} color="#fff" />
            </g>
        </svg>
    );
};

export const Widget_AchievementEmailTemplate: React.FC = () => {
    return (
        <AbsoluteFill>
            <LightBackground />
            <AbsoluteFill
                style={{
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                    padding: "5%"
                }}
            >
                <div
                    style={{
                        width: '100%',
                        backgroundColor: 'white',
                        borderRadius: '12px',
                        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                        overflow: 'hidden',
                    }}
                >
                    <div
                        style={{
                            backgroundColor: '#f5f5f5',
                            padding: '1rem',
                            borderBottom: '1px solid #e0e0e0',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.5rem',
                        }}
                    >
                        <Trophy size={18} color="#666" />
                        <span style={{ color: '#666', fontFamily: fontFamily, fontSize: '14px' }}>
                            Achievement Unlocked
                        </span>
                    </div>
                    <div style={{ padding: '1rem' }}>
                        <div style={{ marginBottom: '1rem', borderBottom: '1px solid #eee', paddingBottom: '1rem' }}>
                            <div style={{
                                width: '70%',
                                height: '22px',
                                backgroundColor: '#e0e0e0',
                                borderRadius: '8px',
                                marginBottom: '1rem'
                            }} />
                            <div style={{
                                width: '40%',
                                height: '10px',
                                backgroundColor: '#eee',
                                borderRadius: '8px',
                                marginBottom: '0.5rem'
                            }} />
                            <div style={{
                                width: '35%',
                                height: '10px',
                                backgroundColor: '#eee',
                                borderRadius: '8px'
                            }} />
                        </div>
                        <div style={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            gap: '1rem',
                            padding: '2rem',
                            backgroundColor: '#f9f9f9',
                            borderRadius: '8px',
                            marginBottom: '2rem'
                        }}>
                            <AchievementBadge />
                            <div style={{
                                width: '80%',
                                height: '22px',
                                backgroundColor: '#e0e0e0',
                                borderRadius: '8px'
                            }} />
                            <div style={{
                                display: 'flex',
                                flexDirection: 'column',
                                gap: '0.5rem',
                                width: '100%',
                                alignItems: 'center'
                            }}>
                                <div style={{
                                    width: '90%',
                                    height: '10px',
                                    backgroundColor: '#eee',
                                    borderRadius: '8px'
                                }} />
                                <div style={{
                                    width: '85%',
                                    height: '10px',
                                    backgroundColor: '#eee',
                                    borderRadius: '8px'
                                }} />
                                <div style={{
                                    width: '35%',
                                    height: '10px',
                                    backgroundColor: '#eee',
                                    borderRadius: '8px'
                                }} />
                            </div>
                            <div style={{
                                width: '17.5%',
                                height: '25px',
                                backgroundColor: '#4CC74A',
                                borderRadius: '7px'
                            }} />
                        </div>
                    </div>
                </div>
            </AbsoluteFill>
        </AbsoluteFill>
    );
};

// Add keyframes for the pulse animation
const style = document.createElement('style');
style.textContent = `
    @keyframes pulse {
        0% { opacity: 1; }
        50% { opacity: 0.5; }
        100% { opacity: 1; }
    }
`;
document.head.appendChild(style);