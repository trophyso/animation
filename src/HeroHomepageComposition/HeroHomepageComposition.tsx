import React from "react";
import { AbsoluteFill } from "remotion";
import { HeroHomepageComposition as HeroHomepageCompositionWidget } from "../components/widgets/HeroHomepageComposition";

export const HeroHomepageComposition: React.FC = () => {
    return (
        <AbsoluteFill
            style={{
                backgroundColor: "#f8fafc",
                alignItems: "center",
                justifyContent: "center",
                padding: 64,
            }}
        >
            <HeroHomepageCompositionWidget />
        </AbsoluteFill>
    );
};
