/**
 * Displays readiness badges for all providers.
 */
import type { JSX } from "react";
import { Box, CircularProgress } from "@mui/material";
import { useProviderReadiness } from "../hooks/useProviderReadiness";
import { ProviderStatusBadge } from "./ProviderStatusBadge";

/** Props for {@link ProviderStatusBar}. */
export interface ProviderStatusBarProps {
  /** Absolute backend URL. */
  backendUrl: string;
  /** Optional Bearer token. */
  authToken?: string;
}

/**
 * Displays provider readiness badges, refreshing every 30 seconds.
 *
 * @param backendUrl - absolute backend URL
 * @param authToken - optional Bearer token
 * @returns the provider status bar
 */
export function ProviderStatusBar({ backendUrl, authToken }: ProviderStatusBarProps): JSX.Element {
  const { readiness, loading } = useProviderReadiness(backendUrl, authToken);

  if (loading) {
    return <CircularProgress size={20} />;
  }

  return (
    <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
      {Array.from(readiness.values()).map((r) => (
        <ProviderStatusBadge key={r.key} readiness={r} />
      ))}
    </Box>
  );
}
