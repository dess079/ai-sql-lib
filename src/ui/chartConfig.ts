/**
 * Shared chart styling configuration for all Recharts chart types.
 * Defines a professional dark-card tooltip, muted axes, and a modern palette.
 */

/** 8-color accessible palette used across all chart types. */
export const PALETTE = [
  "#4F8EF7", "#A855F7", "#10B981", "#F59E0B",
  "#EF4444", "#06B6D4", "#8B5CF6", "#F97316",
];

/** Returns the palette colour at position i (wraps). */
export const pal = (i: number): string => PALETTE[i % PALETTE.length];

/** Outer margin for charts that include X/Y axes. Generous bottom so rotated labels never
 * collide with the Legend row below the chart. */
export const CHART_MARGIN = { top: 10, right: 20, left: 0, bottom: 80 };
/** Margin for bar charts: legend is on top, no extra bottom space needed. */
export const BAR_CHART_MARGIN = { top: 40, right: 20, left: 0, bottom: 80 };

/** Tick and axis line style, shared by both axes. */
export const AXIS_STYLE = {
  tick: { fill: "#94a3b8", fontSize: 12 },
  axisLine: { stroke: "#334155" },
  tickLine: { stroke: "#334155" },
};

/**
 * XAxis props factory — rotates labels −45° for readability; long category names
 * stay inside the chart area without clipping the legend.
 * @param dataKey - row field to map to the X axis
 * @returns Recharts XAxis props object
 */
export const xAxisProps = (dataKey: string) => ({
  dataKey,
  ...AXIS_STYLE,
  angle: -45,
  textAnchor: "end" as const,
  height: 90,
  interval: 0 as const,
});

/** Shared YAxis props. */
export const yAxisProps = { ...AXIS_STYLE, width: 56 };

/** Subtle horizontal grid lines only (no vertical noise). */
export const gridProps = {
  strokeDasharray: "3 3" as const,
  stroke: "#334155",
  vertical: false,
};

/** Dark-card tooltip — legible on both light and dark backgrounds. */
export const tooltipProps = {
  contentStyle: {
    backgroundColor: "#1e293b",
    border: "1px solid #475569",
    borderRadius: 8,
    color: "#f1f5f9",
    fontSize: 13,
    padding: "8px 14px",
  },
  itemStyle: { color: "#e2e8f0" },
  labelStyle: { color: "#94a3b8", fontWeight: 600, marginBottom: 4 },
  cursor: { fill: "rgba(255,255,255,0.05)" },
};

/** Shared Legend wrapper style. */
export const legendStyle = { paddingTop: 8, fontSize: 13, color: "#94a3b8" };
