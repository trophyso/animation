import React from "react";

/**
 * Mock app icons (web src/components/widgets/app-icon.tsx): a squircle with the
 * app's own gradient and an original mark at 60%. Never a raw UI icon on a tile.
 */
export type AppName = "Runr" | "Learnr" | "Snapr" | "Wordplay" | "Flyway" | "Roastery";

const APPS: Record<AppName, { from: string; to: string; ink?: string; mark: (ink: string, cut: string) => React.ReactNode }> = {
  Runr: {
    from: "#FF8A4C",
    to: "#EF3B2D",
    mark: (ink) => <path fill={ink} d="M4.6 18.5 9.9 5.5h3.3l-5.3 13Zm6.2 0 5.3-13h3.3l-5.3 13Z" />,
  },
  Learnr: {
    from: "#7C79FA",
    to: "#4338CA",
    mark: (ink) => (
      <path fill={ink} d="M3 6.6c2.7-1.6 5.6-1.6 8.3.3v12.3c-2.7-1.7-5.6-1.7-8.3-.4Zm18 0c-2.7-1.6-5.6-1.6-8.3.3v12.3c2.7-1.7 5.6-1.7 8.3-.4Z" />
    ),
  },
  Snapr: {
    from: "#F472B6",
    to: "#9B4DF2",
    mark: (ink, cut) => (
      <>
        <path
          fill={ink}
          d="M5.2 4.6h13.6A2.2 2.2 0 0 1 21 6.8v8.4a2.2 2.2 0 0 1-2.2 2.2h-6.6l-4.4 3.6v-3.6h-2.6A2.2 2.2 0 0 1 3 15.2V6.8a2.2 2.2 0 0 1 2.2-2.2Z"
        />
        <path fill={cut} d="m12 14.4-2.9-2.8a1.8 1.8 0 0 1 2.6-2.5l.3.3.3-.3a1.8 1.8 0 0 1 2.6 2.5Z" />
      </>
    ),
  },
  // Flights: a plane climbing to the right
  Flyway: {
    from: "#6E8BFF",
    to: "#2E3BB8",
    mark: (ink) => (
      <path
        fill={ink}
        transform="rotate(45 12 12)"
        d="M12 2.5c.9 0 1.5.8 1.5 1.8v5.2l7 4.2v2l-7-2.2v4.3l2 1.5v1.6l-3.5-1-3.5 1v-1.6l2-1.5v-4.3l-7 2.2v-2l7-4.2V4.3c0-1 .6-1.8 1.5-1.8Z"
      />
    ),
  },
  // Coffee: a bean
  Roastery: {
    from: "#B07A52",
    to: "#5E351C",
    ink: "#F6E7D3",
    mark: (ink, cut) => (
      <>
        <ellipse cx="12" cy="12" rx="6.2" ry="8.6" transform="rotate(35 12 12)" fill={ink} />
        <path d="M9.4 17.6c1.9-1.7 1.2-3.8 2.6-5.6s3.4-2.2 2.6-5.6" fill="none" stroke={cut} strokeWidth="1.4" strokeLinecap="round" />
      </>
    ),
  },
  Wordplay: {
    from: "#5EC8F2",
    to: "#1E6FD9",
    mark: (ink, cut) => (
      <>
        <rect x="4" y="4" width="7" height="7" rx="1.6" fill={ink} />
        <rect x="13" y="4" width="7" height="7" rx="1.6" fill={ink} opacity="0.55" />
        <rect x="4" y="13" width="7" height="7" rx="1.6" fill={ink} opacity="0.55" />
        <rect x="13" y="13" width="7" height="7" rx="1.6" fill={ink} />
        <path d="m5.8 7.6 1.4 1.4 2.4-2.6" fill="none" stroke={cut} strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
      </>
    ),
  },
};

export const AppIcon: React.FC<{ app: AppName; size?: number; style?: React.CSSProperties }> = ({ app, size = 40, style }) => {
  const a = APPS[app];
  const ink = a.ink ?? "#FFFFFF";
  return (
    <span
      style={{
        position: "relative",
        display: "grid",
        placeItems: "center",
        width: size,
        height: size,
        flex: "none",
        overflow: "hidden",
        borderRadius: "23%",
        backgroundImage: `linear-gradient(145deg, ${a.from}, ${a.to})`,
        boxShadow: "inset 0 0 0 0.5px rgba(0,0,0,0.12), 0 1px 2px rgba(22,22,29,0.14)",
        ...style,
      }}
    >
      <span
        style={{
          position: "absolute",
          inset: 0,
          borderRadius: "inherit",
          background: "linear-gradient(180deg, rgba(255,255,255,0.18), transparent 55%)",
          pointerEvents: "none",
        }}
      />
      <svg viewBox="0 0 24 24" width={size * 0.6} height={size * 0.6} style={{ position: "relative" }}>
        {a.mark(ink, a.to)}
      </svg>
    </span>
  );
};
