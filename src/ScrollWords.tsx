import { Bump } from "./Bump";
import { FadeIn } from "./FadeIn";
import { FadeOut } from "./FadeOut";
import { Text } from "./Text";

export const ScrollWords: React.FC = () => {
    return (
        <>
            <Bump direction="left" distance={500}>
                <FadeOut min={0.25}>
                    <Text text="APIs & SDKs for" />
                </FadeOut>
            </Bump>
            <Bump direction="up" delay={60}>
                <Bump direction="up" delay={30}>
                    <FadeIn>
                        <Text text="engagement" />
                    </FadeIn>
                </Bump>
                <Bump direction="up" delay={30} offset={100}>
                    <FadeIn delay={30}>
                        <Text text="retention" />
                    </FadeIn>
                </Bump>
            </Bump>
            <Bump direction="up" delay={60} offset={100}>
                <Bump direction="up" delay={30} offset={100}>
                    <FadeIn delay={60}>
                        <Text text="gamification" theme="primary" />
                    </FadeIn>
                </Bump>
            </Bump>
        </>
    );
}