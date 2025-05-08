import { AbsoluteFill, useCurrentFrame, interpolate, spring, useVideoConfig } from "remotion";
import { loadFont } from "@remotion/google-fonts/Montserrat";
import { Mail, Trophy, BarChart2, RefreshCw } from "lucide-react";

const { fontFamily } = loadFont();

export const Emails: React.FC = () => {
    const frame = useCurrentFrame();
    const { fps } = useVideoConfig();

    // Title typing animation
    const titleText = "Automated emails";
    const titleProgress = interpolate(
        frame,
        [0, 50],
        [0, 1],
        {
            extrapolateLeft: 'clamp',
            extrapolateRight: 'clamp',
        }
    );
    const visibleTitleChars = Math.floor(titleText.length * titleProgress);
    const visibleTitle = titleText.slice(0, visibleTitleChars);

    // Email data
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

    // Calculate email rendering progress
    const emailRenderFrames = 80;
    const totalEmailFrames = emails.length * emailRenderFrames;
    const emailProgress = interpolate(
        frame,
        [50, totalEmailFrames + 120],
        [0, 1],
        {
            extrapolateLeft: 'clamp',
            extrapolateRight: 'clamp',
        }
    );

    // Initial zoom animation
    const initialZoom = spring({
        frame: frame - 50,
        fps,
        from: 1,
        to: 2.2,
        durationInFrames: 60,
        config: {
            damping: 15,
            mass: 0.6,
            stiffness: 80,
        }
    });

    // Calculate vertical position based on email progress
    const verticalPosition = interpolate(
        emailProgress,
        [0, 1],
        [0, -60],
        {
            extrapolateLeft: 'clamp',
            extrapolateRight: 'clamp',
        }
    );

    // Calculate 3D rotation based on email progress and post-email rotation
    const rotateX = interpolate(emailProgress, [0, 1], [0, 8]);
    const emailRotation = interpolate(emailProgress, [0, 1], [0, 10]);
    const rotateY = emailRotation;
    const scale = interpolate(emailProgress, [0, 1], [1, 0.97]);

    // Calculate title offset based on rotation and scroll
    const titleOffset = interpolate(
        emailProgress,
        [0, 1],
        [0, -150],
        {
            extrapolateLeft: 'clamp',
            extrapolateRight: 'clamp',
        }
    );

    // Shared transform for both title and inbox
    const sharedTransform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(${scale}) translateY(${verticalPosition}%)`;

    return (
        <AbsoluteFill
            style={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'flex-start',
                alignItems: 'center',
                padding: '2rem',
                perspective: '1000px',
                transform: `scale(${initialZoom})`,
                transformOrigin: 'center top',
                transition: 'transform 0.2s ease-out',
                paddingTop: '10%',
            }}
        >
            <div
                style={{
                    color: '#333',
                    fontSize: '60px',
                    fontWeight: 'bold',
                    fontFamily: fontFamily,
                    marginBottom: '2rem',
                    opacity: frame < 50 ? 1 : 0.8,
                    transform: `${sharedTransform} translateY(${titleOffset}px)`,
                    transformStyle: 'preserve-3d',
                    transition: 'transform 0.1s ease-out',
                }}
            >
                {visibleTitle}
            </div>
            <div
                style={{
                    width: '80%',
                    maxWidth: '800px',
                    transform: sharedTransform,
                    transformStyle: 'preserve-3d',
                    transition: 'transform 0.1s ease-out',
                    opacity: frame < 50 ? 0 : 1,
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
                    {emails.map((email, index) => {
                        const emailStartFrame = 50 + index * emailRenderFrames;
                        const springProgress = spring({
                            frame: frame - emailStartFrame,
                            fps,
                            config: {
                                damping: 24,
                                mass: 0.5,
                                stiffness: 200,
                            },
                        });

                        const Icon = email.icon;

                        // Calculate the vertical position for the sliding animation using spring
                        const slideUpPosition = interpolate(
                            springProgress,
                            [0, 1],
                            [100, 0],
                            {
                                extrapolateLeft: 'clamp',
                                extrapolateRight: 'clamp',
                            }
                        );

                        return (
                            <div
                                key={email.subject}
                                style={{
                                    display: 'flex',
                                    alignItems: 'flex-start',
                                    gap: '1rem',
                                    padding: '1rem',
                                    borderBottom: '1px solid #e0e0e0',
                                    opacity: springProgress,
                                    transform: `translateY(${slideUpPosition}px)`,
                                    transition: 'all 0.2s ease-out',
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
                                    <Icon size={20} color="white" />
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
                        );
                    })}
                </div>
            </div>
        </AbsoluteFill>
    );
};