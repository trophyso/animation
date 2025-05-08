import { AbsoluteFill, useCurrentFrame, interpolate, Img, staticFile } from "remotion";
import { loadFont } from "@remotion/google-fonts/Montserrat";

const { fontFamily } = loadFont();

// Array of badge paths
const badges = [
    'badges/variant1_pink.png',
    'badges/variant1_purple.png',
    'badges/variant1_red.png',
    'badges/variant2_gold.png',
    'badges/variant2_orange.png',
    'badges/variant2_red.png',
    'badges/variant3_bronze.png',
    'badges/variant3_gold.png',
    'badges/variant3_silver.png',
    'badges/variant4_apple.png',
    'badges/variant4_book.png',
    'badges/variant4_books.png',
];

export const Achievements: React.FC = () => {
    const frame = useCurrentFrame();

    // Title typing animation
    const titleText = "Achievements...";
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
    const badgeRenderFrames = 9; // 0.3 seconds per badge at 30fps
    const totalBadgeFrames = badges.length * badgeRenderFrames;
    const badgeProgress = interpolate(
        frame,
        [45, 45 + totalBadgeFrames],
        [0, 1],
        {
            extrapolateLeft: 'clamp',
            extrapolateRight: 'clamp',
        }
    );

    // Calculate post-badge rotation
    const postBadgeFrames = 5;
    const postBadgeProgress = interpolate(
        frame,
        [45 + totalBadgeFrames, 45 + totalBadgeFrames + postBadgeFrames],
        [0, 1],
        {
            extrapolateLeft: 'clamp',
            extrapolateRight: 'clamp',
        }
    );

    // Initial zoom animation
    const initialZoom = interpolate(
        frame,
        [30, 75],
        [1, 2.2],
        {
            extrapolateLeft: 'clamp',
            extrapolateRight: 'clamp',
        }
    );

    // Calculate vertical position based on badge progress
    const verticalPosition = interpolate(
        badgeProgress,
        [0, 1],
        [0, -80],
        {
            extrapolateLeft: 'clamp',
            extrapolateRight: 'clamp',
        }
    );

    // Calculate 3D rotation based on badge progress and post-badge rotation
    const rotateX = interpolate(badgeProgress, [0, 1], [0, 15]);
    const badgeRotation = interpolate(badgeProgress, [0, 1], [0, 20]); // Only rotate to 20 degrees during badge rendering
    const postBadgeRotation = interpolate(postBadgeProgress, [0, 1], [0, 70]); // Rotate remaining 70 degrees after badges
    const rotateY = badgeRotation + postBadgeRotation;
    const scale = interpolate(badgeProgress, [0, 1], [1, 0.95]);

    // Calculate title offset based on rotation and scroll
    const titleOffset = interpolate(
        badgeProgress + postBadgeProgress,
        [0, 1],
        [0, -275],
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
                        gridTemplateColumns: 'repeat(4, 1fr)',
                        gap: '2rem',
                        padding: '2rem',
                    }}
                >
                    {badges.map((badge, index) => {
                        const badgeStartFrame = 45 + index * badgeRenderFrames;
                        const badgeProgress = interpolate(
                            frame,
                            [badgeStartFrame, badgeStartFrame + 10],
                            [0, 1],
                            {
                                extrapolateLeft: 'clamp',
                                extrapolateRight: 'clamp',
                            }
                        );

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

