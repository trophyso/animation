import { AbsoluteFill, useCurrentFrame, interpolate, spring, useVideoConfig } from "remotion";
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { loadFont } from "@remotion/google-fonts/Montserrat";

const { fontFamily } = loadFont();

export const CodeSnippet: React.FC = () => {
    const frame = useCurrentFrame();
    const { fps } = useVideoConfig();

    const codeString = `const trophy = new TrophyApiClient({
    apiKey: process.env.TROPHY_API_KEY as string,
});

await trophy.metrics.event("words-written", {
    user: {
        email: "user@example.com",
        tz: "Europe/London",
        id: "10"
    },
    value: 1
});`;

    // Title typing animation
    const titleText = "Track user behavior";
    const titleProgress = interpolate(
        frame,
        [0, 105],
        [0, 1],
        {
            extrapolateLeft: 'clamp',
            extrapolateRight: 'clamp',
        }
    );
    const visibleTitleChars = Math.floor(titleText.length * titleProgress);
    const visibleTitle = titleText.slice(0, visibleTitleChars);

    // Split code into lines and create typing animation
    const lines = codeString.split('\n');
    const visibleLines = lines.map((line, index) => {
        const lineStartFrame = index * 20 + 150;
        const lineProgress = interpolate(
            frame,
            [lineStartFrame, lineStartFrame + 30],
            [0, 1],
            {
                extrapolateLeft: 'clamp',
                extrapolateRight: 'clamp',
            }
        );

        const visibleChars = Math.floor(line.length * lineProgress);
        return line.slice(0, visibleChars);
    }).join('\n');

    // Calculate overall typing progress
    const typingFrames = lines.length * 30 + 150;
    const postTypingFrames = 10;
    const finalZoomFrames = 60;

    const typingProgress = interpolate(
        frame,
        [150, typingFrames],
        [0, 1],
        {
            extrapolateLeft: 'clamp',
            extrapolateRight: 'clamp',
        }
    );

    // Calculate final zoom animation
    const finalZoom = spring({
        frame: frame - (typingFrames - 40),
        fps,
        from: 1,
        to: 15,
        durationInFrames: finalZoomFrames + 40,
        config: {
            damping: 12,
            mass: 0.5,
            stiffness: 100,
        }
    });

    // Calculate post-typing rotation (starts after typing is complete)
    const postTypingProgress = interpolate(
        frame,
        [typingFrames, typingFrames + postTypingFrames],
        [0, 1],
        {
            extrapolateLeft: 'clamp',
            extrapolateRight: 'clamp',
        }
    );

    // Initial zoom animation
    const initialZoom = spring({
        frame: frame - 120, // Increased from 90 to 120 to delay zoom start
        fps,
        from: 1,
        to: 2.2,
        durationInFrames: 60,
        config: {
            damping: 12,
            mass: 0.5,
            stiffness: 100,
        }
    });

    // Calculate vertical position based on typing progress
    const verticalPosition = interpolate(
        typingProgress,
        [0, 1],
        [0, -10],
        {
            extrapolateLeft: 'clamp',
            extrapolateRight: 'clamp',
        }
    );

    // Calculate 3D rotation based on typing progress
    const rotateX = interpolate(typingProgress, [0, 1], [0, 10]);

    // Adjust the rotation timing
    const rotateY = interpolate(typingProgress, [0, 1], [0, 15]);

    const scale = interpolate(typingProgress, [0, 1], [1, 0.95]);

    // Calculate title offset based on rotation and scroll
    const titleOffset = interpolate(
        typingProgress + postTypingProgress,
        [0, 1],
        [0, -220],
        {
            extrapolateLeft: 'clamp',
            extrapolateRight: 'clamp',
        }
    );

    // Shared transform for both title and code editor
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
                transform: `scale(${initialZoom * finalZoom})`,
                transformOrigin: 'center center',
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
                    backgroundColor: '#1E1E1E',
                    borderRadius: '12px',
                    width: '80%',
                    maxWidth: '800px',
                    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                    overflow: 'hidden',
                    transform: sharedTransform,
                    transformStyle: 'preserve-3d',
                    transition: 'transform 0.1s ease-out',
                    opacity: frame < 150 ? 0 : 1,
                }}
            >
                <div
                    style={{
                        backgroundColor: '#2D2D2D',
                        padding: '0.75rem 1rem',
                        borderBottom: '1px solid #3D3D3D',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                    }}
                >
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <div style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: '#FF5F56' }} />
                        <div style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: '#FFBD2E' }} />
                        <div style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: '#27C93F' }} />
                    </div>
                    <div style={{
                        color: '#8B8B8B',
                        fontSize: '0.9rem',
                        fontFamily: 'monospace',
                        marginLeft: '0.5rem'
                    }}>
                        server.ts
                    </div>
                </div>
                <div style={{ padding: '1rem' }}>
                    <SyntaxHighlighter
                        language="typescript"
                        style={vscDarkPlus}
                        customStyle={{
                            margin: 0,
                            borderRadius: '8px',
                            fontSize: '1.2rem',
                            padding: '1rem',
                        }}
                        showLineNumbers={true}
                        wrapLines={true}
                        lineNumberStyle={{
                            color: '#858585',
                            minWidth: '2.5em',
                            paddingRight: '1em',
                            textAlign: 'right',
                            userSelect: 'none',
                        }}
                    >
                        {visibleLines}
                    </SyntaxHighlighter>
                </div>
            </div>
        </AbsoluteFill>
    );
};

