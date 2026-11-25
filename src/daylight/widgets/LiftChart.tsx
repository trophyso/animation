import React from "react";
import { monoFont, sansFont } from "../fonts";
import { alpha, type Theme } from "../tokens";

/**
 * The web DlChart "holdoutLine" at video scale: two polylines (Holdout in
 * data[2], Agent in data[0] drawn last), 25%/50% grid, a 0% baseline, mono
 * ticks, end dots with a raised stroke and Sans end labels. Every reveal is a
 * per-frame value passed in: the lines are clipped by SVG <clipPath> rects
 * whose width is the plot width times the series' progress, so a frame is the
 * same picture whenever it is rendered.
 */
export const LiftChart: React.FC<{
  theme: Theme;
  width: number;
  plotHeight?: number;
  topPad?: number;
  leftMargin?: number;
  rightMargin?: number;
  labelRow?: number;
  max?: number;
  agent: readonly number[];
  holdout: readonly number[];
  agentName: string;
  holdoutName: string;
  xTicks: readonly string[];
  /** 0→1 left-to-right reveal of each line */
  agentProgress: number;
  holdoutProgress: number;
  /** 0→1: end dots scale 0.6→1 and fade in with their labels */
  endProgress: number;
  /** One opacity per x tick label, in xTicks order */
  tickOpacities: readonly number[];
  style?: React.CSSProperties;
}> = ({
  theme,
  width,
  plotHeight = 260,
  topPad = 14,
  leftMargin = 44,
  rightMargin = 66,
  labelRow = 30,
  max = 50,
  agent,
  holdout,
  agentName,
  holdoutName,
  xTicks,
  agentProgress,
  holdoutProgress,
  endProgress,
  tickOpacities,
  style,
}) => {
  const n = agent.length;
  const last = n - 1;
  const pw = width - leftMargin - rightMargin;
  const X = (i: number) => leftMargin + (pw * i) / last;
  const Y = (v: number) => topPad + plotHeight * (1 - v / max);
  const base = topPad + plotHeight;
  const total = base + labelRow;
  const n1 = (v: number) => v.toFixed(1);
  const points = (vals: readonly number[]) => vals.map((v, i) => `${n1(X(i))},${n1(Y(v))}`).join(" ");

  // x tick indices as the web: first, middle, last
  const tickIdx = [0, Math.floor(last / 2), last];
  const yTicks = [0, max / 2, max];

  // A reveal rect: a little wider than the plot so round caps are never clipped
  const clipRect = (p: number) => ({
    x: leftMargin - 4,
    y: -2,
    width: Math.max(0, (pw + 8) * p),
    height: total,
  });

  const series = [
    { key: "holdout", name: holdoutName, values: holdout, color: theme.data[2], progress: holdoutProgress },
    { key: "agent", name: agentName, values: agent, color: theme.data[0], progress: agentProgress },
  ];

  const endScale = 0.6 + 0.4 * endProgress;
  const tickStyle: React.CSSProperties = { fontFamily: monoFont, fontSize: 13, fontVariantNumeric: "tabular-nums" };

  return (
    <svg width={width} height={total} viewBox={`0 0 ${width} ${total}`} style={{ display: "block", overflow: "visible", ...style }}>
      <defs>
        {series.map((s) => (
          <clipPath key={s.key} id={`lift-${s.key}-clip`} clipPathUnits="userSpaceOnUse">
            <rect {...clipRect(s.progress)} />
          </clipPath>
        ))}
      </defs>

      {yTicks.map((v) => {
        const yy = Y(v);
        return (
          <g key={v}>
            <line
              x1={leftMargin}
              x2={leftMargin + pw}
              y1={n1(yy)}
              y2={n1(yy)}
              stroke={v === 0 ? alpha(theme.ink, 0.3) : alpha(theme.ink, 0.09)}
              strokeWidth={1}
              shapeRendering="crispEdges"
            />
            <text x={leftMargin - 8} y={n1(yy)} textAnchor="end" dominantBaseline="middle" fill={theme.inkMuted} style={tickStyle}>
              {`${v}%`}
            </text>
          </g>
        );
      })}

      {tickIdx.map((i, k) => (
        <text
          key={i}
          x={n1(X(i))}
          y={base + 20}
          textAnchor={i === 0 ? "start" : "middle"}
          fill={theme.inkMuted}
          opacity={tickOpacities[k] ?? 1}
          style={tickStyle}
        >
          {xTicks[k]}
        </text>
      ))}

      {series.map((s) => (
        <g key={s.key} clipPath={`url(#lift-${s.key}-clip)`}>
          <polyline points={points(s.values)} fill="none" stroke={s.color} strokeWidth={3} strokeLinejoin="round" strokeLinecap="round" />
        </g>
      ))}

      {endProgress > 0
        ? series.map((s) => {
            const cx = X(last);
            const cy = Y(s.values[last]);
            return (
              <g key={s.key} opacity={endProgress}>
                <g transform={`translate(${n1(cx)} ${n1(cy)}) scale(${endScale.toFixed(4)}) translate(${n1(-cx)} ${n1(-cy)})`}>
                  <circle cx={n1(cx)} cy={n1(cy)} r={5} fill={s.color} stroke={theme.raised} strokeWidth={2} />
                </g>
                <text x={n1(cx + 10)} y={n1(cy)} dominantBaseline="middle" fill={theme.inkMuted} style={{ fontFamily: sansFont, fontSize: 14 }}>
                  {s.name}
                </text>
              </g>
            );
          })
        : null}
    </svg>
  );
};
