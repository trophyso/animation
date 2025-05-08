import { AbsoluteFill, useCurrentFrame, interpolate } from "remotion";
import { loadFont } from "@remotion/google-fonts/Montserrat";
import { Flame } from "lucide-react";

const { fontFamily } = loadFont();

export const Streaks: React.FC = () => {
    const frame = useCurrentFrame();

    // Array of streak colors
    const streaks = [
        null,
        '#4CC74A',
        '#4CC74A',
        '#4CC74A',
        '#eee',
        '#eee',
        '#4CC74A',
        '#4CC74A',
        '#eee',
        '#4CC74A',
        '#4CC74A',
        '#4CC74A',
        '#4CC74A',
        null
    ];

    // Title typing animation
    const titleText = "Streaks...";
    const titleProgress = interpolate(
        frame,
        [0, 20],
        [0, 1],
        {
            extrapolateLeft: 'clamp',
            extrapolateRight: 'clamp',
        }
    );
    const visibleTitleChars = Math.floor(titleText.length * titleProgress);
    const visibleTitle = titleText.slice(0, visibleTitleChars);

    // Calculate streak rendering progress
    const streakRenderFrames = 9; // 0.3 seconds per streak at 30fps
    const totalStreakFrames = streaks.length * streakRenderFrames;
    const streakProgress = interpolate(
        frame,
        [30, 30 + totalStreakFrames],
        [0, 1],
        {
            extrapolateLeft: 'clamp',
            extrapolateRight: 'clamp',
        }
    );

    // Calculate post-streak rotation
    const postStreakFrames = 5;
    const postStreakProgress = interpolate(
        frame,
        [30 + totalStreakFrames, 30 + totalStreakFrames + postStreakFrames],
        [0, 1],
        {
            extrapolateLeft: 'clamp',
            extrapolateRight: 'clamp',
        }
    );

    // Initial zoom animation
    const initialZoom = interpolate(
        frame,
        [30, 60],
        [1, 2.2],
        {
            extrapolateLeft: 'clamp',
            extrapolateRight: 'clamp',
        }
    );

    // Calculate vertical position based on streak progress
    const verticalPosition = interpolate(
        streakProgress,
        [0, 1],
        [0, -60],
        {
            extrapolateLeft: 'clamp',
            extrapolateRight: 'clamp',
        }
    );

    // Calculate 3D rotation based on streak progress and post-streak rotation
    const rotateX = interpolate(streakProgress, [0, 1], [0, 15]);
    const streakRotation = interpolate(streakProgress, [0, 1], [0, 20]); // Only rotate to 20 degrees during streak rendering
    const postStreakRotation = interpolate(postStreakProgress, [0, 1], [0, 70]); // Rotate remaining 70 degrees after streaks
    const rotateY = streakRotation + postStreakRotation;
    const scale = interpolate(streakProgress, [0, 1], [1, 0.95]);

    // Calculate title offset based on rotation and scroll
    const titleOffset = interpolate(
        streakProgress + postStreakProgress,
        [0, 1],
        [0, -50],
        {
            extrapolateLeft: 'clamp',
            extrapolateRight: 'clamp',
        }
    );

    // Shared transform for both title and streaks grid
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
                    opacity: frame < 30 ? 1 : 0.8,
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
                    maxWidth: '400px',
                    transform: sharedTransform,
                    transformStyle: 'preserve-3d',
                    transition: 'transform 0.1s ease-out',
                    opacity: frame < 30 ? 0 : 1,
                }}
            >
                <div
                    style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(5, 1fr)',
                        gap: '1rem',
                        padding: '1rem',
                    }}
                >
                    {streaks.map((color, index) => {
                        const streakStartFrame = 30 + index * streakRenderFrames;
                        const streakProgress = interpolate(
                            frame,
                            [streakStartFrame, streakStartFrame + 10],
                            [0, 1],
                            {
                                extrapolateLeft: 'clamp',
                                extrapolateRight: 'clamp',
                            }
                        );

                        return (
                            <div
                                key={color}
                                style={{
                                    display: 'flex',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    opacity: streakProgress,
                                    transform: `scale(${streakProgress})`,
                                    transition: 'all 0.2s ease-out',
                                }}
                            >
                                <div
                                    style={{
                                        width: '100%',
                                        aspectRatio: '1',
                                        maxWidth: '80px',
                                        backgroundColor: color || 'transparent',
                                        borderRadius: '15px',
                                        display: 'flex',
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                        boxShadow: color ? '0 4px 6px rgba(0, 0, 0, 0.1)' : 'none',
                                    }}
                                >
                                    <Flame
                                        size={40}
                                        color="white"
                                        style={{
                                            opacity: 0.9,
                                        }}
                                    />
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </AbsoluteFill>
    );
}; 