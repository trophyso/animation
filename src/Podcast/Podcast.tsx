import { Img, spring, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { Bump } from "../components/Bump";
import { loadFont } from '@remotion/google-fonts/Montserrat';

const { fontFamily } = loadFont();

export const Podcast: React.FC = () => {
    const { fps } = useVideoConfig();
    const currentFrame = useCurrentFrame();

    const opacity = spring({
        frame: currentFrame,
        fps,
        from: 0,
        to: 1,
        durationInFrames: fps * 0.5,
        delay: fps * 0.5,
        config: {
            damping: 12,
            mass: 0.5,
            stiffness: 100,
        }
    });

    return (
        <div style={{
            width: '100%',
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#000',
        }}>
            <Bump direction="up" distance={150} delay={fps * 0.5}>
                <div
                    style={{
                        justifyContent: "center",
                        alignItems: "center",
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '40px',
                        height: '100%',
                        width: '100%',
                    }}
                >
                    <div>
                        <Img
                            src={staticFile('brand/podcast_notag.png')}
                            style={{
                                width: 500,
                                height: 500,
                                boxShadow: '0 0 100px rgba(255, 255, 255, 0.5)',
                            }}
                        />
                    </div>
                    <div>
                        <p style={{ color: '#fff', fontFamily: fontFamily, fontSize: '30px', fontWeight: 'bold', opacity: opacity }}>
                            Presented By
                        </p>
                    </div>
                </div>
            </Bump>
        </div>
    );
}; 