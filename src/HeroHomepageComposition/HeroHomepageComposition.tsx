import React from "react";
import { AbsoluteFill } from "remotion";
import {
    HeroHomepageComposition as HeroHomepageCompositionWidget,
    type HeroCompositionConfig,
} from "../components/widgets/HeroHomepageComposition";

type HeroHomepageCompositionProps = {
    composition?: HeroCompositionConfig;
};

export const HeroHomepageComposition: React.FC<HeroHomepageCompositionProps> = ({
    composition,
}) => {
    return (
        <AbsoluteFill
            style={{
                backgroundColor: "#f8fafc",
                alignItems: "center",
                justifyContent: "center",
                padding: 64,
            }}
        >
            <HeroHomepageCompositionWidget composition={composition} />
        </AbsoluteFill>
    );
};
