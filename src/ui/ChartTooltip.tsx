/**
 * MUI-themed Recharts tooltip with context-aware value formatting.
 * Replaces the previous hardcoded dark-card approach — all colours come from the active theme.
 */
import type { JSX } from "react";
import { Paper, Typography, Box } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import type { ChartHint } from "../types/schema";
import { formatChartValue } from "./chartFormat";
import { pal } from "./chartConfig";

/** Single entry in the Recharts tooltip payload array. */
export interface TooltipEntry {
  name?: string;
  value?: unknown;
  color?: string;
}

/** Props injected by Recharts plus the chart hint for label context. */
interface ChartTooltipProps {
  active?: boolean;
  payload?: ReadonlyArray<TooltipEntry>;
  label?: unknown;
  hint: ChartHint;
}

/**
 * Renders a MUI-styled tooltip for all Recharts chart types.
 * Values are formatted by semantic type (date, amount, number) inferred from the column key.
 *
 * @param props.active  - whether the tooltip is visible (injected by Recharts)
 * @param props.payload - hovered data entries (injected by Recharts)
 * @param props.label   - X-axis label for the hovered point (injected by Recharts)
 * @param props.hint    - chart configuration providing xKey for label formatting
 * @returns tooltip element or null when inactive
 */
export function ChartTooltip({ active, payload, label, hint }: ChartTooltipProps): JSX.Element | null {
  const theme = useTheme();
  if (!active || !payload?.length) return null;

  return (
    <Paper elevation={4} sx={{ px: 1.5, py: 1, border: 1, borderColor: "divider", minWidth: 140 }}>
      <Typography variant="caption" sx={{ color: "text.secondary", fontWeight: 700, display: "block", mb: 0.5 }}>
        {formatChartValue(label, hint.xKey)}
      </Typography>

      {payload.map((entry, i) => (
        <Box key={entry.name ?? i} sx={{ display: "flex", justifyContent: "space-between", gap: 2 }}>
          <Typography variant="caption" sx={{ color: "text.secondary" }}>
            {entry.name}
          </Typography>
          <Typography variant="caption" sx={{ fontWeight: 600, color: entry.color ?? pal(theme, i) }}>
            {formatChartValue(entry.value, entry.name ?? "")}
          </Typography>
        </Box>
      ))}
    </Paper>
  );
}
