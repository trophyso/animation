import { AbsoluteFill } from "remotion";
import { loadFont as loadMontserrat } from "@remotion/google-fonts/Montserrat";
import { loadFont as loadRoboto } from "@remotion/google-fonts/Roboto";
import { Medal, PartyPopper, RefreshCw } from "lucide-react";
import { LightBackground } from "../components/LightBackground";

const { fontFamily: Montserrat } = loadMontserrat();
const { fontFamily: Roboto } = loadRoboto();

export const Widget_ReactivationEmailTemplate: React.FC = () => {
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
                        <RefreshCw size={18} color="#666" />
                        <span style={{ color: '#666', fontFamily: Montserrat, fontSize: '14px' }}>
                            Come Back!
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
                            padding: '1rem',
                            backgroundColor: '#f9f9f9',
                            borderRadius: '8px',
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '2rem'
                        }}>
                            {/* Two Column Block */}
                            <div style={{
                                display: 'flex',
                                gap: '2rem',
                            }}>
                                {/* Left Column (2/3 width) */}
                                <div style={{
                                    flex: 2,
                                    display: 'flex',
                                    flexDirection: 'column',
                                    gap: '1rem',
                                    alignItems: 'flex-start'
                                }}>
                                    <div style={{
                                        display: 'flex',
                                        gap: '0.5rem',
                                        width: '80%'
                                    }}>
                                        <div style={{
                                            width: '50px',
                                            height: '50px',
                                            backgroundColor: '#4CC74A',
                                            borderRadius: '8px',
                                            display: 'flex',
                                            justifyContent: 'center',
                                            alignItems: 'center',
                                            fontFamily: Roboto,
                                            fontSize: '22px',
                                            fontWeight: 'bold',
                                            color: '#fff'
                                        }}>
                                            38
                                        </div>
                                        <div style={{
                                            flex: 1,
                                            height: '50px',
                                            backgroundColor: '#e0e0e0',
                                            borderRadius: '8px'
                                        }} />
                                    </div>
                                    <div style={{
                                        display: 'flex',
                                        flexDirection: 'column',
                                        gap: '0.5rem',
                                        width: '100%'
                                    }}>
                                        <div style={{
                                            width: '100%',
                                            height: '10px',
                                            backgroundColor: '#eee',
                                            borderRadius: '8px'
                                        }} />
                                        <div style={{
                                            width: '70%',
                                            height: '10px',
                                            backgroundColor: '#eee',
                                            borderRadius: '8px'
                                        }} />
                                        <div style={{
                                            width: '40%',
                                            height: '10px',
                                            backgroundColor: '#eee',
                                            borderRadius: '8px'
                                        }} />
                                    </div>
                                </div>

                                {/* Right Column (1/3 width) */}
                                <div style={{
                                    flex: 1,
                                    display: 'flex',
                                    justifyContent: 'center',
                                    alignItems: 'center'
                                }}>
                                    <div style={{
                                        width: '100%',
                                        aspectRatio: '1',
                                        backgroundColor: '#f0f0f0',
                                        borderRadius: '10px',
                                        display: 'flex',
                                        justifyContent: 'center',
                                        alignItems: 'center'
                                    }}>
                                        <PartyPopper size={40} color="#666" />
                                    </div>
                                </div>
                            </div>

                            {/* Two Column Block */}
                            <div style={{
                                display: 'flex',
                                flexDirection: 'row-reverse',
                                gap: '2rem',
                            }}>
                                {/* Left Column (2/3 width) */}
                                <div style={{
                                    flex: 2,
                                    display: 'flex',
                                    flexDirection: 'column',
                                    gap: '1rem',
                                    alignItems: 'flex-start'
                                }}>
                                    <div style={{
                                        display: 'flex',
                                        flexDirection: 'row-reverse',
                                        justifyContent: "flex-end",
                                        gap: '0.5rem',
                                        width: '100%'
                                    }}>
                                        <div style={{
                                            width: '50px',
                                            height: '50px',
                                            backgroundColor: '#4CC74A',
                                            borderRadius: '8px',
                                            display: 'flex',
                                            justifyContent: 'center',
                                            alignItems: 'center',
                                            fontFamily: Roboto,
                                            fontSize: '22px',
                                            fontWeight: 'bold',
                                            color: '#fff'
                                        }}>
                                            94
                                        </div>
                                        <div style={{
                                            flex: 8,
                                            height: '50px',
                                            backgroundColor: '#e0e0e0',
                                            borderRadius: '8px'
                                        }} />
                                        <div style={{
                                            flex: 3,
                                            height: '50px',
                                            backgroundColor: '#f9f9f9',
                                            borderRadius: '8px'
                                        }} />
                                    </div>
                                    <div style={{
                                        display: 'flex',
                                        flexDirection: 'column',
                                        alignItems: 'flex-end',
                                        gap: '0.5rem',
                                        width: '100%'
                                    }}>
                                        <div style={{
                                            width: '100%',
                                            height: '10px',
                                            backgroundColor: '#eee',
                                            borderRadius: '8px'
                                        }} />
                                        <div style={{
                                            width: '70%',
                                            height: '10px',
                                            backgroundColor: '#eee',
                                            borderRadius: '8px'
                                        }} />
                                        <div style={{
                                            width: '40%',
                                            height: '10px',
                                            backgroundColor: '#eee',
                                            borderRadius: '8px'
                                        }} />
                                    </div>
                                </div>

                                {/* Right Column (1/3 width) */}
                                <div style={{
                                    flex: 1,
                                    display: 'flex',
                                    justifyContent: 'center',
                                    alignItems: 'center'
                                }}>
                                    <div style={{
                                        width: '100%',
                                        aspectRatio: '1',
                                        backgroundColor: '#f0f0f0',
                                        borderRadius: '10px',
                                        display: 'flex',
                                        justifyContent: 'center',
                                        alignItems: 'center'
                                    }}>
                                        <Medal size={40} color="#666" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </AbsoluteFill>
        </AbsoluteFill>
    );
}; 