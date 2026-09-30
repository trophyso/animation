import React from "react";
import { AbsoluteFill, useVideoConfig } from "remotion";
import { FlickeringGrid } from "../../components/FlickeringGrid";

export const SceneBackground: React.FC<{ children?: React.ReactNode }> = ({
  children,
}) => {
  const { width, height } = useVideoConfig();

  return (
    <AbsoluteFill style={{ backgroundColor: "#fff" }}>
      <FlickeringGrid
        className="absolute inset-0 z-0"
        style={{
          maskImage: "radial-gradient(1300px circle at center, white, transparent)",
          WebkitMaskImage:
            "radial-gradient(1300px circle at center, white, transparent)",
        }}
        squareSize={10}
        gridGap={14}
        color="#64748b"
        maxOpacity={0.12}
        flickerChance={0}
        width={width}
        height={height}
      />
      <AbsoluteFill style={{ zIndex: 1 }}>{children}</AbsoluteFill>
    </AbsoluteFill>
  );
};
