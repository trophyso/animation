import { Composition } from "remotion";
import { LaunchVideo } from "./LaunchVideo/LaunchVideo";
import { FeatureHighlight_Metrics } from "./FeatureHighlight_Metrics/FeatureHighlight_Metrics";
import { Widget_Emails } from "./Widget_Emails/FeatureHighlight_Metrics";
import { HowTo_Metrics } from "./HowTo_Metrics/HowTo_Metrics";
import { HowWeBuiltOurDocsSite } from "./HowWeBuiltOurDocsSite/HowWeBuiltOurDocsSite";
import { UsingTrophyToBuildAGamifiedStudyApp } from "./UsingTrophyToBuildAGamifiedStudyApp/UsingTrophyToBuildAGamifiedStudyApp";
export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="LaunchVideo"
        component={LaunchVideo}
        durationInFrames={2200}
        fps={60}
        width={1920}
        height={1080}
      />
      <Composition
        id="FeatureHighlight-Metrics"
        component={FeatureHighlight_Metrics}
        durationInFrames={1}
        fps={60}
        width={1920}
        height={1080}
      />
      <Composition
        id="Widget-Emails"
        component={Widget_Emails}
        durationInFrames={1}
        fps={60}
        width={960}
        height={450}
      />
      <Composition
        id="HowTo-Metrics"
        component={HowTo_Metrics}
        durationInFrames={1}
        fps={60}
        width={1920}
        height={1080}
      />
      <Composition
        id="HowWeBuiltOurDocsSite"
        component={HowWeBuiltOurDocsSite}
        durationInFrames={1}
        fps={60}
        width={1920}
        height={1080}
      />
      <Composition
        id="UsingTrophyToBuildAGamifiedStudyApp"
        component={UsingTrophyToBuildAGamifiedStudyApp}
        durationInFrames={1}
        fps={60}
        width={1920}
        height={1080}
      />
    </>
  );
};