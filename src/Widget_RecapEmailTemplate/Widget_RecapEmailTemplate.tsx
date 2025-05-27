import { AbsoluteFill } from "remotion";
import { loadFont } from "@remotion/google-fonts/Montserrat";
import { ChartArea } from "lucide-react";
import { LightBackground } from "../components/LightBackground";

const { fontFamily } = loadFont();

const BarChart = () => {
    const data = [30, 45, 60, 75, 90, 80, 65, 90, 75];
    const maxValue = Math.max(...data);
    const barWidth = 30;
    const barGap = 15;
    const chartHeight = 200;

    // Get the top 3 values
    const sortedValues = [...data].sort((a, b) => b - a);
    const topThreeValues = new Set(sortedValues.slice(0, 3));

    return (
        <div style={{
            width: '100%',
            height: chartHeight,
            position: 'relative',
        }}>
            {/* Y-axis line */}
            <div style={{
                position: 'absolute',
                left: 0,
                top: 0,
                bottom: 0,
                width: '2px',
                backgroundColor: '#ddd'
            }} />

            {/* X-axis line */}
            <div style={{
                position: 'absolute',
                left: 0,
                right: 0,
                bottom: 0,
                height: '2px',
                backgroundColor: '#ddd'
            }} />

            {/* Bars */}
            <div style={{
                position: 'absolute',
                left: '20px',
                bottom: '0',
                display: 'flex',
                gap: `${barGap}px`,
                height: chartHeight
            }}>
                {data.map((value, index) => {
                    const height = (value / maxValue) * (chartHeight - 20);
                    const isTopThree = topThreeValues.has(value);
                    return (
                        <div
                            key={index}
                            style={{
                                width: `${barWidth}px`,
                                height: `${height}px`,
                                backgroundColor: isTopThree ? '#4CC74A' : '#e0e0e0',
                                borderRadius: '4px 4px 0 0',
                                alignSelf: 'flex-end',
                                transition: 'height 0.3s ease'
                            }}
                        />
                    );
                })}
            </div>
        </div>
    );
};

export const Widget_RecapEmailTemplate: React.FC = () => {
    return (
        <AbsoluteFill>
            <LightBackground />
            <AbsoluteFill>
                <div
                    style={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        width: '50%',
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
                        <ChartArea size={18} color="#666" />
                        <span style={{ color: '#666', fontFamily: fontFamily, fontSize: '14px' }}>
                            Weekly Recap
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
                            gap: '.5rem',
                            padding: '1rem 2rem 1rem 2rem',
                            backgroundColor: '#f9f9f9',
                            borderRadius: '8px',
                        }}>
                            <div style={{
                                display: 'flex',
                                flexDirection: 'column',
                                justifyContent: 'center',
                                alignItems: 'center',
                                width: '100%'
                            }}>
                                <div style={{
                                    width: '50%',
                                    height: '22px',
                                    backgroundColor: '#e0e0e0',
                                    borderRadius: '8px',
                                    marginBottom: '.75rem'
                                }} />
                                <div style={{
                                    width: '30%',
                                    height: '10px',
                                    backgroundColor: '#eee',
                                    borderRadius: '8px',
                                    marginBottom: '1rem'
                                }} />
                            </div>
                            <BarChart />
                        </div>
                    </div>
                </div>
            </AbsoluteFill>
        </AbsoluteFill>
    );
};