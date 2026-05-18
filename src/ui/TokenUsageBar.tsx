/**
 * Token usage chip with a progress bar showing context-window consumption.
 */
import type { JSX } from "react";
import { Box, LinearProgress, Tooltip, Typography } from "@mui/material";
import type { TokenUsage } from "../types/models";

/** Props for {@link TokenUsageBar}. */
export interface TokenUsageBarProps { usage: TokenUsage | null; }

/**
 * Displays the current model's token usage as a small progress bar.
 * Warns visually past 75% and 90%.
 *
 * @param props.usage - latest token-usage snapshot
 * @returns the usage chip JSX, or `null` when no session is active
 */
export function TokenUsageBar({ usage }: TokenUsageBarProps): JSX.Element | null {
  if (!usage) return null;
  const pct = usage.max > 0 ? Math.min(100, (usage.used / usage.max) * 100) : 0;
  const color: "primary" | "warning" | "error" = pct >= 90 ? "error" : pct >= 80 ? "warning" : "primary";
  return (
    <Tooltip title={`${usage.used.toLocaleString()} / ${usage.max.toLocaleString()} tokens`}>
      <Box sx={{ minWidth: 160, display: "flex", flexDirection: "column", gap: 0.25 }}>
        <Typography variant="caption" sx={{ display: "flex", justifyContent: "space-between" }}>
          <span>{usage.model}</span>
          <span>{Math.round(pct)}%</span>
        </Typography>
        <LinearProgress variant="determinate" value={pct} color={color} />
      </Box>
    </Tooltip>
  );
}
