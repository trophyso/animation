import { Composition } from "remotion";
import { LaunchVideo } from "./LaunchVideo/LaunchVideo";
import { FeatureHighlight_Metrics } from "./FeatureHighlight_Metrics/FeatureHighlight_Metrics";
import { Widget_Emails } from "./Widget_Emails/Widget_Emails";
import { HowTo_Metrics } from "./HowTo_Metrics/HowTo_Metrics";
import { HowWeBuiltOurDocsSite } from "./HowWeBuiltOurDocsSite/HowWeBuiltOurDocsSite";
import { UsingTrophyToBuildAGamifiedStudyApp } from "./UsingTrophyToBuildAGamifiedStudyApp/UsingTrophyToBuildAGamifiedStudyApp";
import { Widget_AchievementEmailTemplate } from "./Widget_AchievementEmailTemplate/Widget_AchievementEmailTemplate";
import { Widget_RecapEmailTemplate } from "./Widget_RecapEmailTemplate/Widget_RecapEmailTemplate";
import { Widget_ReactivationEmailTemplate } from "./Widget_ReactivationEmailTemplate/Widget_ReactivationEmailTemplate";
import { Podcast } from "./Podcast/Podcast";
import { GenericThumbnailImage } from "./GenericThumbnailImage/GenericThumbnailImage";
import { HashBackground } from "./HashBackground/HashBackgroundComposition";
import { SalesDocImage } from "./SalesDocImage/SalesDocImage";
import { Widget_StreakEmailTemplate } from "./Widget_StreakEmailTemplate/Widget_StreakEmailTemplate";

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
      <Composition
        id="Widget-AchievementEmailTemplate"
        component={Widget_AchievementEmailTemplate}
        durationInFrames={1}
        fps={60}
        width={1000}
        height={600}
      />
      <Composition
        id="Widget-RecapEmailTemplate"
        component={Widget_RecapEmailTemplate}
        durationInFrames={1}
        fps={60}
        width={1000}
        height={600}
      />
      <Composition
        id="Widget-ReactivationEmailTemplate"
        component={Widget_ReactivationEmailTemplate}
        durationInFrames={1}
        fps={60}
        width={1000}
        height={600}
      />
      <Composition
        id="Widget-StreakEmailTemplate"
        component={Widget_StreakEmailTemplate}
        durationInFrames={1}
        fps={60}
        width={1000}
        height={600}
      />
      <Composition
        id="Podcast-Intro"
        component={Podcast}
        durationInFrames={180}
        fps={60}
        width={1920}
        height={1080}
      />
      <Composition
        id="Podcast-Outro"
        component={Podcast}
        durationInFrames={360}
        fps={60}
        width={1920}
        height={1080}
      />
      <Composition
        id="GenericThumbnailImage"
        component={GenericThumbnailImage}
        durationInFrames={1}
        fps={60}
        width={1800}
        height={1200}
      />
      <Composition
        id="HashBackground"
        component={HashBackground}
        durationInFrames={1}
        fps={60}
        width={1920}
        height={1080}
      />
      <Composition
        id="SalesDocImage"
        component={SalesDocImage}
        durationInFrames={1}
        fps={60}
        width={1920}
        height={1080}
      />
    </>
  );
};