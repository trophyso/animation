import React, { type ReactNode } from "react";
import {
    Check,
    CheckCheck,
    Dumbbell,
    Flame,
    GraduationCap,
    MessageCircle,
    PiggyBank,
    Rocket,
    ShoppingBag,
    Star,
    Trophy,
    Users,
    Wallet,
    type LucideIcon,
} from "lucide-react";
import { loadFont } from "@remotion/google-fonts/PlusJakartaSans";

const { fontFamily } = loadFont();

function compositionTileStyle(style?: React.CSSProperties): React.CSSProperties {
    return {
        position: "absolute",
        overflow: "hidden",
        borderRadius: 10,
        boxShadow: "0 4px 24px rgba(10,10,10,0.08)",
        ...style,
    };
}

function CompositionTile({
    style,
    children,
}: {
    style?: React.CSSProperties;
    children: ReactNode;
}) {
    return <div style={compositionTileStyle(style)}>{children}</div>;
}

const STREAK_DAYS = 12;
const weekDays: { label: string; state: "completed" | "missed" | "upcoming"; isToday?: boolean }[] = [
    { label: "M", state: "completed" },
    { label: "T", state: "completed" },
    { label: "W", state: "completed" },
    { label: "T", state: "missed" },
    { label: "F", state: "completed", isToday: true },
    { label: "S", state: "upcoming" },
    { label: "S", state: "upcoming" },
];

function DayIndicator({
    state,
}: {
    state: "completed" | "missed" | "upcoming";
}) {
    const background =
        state === "completed" ? "#ff7a00" : state === "missed" ? "rgba(27, 31, 35, 0.2)" : "#ffffff";
    return (
        <div
            style={{
                width: 28,
                height: 28,
                borderRadius: 999,
                background,
                border: state === "upcoming" ? "1px solid #d0d7de" : "none",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
            }}
        >
            {state === "completed" ? <Check size={14} color="#fff" strokeWidth={2.5} /> : null}
        </div>
    );
}

function StreakHomepageWidget({ label = "day streak" }: { label?: string }) {
    return (
        <div
            style={{
                width: "100%",
                display: "flex",
                flexDirection: "column",
                gap: 12,
                borderRadius: 10,
                border: "1px solid #d0d7de",
                backgroundColor: "#fff",
                padding: 12,
                fontFamily: fontFamily,
            }}
        >
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <div style={{ width: 40, height: 44, display: "flex", alignItems: "end", justifyContent: "center" }}>
                    <Flame size={40} color="#ff7a00" fill="#ff7a00" strokeWidth={1.25} />
                </div>
                <div style={{ minWidth: 0 }}>
                    <p
                        style={{
                            margin: 0,
                            fontSize: 24,
                            fontWeight: 700,
                            lineHeight: "24px",
                            letterSpacing: "-0.03em",
                            color: "#0f172a",
                        }}
                    >
                        {STREAK_DAYS}
                    </p>
                    <p style={{ margin: 0, marginTop: 4, fontSize: 13, color: "#667085" }}>{label}</p>
                </div>
            </div>
            <div
                style={{
                    display: "flex",
                    justifyContent: "space-between",
                    gap: 4,
                    borderRadius: 999,
                    backgroundColor: "#f3f4f6",
                    padding: "6px 10px",
                }}
            >
                {weekDays.map((day, index) => (
                    <div key={`${day.label}-${index}`} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
                        <DayIndicator state={day.state} />
                        <span style={{ fontSize: 10, lineHeight: "12px", fontWeight: day.isToday ? 700 : 500, color: day.isToday ? "#0f172a" : "#667085" }}>
                            {day.label}
                        </span>
                    </div>
                ))}
            </div>
        </div>
    );
}

const LEVEL = 5;
const NEXT_LEVEL = 6;
const CURRENT_XP = 750;
const TARGET_XP = 1000;
const CHART_Y_LABELS = [1000, 800, 600, 100] as const;
const CHART_AREA_PATH =
    "M0 56 C14 54 28 52 40 51 C55 49 65 46 78 45.6 C92 47 98 48 105 48.3 C118 44 128 38 140 33.6 C155 30 165 27 175 24 C190 18 200 13 210 9.6 L210 72 L0 72 Z";
const CHART_LINE_PATH =
    "M0 56 C14 54 28 52 40 51 C55 49 65 46 78 45.6 C92 47 98 48 105 48.3 C118 44 128 38 140 33.6 C155 30 165 27 175 24 C190 18 200 13 210 9.6";

function PointsHomepageWidget({ rankTitle = "Intermediate" }: { rankTitle?: string }) {
    const progress = Math.min(100, Math.round((CURRENT_XP / TARGET_XP) * 100));

    return (
        <div
            style={{
                width: "100%",
                display: "flex",
                flexDirection: "column",
                gap: 12,
                borderRadius: 10,
                border: "1px solid #d0d7de",
                backgroundColor: "#fff",
                padding: "14px 16px",
                boxShadow: "0 1px 3px rgba(10,10,10,0.04)",
                fontFamily: fontFamily,
            }}
        >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 8 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <div
                        style={{
                            width: 24,
                            height: 24,
                            borderRadius: 999,
                            backgroundColor: "#3b82f6",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                        }}
                    >
                        <Star size={12} color="#fff" fill="#fff" strokeWidth={2} />
                    </div>
                    <p style={{ margin: 0, fontSize: 14, fontWeight: 600, color: "#0f172a" }}>Level {LEVEL}</p>
                </div>
                <p style={{ margin: 0, fontSize: 13, fontWeight: 600, color: "#3b82f6" }}>{rankTitle}</p>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                <div
                    style={{
                        height: 6,
                        width: "100%",
                        borderRadius: 999,
                        border: "1px solid #d0d7de",
                        backgroundColor: "#f3f4f6",
                        overflow: "hidden",
                    }}
                >
                    <div style={{ width: `${progress}%`, height: "100%", backgroundColor: "#3b82f6", borderRadius: 999 }} />
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <p style={{ margin: 0, fontSize: 12, fontWeight: 500, color: "#667085" }}>
                        {CURRENT_XP.toLocaleString()} / {TARGET_XP.toLocaleString()} XP
                    </p>
                    <p style={{ margin: 0, fontSize: 12, fontWeight: 500, color: "#667085" }}>Level {NEXT_LEVEL}</p>
                </div>
            </div>

            <div style={{ display: "flex", height: 76, gap: 8 }}>
                <div style={{ height: 72, display: "flex", flexDirection: "column", justifyContent: "space-between", padding: "2px 0" }}>
                    {CHART_Y_LABELS.map((label) => (
                        <span key={label} style={{ width: 28, textAlign: "right", fontSize: 10, fontWeight: 500, lineHeight: "12px", color: "#667085" }}>
                            {label}
                        </span>
                    ))}
                </div>
                <div style={{ flex: 1, height: 72, display: "flex", alignItems: "end" }}>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 210 72" preserveAspectRatio="none" style={{ width: "100%", height: 72 }}>
                        <defs>
                            <linearGradient id="points-homepage-chart-fill" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="0%" stopColor="#3b82f6" stopOpacity={0.22} />
                                <stop offset="100%" stopColor="#3b82f6" stopOpacity={0} />
                            </linearGradient>
                        </defs>
                        <path d={CHART_AREA_PATH} fill="url(#points-homepage-chart-fill)" />
                        <path d={CHART_LINE_PATH} fill="none" stroke="#3b82f6" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                </div>
            </div>
        </div>
    );
}

const ACHIEVEMENT_BADGE_ICONS = {
    rocket: Rocket,
    "graduation-cap": GraduationCap,
    dumbbell: Dumbbell,
    "shopping-bag": ShoppingBag,
    wallet: Wallet,
    trophy: Trophy,
    users: Users,
    flame: Flame,
    star: Star,
    "message-circle": MessageCircle,
    "piggy-bank": PiggyBank,
    "check-check": CheckCheck,
} as const satisfies Record<string, LucideIcon>;

export type AchievementBadgeIcon = keyof typeof ACHIEVEMENT_BADGE_ICONS;

function HexBadge({ Icon }: { Icon: LucideIcon }) {
    return (
        <div
            style={{
                width: 86,
                aspectRatio: `${Math.sqrt(3)} / 2`,
                position: "relative",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
            }}
        >
            <svg
                viewBox="0 0 108 123.4700538379"
                preserveAspectRatio="xMidYMid meet"
                aria-hidden="true"
                style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}
            >
                <polygon
                    points="54,8 100,34.73502691895 100,88.73502691895 54,115.4700538379 8,88.73502691895 8,34.73502691895"
                    fill="rgba(54, 170, 52, 0.5)"
                />
                <polygon
                    points="54,14 94,37.2583302492 94,86.2117235887 54,109.4700538379 14,86.2117235887 14,37.2583302492"
                    fill="#4cc74a"
                />
            </svg>
            <div style={{ position: "relative", zIndex: 1 }}>
                <Icon size={34} color="#fff" strokeWidth={2.2} />
            </div>
        </div>
    );
}

function AchievementBadgeHomepageWidget({
    name = "Power user",
    description = "5,000 pts",
    icon = "rocket",
}: {
    name?: string;
    description?: string;
    icon?: AchievementBadgeIcon;
}) {
    const Icon = ACHIEVEMENT_BADGE_ICONS[icon];

    return (
        <div
            style={{
                width: "100%",
                minWidth: 0,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 12,
                borderRadius: 10,
                border: "1px solid #d0d7de",
                backgroundColor: "#fff",
                padding: "12px 24px",
                boxShadow: "0 1px 3px rgba(10,10,10,0.04)",
                fontFamily: fontFamily,
            }}
        >
            <HexBadge Icon={Icon} />
            <div style={{ width: "100%", minWidth: 0, textAlign: "center" }}>
                <p
                    style={{
                        margin: 0,
                        width: "100%",
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        fontSize: 13,
                        fontWeight: 600,
                        letterSpacing: "-0.01em",
                        color: "#0f172a",
                    }}
                >
                    {name}
                </p>
                <p
                    style={{
                        margin: 0,
                        marginTop: 2,
                        width: "100%",
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        fontSize: 11,
                        color: "#667085",
                    }}
                >
                    {description}
                </p>
            </div>
        </div>
    );
}

export type HeroCompositionConfig = {
    streak?: { label?: string };
    level?: { rankTitle?: string };
    achievement?: { name?: string; description?: string; icon?: AchievementBadgeIcon };
};

export function HeroHomepageComposition({
    composition,
    style,
}: {
    composition?: HeroCompositionConfig;
    style?: React.CSSProperties;
}) {
    return (
        <div
            style={{
                position: "relative",
                margin: "0 auto",
                width: "100%",
                maxWidth: 640,
                aspectRatio: "16 / 14",
                minHeight: "26rem",
                ...style,
            }}
            aria-hidden="true"
        >
            <CompositionTile
                style={{
                    right: 320,
                    top: "39%",
                    zIndex: 30,
                    width: "66%",
                    maxWidth: 292,
                    transformOrigin: "top left",
                    transform: "rotate(2deg)",
                }}
            >
                <StreakHomepageWidget label={composition?.streak?.label} />
            </CompositionTile>

            <CompositionTile
                style={{
                    right: "350",
                    top: "53%",
                    zIndex: 40,
                    width: "60%",
                    maxWidth: 280,
                    transformOrigin: "top left",
                    transform: "rotate(2deg)",
                }}
            >
                <PointsHomepageWidget rankTitle={composition?.level?.rankTitle} />
            </CompositionTile>

            <CompositionTile
                style={{
                    right: 295,
                    top: "54%",
                    zIndex: 50,
                    width: 160,
                    transformOrigin: "top left",
                    transform: "rotate(2deg) scale(1.05)",
                }}
            >
                <AchievementBadgeHomepageWidget
                    name={composition?.achievement?.name}
                    description={composition?.achievement?.description}
                    icon={composition?.achievement?.icon}
                />
            </CompositionTile>
        </div>
    );
}
