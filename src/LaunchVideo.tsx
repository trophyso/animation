import { AbsoluteFill, Img, Sequence, staticFile } from "remotion";
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
import { Achievements } from "./Achievements";
import { Streaks } from "./Streaks";
import { Emails } from "./Emails";
import { FadeIn } from "./FadeIn";

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
                <FadeOut delay={90} duration={20}>
                    <ZoomIn delay={90} duration={20} startScale={1} endScale={25}>
                        <HashBackground />
                        <ScrollWords />
                        <Cursor delay={70} />
                    </ZoomIn>
                </FadeOut>
            </Sequence>
            <Sequence from={210} durationInFrames={235}>
                <ZoomOut duration={20} startScale={20} endScale={1}>
                    <HashBackground />
                    <CodeSnippet />
                </ZoomOut>
            </Sequence>
            <Sequence from={445} durationInFrames={40}>
                <DarkBackground />
                <Typing text="and power..." theme="dark" />
            </Sequence>
            <Sequence from={485} durationInFrames={160}>
                <HashBackground />
                <Achievements />
            </Sequence>
            <Sequence from={645} durationInFrames={165}>
                <HashBackground />
                <Streaks />
            </Sequence>
            <Sequence from={810} durationInFrames={165}>
                <HashBackground />
                <Emails />
            </Sequence>
            <Sequence from={975} durationInFrames={75}>
                <HashBackground />
                <Typing text="npm i @trophyso/node" />
            </Sequence>
            <Sequence from={1050} durationInFrames={75}>
                <HashBackground />
                <FadeIn>
                    <LightBackground />
                </FadeIn>
                <FadeIn>
                    <AbsoluteFill style={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                    }}>
                        <Img src={staticFile('brand/logo_light.svg')} style={{ width: 400, height: 400 }} />
                    </AbsoluteFill>
                </FadeIn>
            </Sequence>
        </AbsoluteFill>
    );
};