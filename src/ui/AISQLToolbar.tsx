/**
 * Top app-bar toolbar for AISQLChat.
 * Contains model selector, token usage, example prompts and PDF export.
 */
import type { JSX } from "react";
import { AppBar, Toolbar, Typography } from "@mui/material";
import { ModelSelector } from "./ModelSelector";
import { TokenUsageBar } from "./TokenUsageBar";
import { ExamplePromptsButton } from "./example-prompts";
import type { AIProvider, TokenUsage } from "../types/models";

/** Props for {@link AISQLToolbar}. */
export interface AISQLToolbarProps {
  providers: AIProvider[];
  model: string | null;
  onModelChange: (m: string | null) => void;
  tokenUsage: TokenUsage | null;
  submitting: boolean;
  streaming: boolean;
  sessionTitle: string;
  onSubmit: (p: string) => Promise<void>;
}

/**
 * Renders the persistent top app bar with model selector, token usage and example prompts.
 *
 * @param props.providers     - available AI providers
 * @param props.model         - currently selected model id
 * @param props.onModelChange - model change handler
 * @param props.tokenUsage    - current token usage for the badge
 * @param props.submitting    - disables controls while a query runs
 * @param props.streaming     - disables controls while SSE streams
 * @param props.sessionTitle  - active conversation title (reserved for future PDF export)
 * @param props.onSubmit      - submit handler for example prompts
 * @returns the AppBar JSX
 */
export function AISQLToolbar({
  providers, model, onModelChange, tokenUsage, submitting, streaming, onSubmit,
}: AISQLToolbarProps): JSX.Element {
  const busy = submitting || streaming;
  return (
    <AppBar position="static" color="transparent" elevation={0}
      sx={{ bgcolor: "background.paper", borderBottom: 1, borderColor: "divider" }}>
      <Toolbar sx={{ gap: 2, minHeight: 64, px: 2 }}>
        <Typography variant="h5" fontWeight={700} sx={{ flexGrow: 1 }}>AI-SQL</Typography>

        <ModelSelector providers={providers} value={model} onChange={onModelChange} disabled={submitting} />

        <TokenUsageBar usage={tokenUsage} />

        <ExamplePromptsButton onSelect={onSubmit} disabled={busy} />
      </Toolbar>
    </AppBar>
  );
}