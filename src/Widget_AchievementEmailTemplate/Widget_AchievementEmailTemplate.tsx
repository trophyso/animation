import { AbsoluteFill } from "remotion";
import { loadFont } from "@remotion/google-fonts/Montserrat";
import { Mail, Trophy } from "lucide-react";
import { LightBackground } from "../components/LightBackground";

const { fontFamily } = loadFont();

export const Widget_AchievementEmailTemplate: React.FC = () => {
    const achievement = {
        name: "200 Lessons Completed",
        badge: Trophy,
        color: "#4CC74A",
        message: "Congratulations! You've completed 200 lessons, showing incredible dedication to your learning journey. Keep up the amazing work!"
    };

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
                        <Mail size={18} color="#666" />
                        <span style={{ color: '#666', fontFamily: fontFamily, fontSize: '14px' }}>
                            Inbox
                        </span>
                    </div>
                    <div style={{ padding: '1rem' }}>
                        <div style={{ marginBottom: '1rem', borderBottom: '1px solid #e0e0e0', paddingBottom: '1rem' }}>
                            <h2 style={{
                                fontSize: '18px',
                                fontWeight: 'bold',
                                color: '#333',
                                fontFamily: fontFamily,
                                margin: '0 0 1rem 0'
                            }}>
                                🎉 Achievement Unlocked: {achievement.name}
                            </h2>
                            <div style={{
                                fontSize: '12px',
                                color: '#888',
                                fontFamily: fontFamily,
                                marginBottom: '0.5rem'
                            }}>
                                From: <span style={{ color: '#333' }}>Acme Inc.</span>
                            </div>
                            <div style={{
                                fontSize: '12px',
                                color: '#888',
                                fontFamily: fontFamily
                            }}>
                                To: <span style={{ color: '#333' }}>John Doe</span>
                            </div>
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
                            <div
                                style={{
                                    width: '80px',
                                    height: '80px',
                                    borderRadius: '50%',
                                    backgroundColor: achievement.color,
                                    display: 'flex',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                }}
                            >
                                <achievement.badge size={40} color="white" />
                            </div>
                            <h3 style={{
                                fontSize: '20px',
                                fontWeight: 'bold',
                                color: '#333',
                                fontFamily: fontFamily,
                                margin: 0,
                                textAlign: 'center'
                            }}>
                                {achievement.name}
                            </h3>
                            <p style={{
                                fontSize: '12px',
                                color: '#666',
                                fontFamily: fontFamily,
                                margin: 0,
                                textAlign: 'center',
                                lineHeight: '1.5'
                            }}>
                                {achievement.message}
                            </p>
                        </div>
                    </div>
                </div>
            </AbsoluteFill>
        </AbsoluteFill>
    );
};