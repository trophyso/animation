import { Composition } from "remotion";
import { LaunchVideo } from "./LaunchVideo";

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="LaunchVideo"
        component={LaunchVideo}
        durationInFrames={1100}
        fps={30}
        width={1920}
        height={1080}
      />
    </>
  );
};