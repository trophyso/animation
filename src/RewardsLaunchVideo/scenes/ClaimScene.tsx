import React from "react";
import { Check, Coins, Crown, Flame, Gift, Ticket } from "lucide-react";
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { PULSE, PULSE_CARD, PulseLogo } from "../../McpLaunchVideo/components/app/pulseTheme";
import { TabBar } from "../../McpLaunchVideo/components/app/TabBar";
import { PHONE_HEIGHT, PhoneFrame } from "../../McpLaunchVideo/components/PhoneFrame";
import { SceneBackground } from "../../McpLaunchVideo/components/SceneBackground";
import { appFont, sansFont } from "../../McpLaunchVideo/fonts";
import { Caption } from "../components/Caption";
import { Confetti } from "../components/Confetti";
import { COLORS, GOLD, TRANSITION_FRAMES } from "../script";

const TAP = 84;
const BURST = TAP + 6;
const XP_COUNT = BURST + 24;
const OVERLAY_OUT = BURST + 120;

export const CLAIM_DURATION = OVERLAY_OUT + 90;

const FROM_XP = 1240;
const REWARD_XP = 500;

const GOLD_GRADIENT = `linear-gradient(145deg, #ffd978 0%, ${GOLD} 55%, #d9820b 100%)`;

const formatXp = (xp: number) =>
  Math.round(xp).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");

const SectionLabel: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div
    style={{
      fontSize: 13,
      fontWeight: 700,
      letterSpacing: "0.06em",
      color: PULSE.secondary,
      padding: "0 4px",
    }}
  >
    {children}
  </div>
);

const RewardRow: React.FC<{
  icon: React.ReactNode;
  iconBackground: string;
  name: string;
  detail: string;
  value: string;
  children?: React.ReactNode;
  style?: React.CSSProperties;
}> = ({ icon, iconBackground, name, detail, value, children, style }) => (
  <div
    style={{
      ...PULSE_CARD,
      padding: 16,
      display: "flex",
      flexDirection: "column",
      gap: 14,
      ...style,
    }}
  >
    <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
      <div
        style={{
          width: 52,
          height: 52,
          borderRadius: 16,
          background: iconBackground,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
        }}
      >
        {icon}
      </div>
      <div style={{ display: "flex", flexDirection: "column", flex: 1, gap: 2 }}>
        <span style={{ fontSize: 18, fontWeight: 700, letterSpacing: "-0.01em" }}>
          {name}
        </span>
        <span style={{ fontSize: 14, fontWeight: 500, color: PULSE.secondary }}>
          {detail}
        </span>
      </div>
      <span
        style={{
          fontSize: 17,
          fontWeight: 800,
          color: PULSE.ink,
          letterSpacing: "-0.02em",
        }}
      >
        {value}
      </span>
    </div>
    {children}
  </div>
);

const ClaimButton: React.FC<{ claimed: boolean; press: number; finger: number }> = ({
  claimed,
  press,
  finger,
}) => (
  <div
    style={{
      position: "relative",
      height: 48,
      borderRadius: 14,
      backgroundColor: claimed ? PULSE.fill : PULSE.brand,
      color: claimed ? PULSE.secondary : "#fff",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      gap: 8,
      fontSize: 17,
      fontWeight: 700,
      transform: `scale(${1 - press * 0.05})`,
    }}
  >
    {claimed ? <Check size={18} strokeWidth={3} /> : <Gift size={18} strokeWidth={2.6} />}
    {claimed ? "Claimed" : "Claim reward"}
    <div
      style={{
        position: "absolute",
        left: "58%",
        top: 6,
        width: 56,
        height: 56,
        borderRadius: 999,
        backgroundColor: "rgba(17, 17, 20, 0.28)",
        border: "2px solid rgba(255, 255, 255, 0.8)",
        opacity: finger,
        transform: `scale(${1 - press * 0.15})`,
      }}
    />
  </div>
);

const CelebrationOverlay: React.FC<{ frame: number }> = ({ frame }) => {
  const { fps } = useVideoConfig();
  const local = frame - BURST;
  if (local < 0) return null;

  const pop = spring({ frame: local, fps, config: { damping: 9, mass: 0.6, stiffness: 140 } });
  const out = spring({ frame: frame - OVERLAY_OUT, fps, config: { damping: 20, mass: 0.6 } });
  const visible = pop * (1 - out);
  const shine = (local * 1.5) % 360;

  return (
    <AbsoluteFill style={{ zIndex: 70 }}>
      <AbsoluteFill
        style={{ backgroundColor: "rgba(17, 17, 20, 0.45)", opacity: Math.min(1, local / 8) * (1 - out) }}
      />
      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center" }}>
        <div
          style={{
            width: 340,
            padding: "40px 28px 32px",
            borderRadius: 32,
            backgroundColor: "#fff",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 10,
            boxShadow: "0 30px 60px -16px rgba(0, 0, 0, 0.45)",
            opacity: Math.min(1, visible * 1.4),
            transform: `scale(${0.5 + visible * 0.5}) translateY(${out * 40}px)`,
          }}
        >
          <div style={{ position: "relative", width: 120, height: 120, marginBottom: 10 }}>
            <div
              style={{
                position: "absolute",
                inset: -40,
                borderRadius: 999,
                background: `conic-gradient(from ${shine}deg, rgba(245,165,36,0.35) 0deg, transparent 30deg, rgba(245,165,36,0.35) 60deg, transparent 90deg, rgba(245,165,36,0.35) 120deg, transparent 150deg, rgba(245,165,36,0.35) 180deg, transparent 210deg, rgba(245,165,36,0.35) 240deg, transparent 270deg, rgba(245,165,36,0.35) 300deg, transparent 330deg)`,
                maskImage: "radial-gradient(circle, white 30%, transparent 70%)",
                WebkitMaskImage: "radial-gradient(circle, white 30%, transparent 70%)",
              }}
            />
            <div
              style={{
                position: "absolute",
                inset: 0,
                borderRadius: 999,
                background: GOLD_GRADIENT,
                boxShadow: "0 12px 26px -8px rgba(217, 130, 11, 0.6)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                transform: `rotate(${(1 - pop) * -40}deg)`,
              }}
            >
              <Crown size={60} color="#fff" strokeWidth={2.4} />
            </div>
          </div>
          <span style={{ fontSize: 15, fontWeight: 700, letterSpacing: "0.06em", color: PULSE.secondary }}>
            REWARD CLAIMED
          </span>
          <span style={{ fontSize: 60, fontWeight: 800, letterSpacing: "-0.05em", color: "#d9820b", lineHeight: 1 }}>
            +{REWARD_XP} XP
          </span>
          <span style={{ fontSize: 17, fontWeight: 600, color: PULSE.ink }}>
            Weekly Champion bonus
          </span>
        </div>
      </AbsoluteFill>
      <Confetti frame={local} x={224} y={400} />
    </AbsoluteFill>
  );
};

const RewardsApp: React.FC = () => {
  const frame = useCurrentFrame() - TRANSITION_FRAMES;

  const press = interpolate(frame, [TAP - 4, TAP, TAP + 10], [0, 1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const finger = interpolate(frame, [TAP - 24, TAP - 12, TAP + 10, TAP + 20], [0, 1, 1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const xp = interpolate(frame, [XP_COUNT, XP_COUNT + 50], [FROM_XP, FROM_XP + REWARD_XP], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const xpBump = Math.sin(
    interpolate(frame, [XP_COUNT, XP_COUNT + 50], [0, Math.PI], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    }),
  );
  const claimed = frame >= TAP + 4;

  return (
    <AbsoluteFill style={{ paddingTop: 56, color: PULSE.ink }}>
      <div style={{ padding: "4px 20px 18px" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", height: 44 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <PulseLogo size={28} />
            <span style={{ fontSize: 22, fontWeight: 800, letterSpacing: "-0.05em" }}>pulse</span>
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 6,
              padding: "6px 12px",
              borderRadius: 999,
              backgroundColor: "#fff4dd",
              color: "#b26b06",
              fontSize: 16,
              fontWeight: 800,
              fontVariantNumeric: "tabular-nums",
              transform: `scale(${1 + xpBump * 0.18})`,
            }}
          >
            <Coins size={18} strokeWidth={2.6} />
            {formatXp(xp)} XP
          </div>
        </div>
        <div style={{ fontSize: 34, fontWeight: 800, letterSpacing: "-0.035em", marginTop: 12 }}>
          Rewards
        </div>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 12, padding: "0 20px" }}>
        <SectionLabel>READY TO CLAIM</SectionLabel>
        <RewardRow
          icon={<Crown size={28} color="#fff" strokeWidth={2.4} />}
          iconBackground={GOLD_GRADIENT}
          name="Weekly Champion"
          detail="Finished #1 in Weekly Workouts"
          value="+500 XP"
          style={{ boxShadow: claimed ? PULSE_CARD.boxShadow : `0 0 0 2px ${PULSE.brand}, 0 10px 24px -10px rgba(255, 90, 54, 0.5)` }}
        >
          <ClaimButton claimed={claimed} press={press} finger={finger} />
        </RewardRow>
        <RewardRow
          icon={<Ticket size={26} color="#fff" strokeWidth={2.4} />}
          iconBackground={PULSE.purple}
          name="30-day streak"
          detail="20% off Pulse Pro"
          value="20% off"
        >
          <ClaimButton claimed={false} press={0} finger={0} />
        </RewardRow>
        <div style={{ height: 6 }} />
        <SectionLabel>UP NEXT</SectionLabel>
        <RewardRow
          icon={<Flame size={26} color="#fff" strokeWidth={2.4} />}
          iconBackground={PULSE.brand}
          name="Marathon month"
          detail="18 of 30 workouts"
          value="Free month"
        >
          <div style={{ height: 10, borderRadius: 999, backgroundColor: PULSE.fill, overflow: "hidden" }}>
            <div style={{ width: "60%", height: "100%", borderRadius: 999, backgroundColor: PULSE.brand }} />
          </div>
        </RewardRow>
        <div style={{ height: 6 }} />
        <SectionLabel>CLAIMED</SectionLabel>
        <RewardRow
          icon={<Gift size={26} color={PULSE.secondary} strokeWidth={2.4} />}
          iconBackground={PULSE.fill}
          name="Welcome bonus"
          detail="Completed your first workout"
          value="+100 XP"
          style={{ opacity: 0.6 }}
        />
      </div>

      <TabBar active="Compete" />
      <CelebrationOverlay frame={frame} />
    </AbsoluteFill>
  );
};

export const ClaimScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const phoneEnter = spring({
    frame: frame - TRANSITION_FRAMES,
    fps,
    config: { damping: 16, mass: 0.8, stiffness: 90 },
  });
  const zoom = interpolate(frame, [0, CLAIM_DURATION], [1, 1.04]);

  return (
    <SceneBackground>
      <AbsoluteFill style={{ transform: `scale(${zoom})`, fontFamily: sansFont }}>
        <div
          style={{
            position: "absolute",
            left: 150,
            top: 0,
            bottom: 0,
            width: 860,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
          }}
        >
          <Caption
            eyebrow="Redeemed in your app"
            title={
              <>
                Let users
                <br />
                <span style={{ color: COLORS.green }}>claim it</span>
              </>
            }
            subtitle="Rewards wait until users redeem them, giving you a built-in moment to celebrate."
            align="left"
            delay={TRANSITION_FRAMES}
          />
        </div>

        <div
          style={{
            position: "absolute",
            left: 1190,
            top: (1080 - PHONE_HEIGHT) / 2,
            opacity: phoneEnter,
            transform: `translateY(${(1 - phoneEnter) * 200}px) rotate(${(1 - phoneEnter) * 4}deg)`,
          }}
        >
          <PhoneFrame screenColor={PULSE.background} fontFamily={appFont}>
            <RewardsApp />
          </PhoneFrame>
        </div>
      </AbsoluteFill>
    </SceneBackground>
  );
};
