import { AbsoluteFill, Sequence } from "remotion";
import { LightBackground } from "./LightBackground";
import { Typing } from "./Typing";
import { DarkBackground } from "./DarkBackground";
import { Cursor } from "./Cursor";
import { ScrollWords } from "./ScrollWords";

export const LaunchVideo: React.FC = () => {
    return (
        <AbsoluteFill>
            <Sequence durationInFrames={45}>
                <LightBackground />
                <Typing text="introducing trophy" />
            </Sequence>
            <Sequence from={45} durationInFrames={45}>
                <DarkBackground />
                <Typing text="APIs & SDKs for" theme="dark" />
            </Sequence>
            <Sequence from={90}>
                <LightBackground />
                <ScrollWords />
                <Cursor delay={75} />
            </Sequence>
        </AbsoluteFill>
    );
};