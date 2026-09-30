import React from "react";
import { Bell, Check } from "lucide-react";
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { AchievementToast } from "../components/app/AchievementToast";
import { LeaderboardCard } from "../components/app/LeaderboardCard";
import { PULSE, PulseLogo } from "../components/app/pulseTheme";
import { StreakCard } from "../components/app/StreakCard";
import { TabBar } from "../components/app/TabBar";
import { WorkoutCard } from "../components/app/WorkoutCard";
import { XpLevelCard } from "../components/app/XpLevelCard";
import { PHONE_HEIGHT, PhoneFrame } from "../components/PhoneFrame";
import { SceneBackground } from "../components/SceneBackground";
import { StepCaption } from "../components/StepCaption";
import { appFont, sansFont } from "../fonts";
import { COLORS } from "../script";

const TAP = 60;
const STREAK = TAP + 16;
const XP_FILL = TAP + 30;
const LEVEL_UP = XP_FILL + 44;
const ACHIEVEMENT_IN = LEVEL_UP + 40;
const ACHIEVEMENT_OUT = ACHIEVEMENT_IN + 130;
const RANK = ACHIEVEMENT_IN + 60;

const WORKOUT_START_SECONDS = 47 * 60 + 52;

export const MOBILE_DURATION = RANK + 140;

const CHECKLIST = [
  { label: "Weekly streak extended to 6 weeks", frame: STREAK + 10 },
  { label: "+10 XP · Level 3 unlocked", frame: LEVEL_UP + 10 },
  { label: "'25 Workouts' achievement", frame: ACHIEVEMENT_IN + 10 },
  { label: "Weekly rank #5 → #3", frame: RANK + 30 },
];

const ChecklistItem: React.FC<{
  label: string;
  frame: number;
  index: number;
}> = ({ label, frame: tickFrame, index }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const appear = spring({
    frame: frame - 30 - index * 8,
    fps,
    config: { damping: 18, mass: 0.5 },
  });
  const tick = spring({
    frame: frame - tickFrame,
    fps,
    config: { damping: 11, mass: 0.4, stiffness: 180 },
  });
  const ticked = frame >= tickFrame;

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 20,
        padding: "18px 26px 18px 18px",
        borderRadius: 20,
        backgroundColor: "#fff",
        border: `1px solid ${ticked ? "rgba(15, 23, 42, 0.22)" : COLORS.border}`,
        boxShadow: ticked
          ? "0 10px 28px -10px rgba(15, 23, 42, 0.25)"
          : "0 4px 14px rgba(15, 23, 42, 0.05)",
        opacity: appear,
        transform: `translateX(${(1 - appear) * -30}px) scale(${1 + Math.sin(Math.min(tick, 1) * Math.PI) * 0.03})`,
      }}
    >
      <div
        style={{
          width: 46,
          height: 46,
          borderRadius: 999,
          border: `2px solid ${ticked ? COLORS.ink : COLORS.border}`,
          backgroundColor: ticked ? COLORS.ink : "#fff",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
        }}
      >
        <Check
          size={26}
          color="#fff"
          strokeWidth={3.2}
          style={{ transform: `scale(${ticked ? tick : 0})` }}
        />
      </div>
      <span
        style={{
          fontSize: 34,
          fontWeight: 700,
          letterSpacing: "-0.01em",
          color: ticked ? COLORS.ink : COLORS.muted,
        }}
      >
        {label}
      </span>
    </div>
  );
};

const formatElapsed = (seconds: number) => {
  const minutes = Math.floor(seconds / 60);
  return `${minutes}:${String(Math.floor(seconds % 60)).padStart(2, "0")}`;
};

const AppHeader: React.FC = () => (
  <div style={{ padding: "4px 20px 16px" }}>
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        height: 44,
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <PulseLogo size={28} />
        <span
          style={{
            fontSize: 22,
            fontWeight: 800,
            letterSpacing: "-0.05em",
            color: PULSE.ink,
          }}
        >
          pulse
        </span>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
        <div style={{ position: "relative", display: "flex" }}>
          <Bell size={23} color={PULSE.ink} strokeWidth={2} />
          <div
            style={{
              position: "absolute",
              top: 0,
              right: 0,
              width: 8,
              height: 8,
              borderRadius: 999,
              backgroundColor: PULSE.brand,
              boxShadow: `0 0 0 2px ${PULSE.background}`,
            }}
          />
        </div>
        <div
          style={{
            width: 36,
            height: 36,
            borderRadius: 999,
            background: "linear-gradient(135deg, #ffb199 0%, #ff5a36 100%)",
            color: "#fff",
            fontSize: 14,
            fontWeight: 700,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          AM
        </div>
      </div>
    </div>
    <div style={{ marginTop: 10 }}>
      <div
        style={{
          fontSize: 13,
          fontWeight: 600,
          letterSpacing: "0.04em",
          color: PULSE.secondary,
        }}
      >
        THURSDAY, 2 OCTOBER
      </div>
      <div
        style={{
          fontSize: 34,
          fontWeight: 800,
          letterSpacing: "-0.035em",
          color: PULSE.ink,
          lineHeight: 1.15,
        }}
      >
        Today
      </div>
    </div>
  </div>
);

const PulseApp: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const press = interpolate(frame, [TAP - 4, TAP, TAP + 10], [0, 1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const ripple = interpolate(frame, [TAP, TAP + 30], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const fingerOpacity = interpolate(
    frame,
    [TAP - 24, TAP - 12, TAP + 12, TAP + 24],
    [0, 1, 1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );
  const xpFloat = interpolate(frame, [TAP + 6, TAP + 60], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const streak = spring({
    frame: frame - STREAK,
    fps,
    config: { damping: 14, mass: 0.5, stiffness: 120 },
  });
  const xpFill = interpolate(frame, [XP_FILL, XP_FILL + 36], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const levelUp = interpolate(frame, [LEVEL_UP, LEVEL_UP + 36], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const toastIn = spring({
    frame: frame - ACHIEVEMENT_IN,
    fps,
    config: { damping: 14, mass: 0.6, stiffness: 120 },
  });
  const toastOut = spring({
    frame: frame - ACHIEVEMENT_OUT,
    fps,
    config: { damping: 20, mass: 0.6 },
  });
  const rankMove = spring({
    frame: frame - RANK,
    fps,
    config: { damping: 16, mass: 0.8, stiffness: 80 },
  });

  const elapsed = formatElapsed(
    WORKOUT_START_SECONDS + Math.min(frame, TAP) / fps,
  );

  return (
    <AbsoluteFill style={{ paddingTop: 56, color: PULSE.ink }}>
      <AppHeader />

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 14,
          padding: "0 20px",
        }}
      >
        <WorkoutCard
          tapped={frame >= TAP}
          press={press}
          ripple={ripple}
          fingerOpacity={fingerOpacity}
          xpFloat={xpFloat}
          elapsed={elapsed}
        />
        <div style={{ display: "flex", gap: 12 }}>
          <StreakCard from={5} progress={streak} />
          <XpLevelCard
            fromXp={240}
            toXp={250}
            fill={xpFill}
            levelUp={levelUp}
          />
        </div>
        <div style={{ marginTop: 10 }}>
          <LeaderboardCard move={rankMove} scored={frame >= RANK} />
        </div>
      </div>

      <TabBar />
      <AchievementToast progress={toastIn * (1 - toastOut)} />
    </AbsoluteFill>
  );
};

export const MobileAppScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const phoneEnter = spring({
    frame: frame - 4,
    fps,
    config: { damping: 16, mass: 0.8, stiffness: 90 },
  });
  const zoom = interpolate(frame, [0, MOBILE_DURATION], [1, 1.04]);

  return (
    <SceneBackground>
      <AbsoluteFill
        style={{ transform: `scale(${zoom})`, fontFamily: sansFont }}
      >
        <div
          style={{
            position: "absolute",
            left: 130,
            top: 0,
            bottom: 0,
            width: 820,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            gap: 52,
          }}
        >
          <StepCaption
            eyebrow="The result"
            title="Gamification, live in your app"
            align="left"
          />
          <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
            {CHECKLIST.map((item, index) => (
              <ChecklistItem key={item.label} {...item} index={index} />
            ))}
          </div>
        </div>

        <div
          style={{
            position: "absolute",
            left: 1150,
            top: (1080 - PHONE_HEIGHT) / 2,
            opacity: phoneEnter,
            transform: `translateY(${(1 - phoneEnter) * 200}px) rotate(${(1 - phoneEnter) * 4}deg)`,
          }}
        >
          <PhoneFrame screenColor={PULSE.background} fontFamily={appFont}>
            <PulseApp />
          </PhoneFrame>
        </div>
      </AbsoluteFill>
    </SceneBackground>
  );
};
