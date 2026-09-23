/**
 * Top app-bar toolbar for AISQLChat.
 * Contains model selector, token usage, example prompts and PDF export.
 */
import type { JSX } from "react";
import { AppBar, Toolbar, Typography } from "@mui/material";
import { TokenUsageBar } from "./TokenUsageBar";
import { ExamplePromptsButton } from "./example-prompts";
import { ProviderStatusBar } from "./ProviderStatusBar";
import type { TokenUsage } from "../types/models";

/** Props for {@link AISQLToolbar}. */
export interface AISQLToolbarProps {
  backendUrl: string;
  tokenUsage: TokenUsage | null;
  submitting: boolean;
  streaming: boolean;
  sessionTitle: string;
  onSubmit: (p: string) => Promise<void>;
  authToken?: string;
}

/**
 * Renders the persistent top app bar with model selector, token usage and example prompts.
 *
 * @param props.backendUrl     - absolute backend URL
 * @param props.providers      - available AI providers
 * @param props.model          - currently selected model id
 * @param props.onModelChange  - model change handler
 * @param props.tokenUsage     - current token usage for the badge
 * @param props.submitting     - disables controls while a query runs
 * @param props.streaming      - disables controls while SSE streams
 * @param props.sessionTitle   - active conversation title (reserved for future PDF export)
 * @param props.onSubmit       - submit handler for example prompts
 * @param props.authToken      - optional Bearer token
 * @returns the AppBar JSX
 */
export function AISQLToolbar({
  backendUrl, tokenUsage, submitting, streaming, onSubmit, authToken,
}: AISQLToolbarProps): JSX.Element {
  const busy = submitting || streaming;

  return (
    <AppBar position="static" color="transparent" elevation={0}
      sx={{ bgcolor: "background.paper", borderBottom: 1, borderColor: "divider" }}>
      <Toolbar sx={{ gap: 1.5, minHeight: 52, px: 2 }}>
        <Typography variant="h6" sx={{ flexGrow: 1, fontWeight: 700 }}>AI-SQL</Typography>

        <ProviderStatusBar backendUrl={backendUrl} authToken={authToken} />

        <TokenUsageBar usage={tokenUsage} />

        <ExamplePromptsButton onSelect={onSubmit} disabled={busy} />
      </Toolbar>
    </AppBar>
  );
}