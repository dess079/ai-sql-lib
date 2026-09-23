/**
 * Displays provider readiness status as a compact badge.
 */
import type { JSX } from "react";
import { Chip, Stack, Tooltip, Typography } from "@mui/material";
import ErrorIcon from "@mui/icons-material/Error";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import SignalCellularNullIcon from "@mui/icons-material/SignalCellularNull";
import WarningIcon from "@mui/icons-material/Warning";
import type { ProviderReadiness } from "../types/models";

/** Props for {@link ProviderStatusBadge}. */
export interface ProviderStatusBadgeProps {
  readiness: ProviderReadiness;
}

/**
 * Renders a status badge for a single provider.
 *
 * @param readiness - provider readiness state
 * @returns the status badge
 */
export function ProviderStatusBadge({ readiness }: ProviderStatusBadgeProps): JSX.Element {
  const iconMap: Record<ProviderReadiness["status"], JSX.Element> = {
    ready: <CheckCircleIcon sx={{ fontSize: 16 }} />,
    "missing-config": <WarningIcon sx={{ fontSize: 16 }} />,
    "auth-error": <ErrorIcon sx={{ fontSize: 16 }} />,
    unreachable: <SignalCellularNullIcon sx={{ fontSize: 16 }} />,
  };

  const colorMap: Record<ProviderReadiness["status"], "success" | "warning" | "error"> = {
    ready: "success",
    "missing-config": "warning",
    "auth-error": "error",
    unreachable: "error",
  };

  return (
    <Tooltip title={readiness.detail} arrow>
      <Stack spacing={0.5} sx={{ alignItems: "center", minWidth: 88 }}>
        <Typography variant="caption" sx={{ fontWeight: 700, lineHeight: 1.1 }}>
          {readiness.label}
        </Typography>

        <Chip
          icon={iconMap[readiness.status]}
          label={readiness.status === "ready" ? "OK" : "⚠"}
          size="small"
          variant="outlined"
          color={colorMap[readiness.status]}
          sx={{ height: 24 }}
        />
      </Stack>
    </Tooltip>
  );
}
