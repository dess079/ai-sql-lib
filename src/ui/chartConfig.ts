import type { Theme } from "@mui/material/styles";

/**
 * Shared chart styling configuration for all Recharts chart types.
 * Uses the active MUI theme for axis, grid, legend and palette colors.
 */

export const PALETTE = (theme: Theme) => [
  theme.palette.primary.main,
  theme.palette.secondary.main,
  theme.palette.success.main,
  theme.palette.warning.main,
  theme.palette.error.main,
  theme.palette.info.main,
  theme.palette.primary.dark,
  theme.palette.secondary.dark,
];

/** Returns the palette colour at position i (wraps). */
export const pal = (theme: Theme, i: number): string => PALETTE(theme)[i % PALETTE(theme).length];

/** Outer margin for charts that include X/Y axes. Generous bottom so rotated labels never
 * collide with the Legend row below the chart. */
export const CHART_MARGIN = { top: 10, right: 20, left: 0, bottom: 80 };
/** Margin for bar charts: legend is on top, no extra bottom space needed. */
export const BAR_CHART_MARGIN = { top: 40, right: 20, left: 0, bottom: 80 };

export const axisStyle = (theme: Theme) => ({
  tick: { fill: theme.palette.text.secondary, fontSize: 12 },
  axisLine: { stroke: theme.palette.divider },
  tickLine: { stroke: theme.palette.divider },
});

/**
 * XAxis props factory — rotates labels −45° for readability; long category names
 * stay inside the chart area without clipping the legend.
 * @param theme   - the active MUI theme
 * @param dataKey - row field to map to the X axis
 * @returns Recharts XAxis props object
 */
export const xAxisProps = (theme: Theme, dataKey: string) => ({
  dataKey,
  ...axisStyle(theme),
  angle: -45,
  textAnchor: "end" as const,
  height: 90,
  interval: 0 as const,
});

/** Shared YAxis props. */
export const yAxisProps = (theme: Theme) => ({ ...axisStyle(theme), width: 56 });

/** Subtle horizontal grid lines only (no vertical noise). */
export const gridProps = (theme: Theme) => ({
  strokeDasharray: "3 3" as const,
  stroke: theme.palette.divider,
  vertical: false,
});

/** Shared Legend wrapper style. */
export const legendStyle = (theme: Theme) => ({ paddingTop: 8, fontSize: 13, color: theme.palette.text.secondary });
