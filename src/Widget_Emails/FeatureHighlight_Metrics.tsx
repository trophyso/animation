import { AbsoluteFill } from "remotion";
import { loadFont } from "@remotion/google-fonts/Montserrat";
import { Mail, RefreshCw, Trophy } from "lucide-react";
import { BarChart2 } from "lucide-react";
import { LightBackground } from "../components/LightBackground";

const { fontFamily } = loadFont();

export const Widget_Emails: React.FC = () => {
    const emails = [
        {
            subject: "🎉 Achievement Unlocked: 200 lessons completed!",
            preview: "Congratulations! You're a rockstar!",
            type: "Achievement",
            icon: Trophy,
            color: "#4CC74A",
            time: "2 hours ago"
        },
        {
            subject: "📊 Your Weekly Progress Report",
            preview: "Here's a summary of your activity this week...",
            type: "Recap",
            icon: BarChart2,
            color: "#ab63f7",
            time: "1 day ago"
        },
        {
            subject: "👋 We Miss You!",
            preview: "It's been a while since your last session...",
            type: "Reactivation",
            icon: RefreshCw,
            color: "#ffcd04",
            time: "3 days ago"
        }
    ];

    return (
        <AbsoluteFill>
            <LightBackground />
            <AbsoluteFill
                style={{
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                    padding: "3%",
                }}
            >
                <div
                    style={{
                        width: '90%',
                        maxWidth: '850px',
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
                        <Mail size={20} color="#666" />
                        <span style={{ color: '#666', fontFamily: fontFamily }}>Inbox</span>
                    </div>
                    <div style={{ padding: '1rem' }}>
                        {emails.map((email) => (
                            <div
                                key={email.subject}
                                style={{
                                    display: 'flex',
                                    alignItems: 'flex-start',
                                    gap: '1rem',
                                    padding: '1rem',
                                    borderBottom: '1px solid #e0e0e0',
                                }}
                            >
                                <div
                                    style={{
                                        width: '40px',
                                        height: '40px',
                                        borderRadius: '50%',
                                        backgroundColor: email.color,
                                        display: 'flex',
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                        flexShrink: 0,
                                    }}
                                >
                                    <email.icon size={20} color="white" />
                                </div>
                                <div style={{ flex: 1 }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.25rem' }}>
                                        <h3 style={{
                                            fontSize: '16px',
                                            fontWeight: 'bold',
                                            color: '#333',
                                            fontFamily: fontFamily,
                                            margin: 0
                                        }}>
                                            {email.subject}
                                        </h3>
                                        <span style={{
                                            fontSize: '14px',
                                            color: '#666',
                                            fontFamily: fontFamily
                                        }}>
                                            {email.time}
                                        </span>
                                    </div>
                                    <p style={{
                                        fontSize: '14px',
                                        color: '#666',
                                        margin: 0,
                                        fontFamily: fontFamily
                                    }}>
                                        {email.preview}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </AbsoluteFill>
        </AbsoluteFill>
    );
};