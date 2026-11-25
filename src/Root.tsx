import { Composition, Folder, Still } from "remotion";
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
import { SKIES, THUMBNAIL_SIZE } from "./og/constants";
import { PEOPLE, type PersonKey } from "./og/people";
import { HashBackground } from "./HashBackground/HashBackgroundComposition";
import { GenericFeatureLaunch } from "./GenericFeatureLaunch/GenericFeatureLaunch";
import { SalesDocImage } from "./SalesDocImage/SalesDocImage";
import { Widget_StreakEmailTemplate } from "./Widget_StreakEmailTemplate/Widget_StreakEmailTemplate";
import { Widget_AchievementPushNotification } from "./Widget_AchievementPushNotification/Widget_AchievementPushNotification";
import { Widget_StreakPushNotification } from "./Widget_StreakPushNotification/Widget_StreakPushNotification";
import { Widget_ReactivationPushNotification } from "./Widget_ReactivationPushNotification/Widget_ReactivationPushNotification";
import { Widget_RecapPushNotification } from "./Widget_RecapPushNotification/Widget_RecapPushNotification";
import { z } from "zod";
import { HeroHomepageComposition } from "./HeroHomepageComposition/HeroHomepageComposition";
import { Banner } from "./Banner/Banner";
import {
  HEADER_DEFAULTS,
  headerSchema,
  LinkedInCompanyCover,
  LinkedInPersonalBackground,
  logoAvatarSchema,
  SocialLogo,
  XHeader,
  G2Banner,
  YouTubeBanner,
} from "./SocialAssets/SocialAssets";
import {
  McpLaunchVideo,
  MCP_LAUNCH_VIDEO_DURATION,
} from "./McpLaunchVideo/McpLaunchVideo";
import { INTRO_DURATION, IntroScene } from "./McpLaunchVideo/scenes/IntroScene";
import { SERVERS_DURATION, ServersScene } from "./McpLaunchVideo/scenes/ServersScene";
import { CHAT_DURATION, ChatScene } from "./McpLaunchVideo/scenes/ChatScene";
import { CODING_DURATION, CodingAgentScene } from "./McpLaunchVideo/scenes/CodingAgentScene";
import { MOBILE_DURATION, MobileAppScene } from "./McpLaunchVideo/scenes/MobileAppScene";
import { OUTRO_DURATION, OutroScene } from "./McpLaunchVideo/scenes/OutroScene";
import {
  AccountShot,
  ChatShot,
  CodingAgentShot,
  DocsShot,
  IntroShot,
} from "./McpLaunchShots/McpLaunchShots";
import { SHOT_HEIGHT, SHOT_WIDTH } from "./McpLaunchShots/ShotLayout";
import {
  RewardsLaunchVideo,
  REWARDS_LAUNCH_VIDEO_DURATION,
} from "./RewardsLaunchVideo/RewardsLaunchVideo";
import { INTRO_DURATION as REWARDS_INTRO_DURATION, IntroScene as RewardsIntroScene } from "./RewardsLaunchVideo/scenes/IntroScene";
import { TRIGGERS_DURATION, TriggersScene } from "./RewardsLaunchVideo/scenes/TriggersScene";
import { TYPES_DURATION, TypesScene } from "./RewardsLaunchVideo/scenes/TypesScene";
import { CLAIM_DURATION, ClaimScene } from "./RewardsLaunchVideo/scenes/ClaimScene";
import { CODE_DURATION, CodeScene } from "./RewardsLaunchVideo/scenes/CodeScene";
import { OUTRO_DURATION as REWARDS_OUTRO_DURATION, OutroScene as RewardsOutroScene } from "./RewardsLaunchVideo/scenes/OutroScene";
import {
  DEFAULT_VIDEO as OAPU_DEFAULT,
  ONE_AGENT_SCENES as OAPU_SCENES,
  OneAgentPerUser,
  OneAgentPerUserScene,
  calculateVideoMetadata as oapuMetadata,
  sceneDuration as oapuSceneDuration,
  videoSchema as oapuSchema,
} from "./OneAgentPerUser/OneAgentPerUser";
import { STORIES as OAPU_STORIES, STORY_KEYS as OAPU_STORY_KEYS } from "./OneAgentPerUser/stories";
import { OneAgentPerUserThumbnail } from "./OneAgentPerUser/Thumbnail";

const achievementBadgeIconSchema = z.enum([
  "rocket",
  "graduation-cap",
  "dumbbell",
  "shopping-bag",
  "wallet",
  "trophy",
  "users",
  "flame",
  "star",
  "message-circle",
  "piggy-bank",
  "check-check",
]);

const achievementConfigSchema = z.object({
  name: z.string().optional(),
  description: z.string().optional(),
  icon: achievementBadgeIconSchema.optional(),
  color: z.string().optional(),
});

const heroCompositionConfigSchema = z.object({
  streak: z.object({ label: z.string().optional() }).optional(),
  level: z.object({ rankTitle: z.string().optional() }).optional(),
  achievement: achievementConfigSchema.optional(),
  achievement2: achievementConfigSchema.optional(),
});

export const RemotionRoot: React.FC = () => {
  return (
    <>
      {/* "One agent per user": switch story and sky in the props panel */}
      <Composition
        id="OneAgentPerUser"
        component={OneAgentPerUser}
        schema={oapuSchema}
        defaultProps={OAPU_DEFAULT}
        calculateMetadata={oapuMetadata}
        durationInFrames={1}
        fps={60}
        width={1920}
        height={1080}
      />
      <Folder name="OneAgentPerUser-Stories">
        {OAPU_STORY_KEYS.map((key) => (
          <Composition
            key={key}
            id={`OneAgentPerUser-${OAPU_STORIES[key].name}`}
            component={OneAgentPerUser}
            schema={oapuSchema}
            defaultProps={{ story: key, sky: "story" as const }}
            calculateMetadata={oapuMetadata}
            durationInFrames={1}
            fps={60}
            width={1920}
            height={1080}
          />
        ))}
      </Folder>
      {/* A thumbnail per video: the story's sky, person and website headline */}
      <Folder name="OneAgentPerUser-Thumbnails">
        <Still id="OneAgentPerUser-Thumbnail" component={OneAgentPerUserThumbnail} width={THUMBNAIL_SIZE.width} height={THUMBNAIL_SIZE.height} />
        {OAPU_STORY_KEYS.map((key) => (
          <Still
            key={key}
            id={`OneAgentPerUser-${OAPU_STORIES[key].name}-Thumbnail`}
            component={OneAgentPerUserThumbnail}
            defaultProps={{ story: key }}
            width={THUMBNAIL_SIZE.width}
            height={THUMBNAIL_SIZE.height}
          />
        ))}
      </Folder>
      <Folder name="OneAgentPerUser-Scenes">
        {OAPU_SCENES.map(([scene, name]) => (
          <Composition
            key={scene}
            id={`OneAgentPerUser-${name.replace(/\s+/g, "")}`}
            component={OneAgentPerUserScene}
            defaultProps={{ ...OAPU_DEFAULT, scene }}
            durationInFrames={oapuSceneDuration(scene)}
            fps={60}
            width={1920}
            height={1080}
          />
        ))}
      </Folder>
      <Composition
        id="LaunchVideo"
        component={LaunchVideo}
        durationInFrames={2200}
        fps={60}
        width={1920}
        height={1080}
      />
      <Composition
        id="McpLaunchVideo"
        component={McpLaunchVideo}
        durationInFrames={MCP_LAUNCH_VIDEO_DURATION}
        fps={60}
        width={1920}
        height={1080}
      />
      <Folder name="McpLaunchVideo-Scenes">
        <Composition
          id="McpLaunchVideo-Intro"
          component={IntroScene}
          durationInFrames={INTRO_DURATION}
          fps={60}
          width={1920}
          height={1080}
        />
        <Composition
          id="McpLaunchVideo-Servers"
          component={ServersScene}
          durationInFrames={SERVERS_DURATION}
          fps={60}
          width={1920}
          height={1080}
        />
        <Composition
          id="McpLaunchVideo-Chat"
          component={ChatScene}
          durationInFrames={CHAT_DURATION}
          fps={60}
          width={1920}
          height={1080}
        />
        <Composition
          id="McpLaunchVideo-CodingAgent"
          component={CodingAgentScene}
          durationInFrames={CODING_DURATION}
          fps={60}
          width={1920}
          height={1080}
        />
        <Composition
          id="McpLaunchVideo-MobileApp"
          component={MobileAppScene}
          durationInFrames={MOBILE_DURATION}
          fps={60}
          width={1920}
          height={1080}
        />
        <Composition
          id="McpLaunchVideo-Outro"
          component={OutroScene}
          durationInFrames={OUTRO_DURATION}
          fps={60}
          width={1920}
          height={1080}
        />
      </Folder>
      <Composition
        id="RewardsLaunchVideo"
        component={RewardsLaunchVideo}
        durationInFrames={REWARDS_LAUNCH_VIDEO_DURATION}
        fps={60}
        width={1920}
        height={1080}
      />
      <Folder name="RewardsLaunchVideo-Scenes">
        {[
          ["RewardsLaunchVideo-Intro", RewardsIntroScene, REWARDS_INTRO_DURATION],
          ["RewardsLaunchVideo-Triggers", TriggersScene, TRIGGERS_DURATION],
          ["RewardsLaunchVideo-Types", TypesScene, TYPES_DURATION],
          ["RewardsLaunchVideo-Claim", ClaimScene, CLAIM_DURATION],
          ["RewardsLaunchVideo-Code", CodeScene, CODE_DURATION],
          ["RewardsLaunchVideo-Outro", RewardsOutroScene, REWARDS_OUTRO_DURATION],
        ].map(([id, component, duration]) => (
          <Composition
            key={id as string}
            id={id as string}
            component={component as React.FC}
            durationInFrames={duration as number}
            fps={60}
            width={1920}
            height={1080}
          />
        ))}
      </Folder>
      <Folder name="McpLaunchShots">
        {[
          ["McpLaunchShot-1-Intro", IntroShot],
          ["McpLaunchShot-2-Docs", DocsShot],
          ["McpLaunchShot-3-Account", AccountShot],
          ["McpLaunchShot-4-Chat", ChatShot],
          ["McpLaunchShot-5-CodingAgent", CodingAgentShot],
        ].map(([id, component]) => (
          <Composition
            key={id as string}
            id={id as string}
            component={component as React.FC}
            durationInFrames={1}
            fps={60}
            width={SHOT_WIDTH}
            height={SHOT_HEIGHT}
          />
        ))}
      </Folder>
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
        id="Widget-AchievementPushNotification"
        component={Widget_AchievementPushNotification}
        durationInFrames={1}
        fps={60}
        width={1000}
        height={900}
      />
      <Composition
        id="Widget-StreakPushNotification"
        component={Widget_StreakPushNotification}
        durationInFrames={1}
        fps={60}
        width={1000}
        height={900}
      />
      <Composition
        id="Widget-ReactivationPushNotification"
        component={Widget_ReactivationPushNotification}
        durationInFrames={1}
        fps={60}
        width={1000}
        height={900}
      />
      <Composition
        id="Widget-RecapPushNotification"
        component={Widget_RecapPushNotification}
        durationInFrames={1}
        fps={60}
        width={1000}
        height={900}
      />
      <Composition
        id="HeroHomepageComposition"
        component={HeroHomepageComposition}
        durationInFrames={1}
        fps={60}
        width={1280}
        height={1120}
        schema={z.object({
          composition: heroCompositionConfigSchema.optional(),
        })}
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
        width={1200}
        height={627}

      />
      <Composition
        id="GenericThumbnailImage"
        component={GenericThumbnailImage}
        durationInFrames={1}
        fps={60}
        width={THUMBNAIL_SIZE.width}
        height={THUMBNAIL_SIZE.height}
        defaultProps={{
          title: "Enter title here",
        }}
        schema={z.object({
          title: z.string(),
          sky: z.enum(SKIES).optional(),
          person: z
            .enum(Object.keys(PEOPLE) as [PersonKey, ...PersonKey[]])
            .optional(),
        })}
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
        id="GenericFeatureLaunch"
        component={GenericFeatureLaunch}
        durationInFrames={240}
        fps={60}
        width={1500}
        height={1500}
        defaultProps={{
          imagePath: "assets/leaderboard_schedule_form.png",
          code: 'import { TrophyApiClient } from "@trophyso/node";\n\nconst trophy = new TrophyApiClient({\n  apiKey: process.env.TROPHY_ADMIN_API_KEY as string,\n});\n\n// Create an API key scoped to user_123\nawait trophy.admin.applicationApiKeys.create([\n  { userId: "user_123" }\n]);',
          codeLanguage: "typescript",
          codeFilename: "client.ts",
          title: "New client-safe application API keys",
        }}
        schema={z.object({
          imagePath: z.string(),
          code: z.string(),
          codeLanguage: z.string(),
          codeFilename: z.string(),
          title: z.string(),
        })}
      />
      <Composition
        id="SalesDocImage"
        component={SalesDocImage}
        durationInFrames={1}
        fps={60}
        width={1920}
        height={1080}
      />
      <Folder name="SocialAssets-Daylight">
        <Composition
          id="Daylight-LinkedInCompanyCover"
          component={LinkedInCompanyCover}
          durationInFrames={1}
          fps={60}
          width={1584}
          height={288}
          defaultProps={HEADER_DEFAULTS}
          schema={headerSchema}
        />
        <Composition
          id="Daylight-LinkedInPersonalBackground"
          component={LinkedInPersonalBackground}
          durationInFrames={1}
          fps={60}
          width={1584}
          height={396}
          defaultProps={HEADER_DEFAULTS}
          schema={headerSchema}
        />
        <Composition
          id="Daylight-XHeader"
          component={XHeader}
          durationInFrames={1}
          fps={60}
          width={1500}
          height={500}
          defaultProps={HEADER_DEFAULTS}
          schema={headerSchema}
        />
        <Composition
          id="Daylight-G2Banner"
          component={G2Banner}
          durationInFrames={1}
          fps={60}
          width={1270}
          height={240}
          defaultProps={HEADER_DEFAULTS}
          schema={headerSchema}
        />
        <Composition
          id="Daylight-YouTubeBanner"
          component={YouTubeBanner}
          durationInFrames={1}
          fps={60}
          width={2048}
          height={1152}
          defaultProps={HEADER_DEFAULTS}
          schema={headerSchema}
        />
        <Composition
          id="Daylight-SocialLogo"
          component={SocialLogo}
          durationInFrames={1}
          fps={60}
          width={400}
          height={400}
          defaultProps={{ sky: "afternoon" as const }}
          schema={logoAvatarSchema}
        />
      </Folder>
      <Composition
        id="LinkedInCompanyBanner"
        component={Banner}
        durationInFrames={1}
        fps={60}
        width={1512}
        height={256}
        defaultProps={{
          headline: "Powering gamification for 1M+ users",
          rating: 5,
        }}
        schema={z.object({
          headline: z.string(),
          rating: z.number().min(0).max(5),
        })}
      />
      <Composition
        id="LinkedInProfileBanner"
        component={Banner}
        durationInFrames={1}
        fps={60}
        width={1584}
        height={396}
        defaultProps={{
          headline: "Powering gamification for 1M+ users",
          rating: 5,
        }}
        schema={z.object({
          headline: z.string(),
          rating: z.number().min(0).max(5),
        })}
      />
      <Composition
        id="TwitterBanner"
        component={Banner}
        durationInFrames={1}
        fps={60}
        width={1500}
        height={500}
        defaultProps={{
          headline: "Powering gamification for 1M+ users",
          rating: 5,
        }}
        schema={z.object({
          headline: z.string(),
          rating: z.number().min(0).max(5),
        })}
      />
      <Composition
        id="YouTubeBanner"
        component={Banner}
        durationInFrames={1}
        fps={60}
        width={2048}
        height={1152}
        defaultProps={{
          headline: "Powering gamification for 1M+ users",
          rating: 5,
        }}
        schema={z.object({
          headline: z.string(),
          rating: z.number().min(0).max(5),
        })}
      />
    </>
  );
};
