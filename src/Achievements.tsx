import { AbsoluteFill, useCurrentFrame, interpolate, Img, staticFile, spring, useVideoConfig } from "remotion";
import { loadFont } from "@remotion/google-fonts/Montserrat";

const { fontFamily } = loadFont();

// Array of badge paths
const badges = [
    'badges/variant1_pink.png',
    'badges/variant1_red.png',
    'badges/variant1_purple.png',
    'badges/variant2_gold.png',
    'badges/variant2_orange.png',
    'badges/variant2_red.png',
    'badges/variant3_bronze.png',
    'badges/variant3_silver.png',
    'badges/variant3_gold.png',
];

export const Achievements: React.FC = () => {
    const frame = useCurrentFrame();
    const { fps } = useVideoConfig();

    // Title typing animation
    const titleText = "Achievements";
    const titleProgress = interpolate(
        frame,
        [0, 25],
        [0, 1],
        {
            extrapolateLeft: 'clamp',
            extrapolateRight: 'clamp',
        }
    );
    const visibleTitleChars = Math.floor(titleText.length * titleProgress);
    const visibleTitle = titleText.slice(0, visibleTitleChars);

    // Calculate badge rendering progress
    const badgeRenderFrames = 10; // 0.33 seconds per badge at 30fps
    const totalBadgeFrames = badges.length * badgeRenderFrames;
    const badgeProgress = interpolate(
        frame,
        [25, totalBadgeFrames + 60],
        [0, 1],
        {
            extrapolateLeft: 'clamp',
            extrapolateRight: 'clamp',
        }
    );

    // Initial zoom animation
    const initialZoom = spring({
        frame: frame - 25, // Start after title typing
        fps,
        from: 1,
        to: 2.2,
        durationInFrames: 45,
        config: {
            damping: 15,
            mass: 0.6,
            stiffness: 200,
        }
    });

    // Calculate vertical position based on badge progress
    const verticalPosition = interpolate(
        badgeProgress,
        [0, 1],
        [0, -60],
        {
            extrapolateLeft: 'clamp',
            extrapolateRight: 'clamp',
        }
    );

    // Calculate 3D rotation based on badge progress and post-badge rotation
    const rotateX = interpolate(badgeProgress, [0, 1], [0, 8]);
    const badgeRotation = interpolate(badgeProgress, [0, 1], [0, 10]);
    const rotateY = badgeRotation;
    const scale = interpolate(badgeProgress, [0, 1], [1, 0.97]);

    // Calculate title offset based on rotation and scroll
    const titleOffset = interpolate(
        badgeProgress,
        [0, 1],
        [0, -250],
        {
            extrapolateLeft: 'clamp',
            extrapolateRight: 'clamp',
        }
    );

    // Shared transform for both title and badges grid
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
                    opacity: frame < 45 ? 1 : 0.8,
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
                    opacity: frame < 45 ? 0 : 1,
                }}
            >
                <div
                    style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(3, 1fr)',
                        gap: '2rem',
                        padding: '2rem',
                    }}
                >
                    {badges.map((badge, index) => {
                        const badgeStartFrame = 45 + index * badgeRenderFrames;
                        const badgeProgress = spring({
                            frame: frame - badgeStartFrame,
                            fps,
                            from: 0,
                            to: 1,
                            durationInFrames: 10,
                            config: {
                                damping: 15,
                                mass: 0.8,
                                stiffness: 100,
                            }
                        });

                        return (
                            <div
                                key={badge}
                                style={{
                                    display: 'flex',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    opacity: badgeProgress,
                                    transform: `scale(${badgeProgress})`,
                                    transition: 'all 0.2s ease-out',
                                }}
                            >
                                <Img
                                    src={staticFile(badge)}
                                    style={{
                                        width: '100%',
                                        height: 'auto',
                                        maxWidth: '120px',
                                    }}
                                />
                            </div>
                        );
                    })}
                </div>
            </div>
        </AbsoluteFill>
    );
};

