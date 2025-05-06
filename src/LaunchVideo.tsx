import { AbsoluteFill, Sequence } from "remotion";
import { LightBackground } from "./LightBackground";
import { Text } from "./Text";
import { FadeIn } from "./FadeIn";
import { Bump } from "./Bump";
import { Typing } from "./Typing";
import { DarkBackground } from "./DarkBackground";

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
                <Bump direction="left" distance={500} duration={10}>
                    <Text text="APIs & SDKs for" />
                </Bump>
                <Bump direction="up" delay={30}>
                    <Bump direction="up" delay={15}>
                        <Bump direction="up">
                            <FadeIn>
                                <Text text="engagement" />
                            </FadeIn>
                        </Bump>
                    </Bump>
                </Bump>
                <Bump direction="up" delay={30}>
                    <Bump direction="up" delay={15}>
                        <FadeIn delay={15}>
                            <Text text="retention" />
                        </FadeIn>
                    </Bump>
                </Bump>
                <Bump direction="up" delay={30}>
                    <FadeIn delay={30}>
                        <Text text="gamification" theme="primary" />
                    </FadeIn>
                </Bump>
            </Sequence>
        </AbsoluteFill>
    );
};