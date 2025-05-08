import { AbsoluteFill, Sequence } from "remotion";
import { HashBackground } from "./HashBackground";
import { LightBackground } from "./LightBackground";
import { Typing } from "./Typing";
import { DarkBackground } from "./DarkBackground";
import { Cursor } from "./Cursor";
import { ScrollWords } from "./ScrollWords";
import { ZoomIn } from "./ZoomIn";
import { FadeOut } from "./FadeOut";
import { ZoomOut } from "./ZoomOut";
import { CodeSnippet } from "./CodeSnippet";
import { Badges } from "./Badges";

export const LaunchVideo: React.FC = () => {
    return (
        <AbsoluteFill>
            <Sequence durationInFrames={45}>
                <HashBackground />
                <Typing text="Introducing Trophy" />
            </Sequence>
            <Sequence from={45} durationInFrames={45}>
                <DarkBackground />
                <Typing text="APIs & SDKs for" theme="dark" />
            </Sequence>
            <Sequence from={90} durationInFrames={120}>
                <LightBackground />
                <FadeOut delay={90} duration={30}>
                    <ZoomIn delay={90} duration={30} startScale={1} endScale={25}>
                        <HashBackground />
                        <ScrollWords />
                        <Cursor delay={75} />
                    </ZoomIn>
                </FadeOut>
            </Sequence>
            <Sequence from={210} durationInFrames={230}>
                <ZoomOut duration={20} startScale={20} endScale={1}>
                    <HashBackground />
                    <CodeSnippet />
                </ZoomOut>
            </Sequence>
            <Sequence from={440} durationInFrames={30}>
                <DarkBackground />
                <Typing text="powering..." theme="dark" />
            </Sequence>
            <Sequence from={470} durationInFrames={230}>
                <HashBackground />
                <Badges />
            </Sequence>
        </AbsoluteFill>
    );
};