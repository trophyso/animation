import { AbsoluteFill } from "remotion";
import { loadFont } from "@remotion/google-fonts/Montserrat";
import { Flame } from "lucide-react";
import { LightBackground } from "../components/LightBackground";

const { fontFamily } = loadFont();

export const Widget_StreakEmailTemplate: React.FC = () => {
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
                        <Flame size={18} color="#666" />
                        <span style={{ color: '#666', fontFamily: fontFamily, fontSize: '14px' }}>
                            You're about to lose your streak
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
                            paddingTop: '1rem'
                        }}>
                            <div style={{
                                width: '50%',
                                height: '22px',
                                backgroundColor: '#e0e0e0',
                                borderRadius: '8px'
                            }} />
                            <div style={{
                                width: '20%',
                                height: '10px',
                                backgroundColor: '#eee',
                                borderRadius: '8px'
                            }} />
                            <div style={{
                                display: 'flex',
                                flexWrap: 'wrap',
                                gap: '0.5rem',
                                alignItems: 'center',
                                maxWidth: '300px' // 7 blocks * 40px width + 6 gaps * 0.5rem
                            }}>
                                {Array.from({ length: 10 }).map((_, index) => (
                                    <div key={index} style={{
                                        width: '40px',
                                        height: '40px',
                                        backgroundColor: [8, 9].includes(index) ? '#4CC74A' : '#e0e0e0',
                                        borderRadius: '8px'
                                    }} />
                                ))}
                            </div>
                            <div style={{
                                display: 'flex',
                                flexDirection: 'column',
                                gap: '0.5rem',
                                width: '100%',
                                alignItems: 'center'
                            }}>
                                <div style={{
                                    width: '75%',
                                    height: '10px',
                                    backgroundColor: '#eee',
                                    borderRadius: '8px'
                                }} />
                                <div style={{
                                    width: '55%',
                                    height: '10px',
                                    backgroundColor: '#eee',
                                    borderRadius: '8px'
                                }} />
                                <div style={{
                                    width: '15%',
                                    height: '10px',
                                    backgroundColor: '#eee',
                                    borderRadius: '8px'
                                }} />
                            </div>
                            <div style={{
                                width: '100%',
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center',
                                marginTop: '0.5rem',
                                position: 'relative'
                            }}>
                                <div style={{
                                    width: '17.5%',
                                    height: '30px',
                                    borderRadius: '7px',
                                    backgroundColor: '#4CC74A',
                                }} />
                            </div>
                        </div>
                    </div>
                </div>
            </AbsoluteFill>
        </AbsoluteFill>
    );
};