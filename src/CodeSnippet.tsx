import { AbsoluteFill, useCurrentFrame, interpolate } from "remotion";
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { loadFont } from "@remotion/google-fonts/Montserrat";

const { fontFamily } = loadFont();

export const CodeSnippet: React.FC = () => {
    const frame = useCurrentFrame();
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
    const titleText = "Track any user interaction...";
    const titleProgress = interpolate(
        frame,
        [0, 45], // Type over 45 frames
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
        const lineStartFrame = index * 10 + 45; // Start after title typing
        const lineProgress = interpolate(
            frame,
            [lineStartFrame, lineStartFrame + 15],
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
    const typingFrames = lines.length * 15 + 45; // Add title frames
    const postTypingFrames = 5; // Reduced from 15 to 8 frames for even quicker rotation

    const typingProgress = interpolate(
        frame,
        [45, typingFrames], // Start after title
        [0, 1],
        {
            extrapolateLeft: 'clamp',
            extrapolateRight: 'clamp',
        }
    );

    // Calculate post-typing rotation (starts after typing is complete)
    const postTypingProgress = interpolate(
        frame,
        [typingFrames, typingFrames + postTypingFrames], // Use the new frame calculations
        [0, 1],
        {
            extrapolateLeft: 'clamp',
            extrapolateRight: 'clamp',
        }
    );

    // Initial zoom animation (first 30 frames)
    const initialZoom = interpolate(
        frame,
        [45, 75], // Start after title
        [1, 2.2],
        {
            extrapolateLeft: 'clamp',
            extrapolateRight: 'clamp',
        }
    );

    // Calculate vertical position based on typing progress
    const verticalPosition = interpolate(
        typingProgress,
        [0, 1],
        [0, -80], // Increased scroll distance
        {
            extrapolateLeft: 'clamp',
            extrapolateRight: 'clamp',
        }
    );

    // Calculate 3D rotation based on typing progress and post-typing rotation
    const rotateX = interpolate(typingProgress, [0, 1], [0, 15]);

    // Adjust the rotation timing
    const typingRotation = interpolate(typingProgress, [0, 1], [0, 20]); // Only rotate to 20 degrees during typing
    const postTypingRotation = interpolate(postTypingProgress, [0, 1], [0, 70]); // Rotate remaining 70 degrees after typing
    const rotateY = typingRotation + postTypingRotation;

    const scale = interpolate(typingProgress, [0, 1], [1, 0.95]);

    // Calculate title offset based on rotation and scroll
    const titleOffset = interpolate(
        typingProgress + postTypingProgress,
        [0, 1],
        [0, -220], // Increased offset to match faster scroll and rotation
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
                    backgroundColor: '#1E1E1E',
                    borderRadius: '12px',
                    width: '80%',
                    maxWidth: '800px',
                    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                    overflow: 'hidden',
                    transform: sharedTransform,
                    transformStyle: 'preserve-3d',
                    transition: 'transform 0.1s ease-out',
                    opacity: frame < 45 ? 0 : 1,
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

