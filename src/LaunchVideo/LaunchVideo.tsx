import { AbsoluteFill, Img, Sequence, staticFile } from "remotion";
import { HashBackground } from "../components/HashBackground";
import { LightBackground } from "../components/LightBackground";
import { Typing } from "./Typing";
import { DarkBackground } from "../components/DarkBackground";
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
            <Sequence durationInFrames={90}>
                <HashBackground />
                <Typing text="Introducing Trophy" />
            </Sequence>
            <Sequence from={90} durationInFrames={90}>
                <HashBackground />
                <Typing text="APIs & SDKs for" />
            </Sequence>
            <Sequence from={180} durationInFrames={240}>
                <LightBackground />
                <FadeOut delay={180} duration={40}>
                    <ZoomIn delay={180} duration={40} startScale={1} endScale={25}>
                        <HashBackground />
                        <ScrollWords />
                        <Cursor delay={120} />
                    </ZoomIn>
                </FadeOut>
            </Sequence>
            <Sequence from={420} durationInFrames={470}>
                <FadeOut>
                    <LightBackground />
                </FadeOut>
                <ZoomOut duration={50} startScale={10} endScale={1}>
                    <HashBackground />
                    <CodeSnippet />
                </ZoomOut>
            </Sequence>
            <Sequence from={890} durationInFrames={80}>
                <DarkBackground />
                <Typing text="and power..." theme="dark" />
            </Sequence>
            <Sequence from={970} durationInFrames={300}>
                <HashBackground />
                <Achievements />
            </Sequence>
            <Sequence from={1270} durationInFrames={280}>
                <HashBackground />
                <Streaks />
            </Sequence>
            <Sequence from={1550} durationInFrames={350}>
                <HashBackground />
                <Emails />
            </Sequence>
            <Sequence from={1900} durationInFrames={150}>
                <HashBackground />
                <Typing text="npm i @trophyso/node" />
            </Sequence>
            <Sequence from={2050} durationInFrames={150}>
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