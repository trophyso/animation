import React from "react";
import { Chip } from "../Chip";
import { type IconName } from "../icons";
import { type Theme } from "../tokens";

export type FeatureChip = { label: string; icon: IconName | "Points" };

/**
 * The five in-app experiences as glass-strong mono chips in a row. `enter`
 * holds one eased 0→1 progress per chip (fade + small rise), driven by the scene.
 */
export const FeatureChipRow: React.FC<{
  chips: readonly FeatureChip[];
  enter: readonly number[];
  theme: Theme;
  s?: number;
  style?: React.CSSProperties;
}> = ({ chips, enter, theme, s = 1, style }) => (
  <div style={{ display: "flex", alignItems: "center", gap: 10 * s, ...style }}>
    {chips.map((chip, i) => {
      const p = enter[i] ?? 1;
      return (
        <Chip
          key={chip.label}
          theme={theme}
          s={s}
          icon={chip.icon}
          style={{ opacity: p, translate: `0px ${((1 - p) * 12 * s).toFixed(3)}px` }}
        >
          {chip.label}
        </Chip>
      );
    })}
  </div>
);
