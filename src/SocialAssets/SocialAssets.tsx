/**
 * Social profile assets in Trophy Daylight, after the design system's
 * SocialAssets card and the content of the original Banner: the logo top
 * left, the homepage h1 and the G2 rating, on one hour's sky. Company and
 * personal headers share the design. Each is drawn at the platform's exact
 * size; keep text clear of the avatar and crop zones noted per layout.
 */
import { AbsoluteFill } from "remotion";
import { z } from "zod";
import { OgLogo } from "../og/OgLogo";
import { PEOPLE, type PersonKey } from "../og/people";
import { SKIES, type Sky } from "../og/constants";
import {
  ACCENT,
  DL,
  displayFont,
  G2Chip,
  Person,
  SkyFill,
  TrophyMark,
  type Treatment,
} from "./daylight";

const personEnum = z.enum(Object.keys(PEOPLE) as [PersonKey, ...PersonKey[]]);

export const headerSchema = z.object({
  headline: z.string(),
  /** The words of the headline set in the sky's accent, as on the site */
  highlight: z.string(),
  rating: z.number().min(0).max(5),
  sky: z.enum(SKIES),
  person: personEnum,
  treatment: z.enum(["dots", "backlit"]),
});
export type HeaderProps = z.infer<typeof headerSchema>;

/** The homepage h1 (web: NEXT_PUBLIC_HERO_H1 / _HIGHLIGHT) */
export const HEADER_DEFAULTS: HeaderProps = {
  headline: "The 1:1 customer engagement platform",
  highlight: "customer engagement",
  rating: 4.8,
  sky: "afternoon",
  person: "aisha",
  treatment: "dots",
};

type Layout = {
  /** The wordmark; null where the platform's own avatar already shows the logo */
  logo: { left: number; top: number; width: number } | null;
  person: { height: number; right: number };
  /**
   * The proof block. Right-aligned against the person by default; with
   * `left`, left-aligned from there and centred top to bottom.
   */
  proof: { right?: number; bottom?: number; left?: number; maxWidth: number; gap: number };
  headline: { size: number; line: number };
  chip: number;
};

type Platform = "linkedin-company" | "linkedin-personal" | "x";

const LAYOUT: Record<Platform, Layout> = {
  // 1584 × 288. The editor frames it at 5.5:1, the live Page shows 6:1
  // (about 12px off the top and bottom). The Page logo sits over x 48–368
  // from y 108, and is the logo, so no wordmark here: the proof starts
  // well clear of it and sits in the middle of the visible band.
  "linkedin-company": {
    logo: null,
    person: { height: 268, right: -12 },
    proof: { left: 448, maxWidth: 900, gap: 18 },
    headline: { size: 50, line: 56 },
    chip: 0.9,
  },
  // 1584 × 396. The profile photo covers the bottom left (about x 47–347, from y 221).
  "linkedin-personal": {
    logo: { left: 56, top: 52, width: 180 },
    person: { height: 372, right: -20 },
    proof: { right: 360, bottom: 64, maxWidth: 820, gap: 22 },
    headline: { size: 62, line: 64 },
    chip: 0.92,
  },
  // 1500 × 500. The avatar covers the bottom left; up to 60px may crop top and bottom.
  x: {
    logo: { left: 76, top: 92, width: 210 },
    person: { height: 440, right: -24 },
    proof: { right: 400, bottom: 96, maxWidth: 760, gap: 24 },
    headline: { size: 70, line: 72 },
    chip: 1,
  },
};

const Headline: React.FC<{ text: string; highlight: string; accent: string }> = ({
  text,
  highlight,
  accent,
}) => {
  const at = highlight ? text.indexOf(highlight) : -1;
  if (at < 0) return <>{text}</>;
  return (
    <>
      {text.slice(0, at)}
      <span style={{ color: accent }}>{highlight}</span>
      {text.slice(at + highlight.length)}
    </>
  );
};

const Header: React.FC<HeaderProps & { platform: Platform }> = ({
  platform,
  headline,
  highlight,
  rating,
  sky,
  person,
  treatment,
}) => {
  const l = LAYOUT[platform];
  const text = sky === "night" ? DL.onNight : DL.onSky;

  return (
    <AbsoluteFill style={{ overflow: "hidden" }}>
      <SkyFill sky={sky} />
      <Person
        who={person}
        sky={sky}
        treatment={treatment as Treatment}
        height={l.person.height}
        right={l.person.right}
      />
      {l.logo && (
        <div style={{ position: "absolute", ...l.logo, display: "flex" }}>
          <OgLogo width={l.logo.width} color={text} />
        </div>
      )}
      <div
        style={{
          position: "absolute",
          maxWidth: l.proof.maxWidth,
          display: "flex",
          flexDirection: "column",
          gap: l.proof.gap,
          ...(l.proof.left !== undefined
            ? {
                left: l.proof.left,
                top: 0,
                bottom: 0,
                justifyContent: "center",
                alignItems: "flex-start",
                textAlign: "left",
              }
            : {
                right: l.proof.right,
                bottom: l.proof.bottom,
                alignItems: "flex-end",
                textAlign: "right",
              }),
        }}
      >
        <div
          style={{
            fontFamily: displayFont,
            fontWeight: 400,
            fontSize: l.headline.size,
            lineHeight: `${l.headline.line}px`,
            letterSpacing: "-0.045em",
            color: text,
            textWrap: "balance",
          }}
        >
          <Headline text={headline} highlight={highlight} accent={ACCENT[sky]} />
        </div>
        <G2Chip rating={rating} scale={l.chip} />
      </div>
    </AbsoluteFill>
  );
};

/** Company Page cover, 1584 × 288 */
export const LinkedInCompanyCover: React.FC<HeaderProps> = (p) => (
  <Header {...p} platform="linkedin-company" />
);
/** Founders' and team's profile background, 1584 × 396 */
export const LinkedInPersonalBackground: React.FC<HeaderProps> = (p) => (
  <Header {...p} platform="linkedin-personal" />
);
/** X header, 1500 × 500: the same for the company and for people */
export const XHeader: React.FC<HeaderProps> = (p) => <Header {...p} platform="x" />;

/* Logo avatar: the mark on the sky, with room for the round crop ------------ */

export const logoAvatarSchema = z.object({ sky: z.enum(SKIES) });

export const SocialLogo: React.FC<{ sky: Sky }> = ({ sky }) => (
  <AbsoluteFill
    style={{ overflow: "hidden", alignItems: "center", justifyContent: "center" }}
  >
    <SkyFill sky={sky} />
    <div style={{ position: "relative", display: "flex" }}>
      <TrophyMark size={216}color={sky === "night" ? DL.onNight : DL.onSky} />
    </div>
  </AbsoluteFill>
);
