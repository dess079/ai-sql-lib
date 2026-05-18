/**
 * Auto-growing prompt input with a Send button and a token-usage status line.
 */
import type { JSX } from "react";
import { useState, type KeyboardEvent } from "react";
import { Box, IconButton, LinearProgress, TextField, Typography } from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import type { TokenUsage } from "../types/models";

/** Props for {@link PromptInput}. */
export interface PromptInputProps {
  onSubmit: (prompt: string) => void;
  disabled?: boolean;
  placeholder?: string;
  /** Current token usage — drives the status line shown during/after a query. */
  tokenUsage?: TokenUsage | null;
  /** True while a query is submitting or streaming. */
  busy?: boolean;
}

/**
 * Multi-line prompt input. Submits on Enter (Shift+Enter for new line).
 * Shows a token-usage status line when `busy` or when `tokenUsage` is available.
 *
 * @param props.onSubmit    - callback fired with the trimmed prompt
 * @param props.disabled    - disable the input while a request is in flight
 * @param props.placeholder - optional placeholder text
 * @param props.tokenUsage  - latest token-usage snapshot
 * @param props.busy        - true while submitting or streaming
 * @returns the input JSX
 */
export function PromptInput({ onSubmit, disabled, placeholder = "Ask anything about your data...", tokenUsage, busy }: PromptInputProps): JSX.Element {
  const [value, setValue] = useState("");
  const send = (): void => {
    const trimmed = value.trim();
    if (!trimmed || disabled) return;
    onSubmit(trimmed);
    setValue("");
  };
  const onKey = (e: KeyboardEvent<HTMLDivElement>): void => {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(); }
  };

  const pct = tokenUsage && tokenUsage.max > 0 ? Math.min(100, (tokenUsage.used / tokenUsage.max) * 100) : null;
  const barColor: "primary" | "warning" | "error" = pct != null && pct >= 90 ? "error" : pct != null && pct >= 75 ? "warning" : "primary";
  const showStatus = busy || (pct != null && pct > 0);

  return (
    <Box sx={{ borderTop: 1, borderColor: "divider" }}>
      {showStatus && (
        <Box sx={{ px: 2, pt: 0.75, pb: 0.25 }}>
          <Box sx={{ display: "flex", justifyContent: "space-between", mb: 0.25 }}>
            <Typography variant="caption" color="text.secondary">
              {busy && pct === 0 ? "Envoi en cours…" : `Contexte utilisé — ${tokenUsage?.model ?? ""}`}
            </Typography>
            <Typography variant="caption" fontWeight={600} color={barColor === "error" ? "error.main" : barColor === "warning" ? "warning.main" : "text.secondary"}>
              {pct != null ? `${Math.round(pct)}%` : "—"}
              {tokenUsage && tokenUsage.used > 0 && (
                <span style={{ fontWeight: 400, marginLeft: 4 }}>
                  ({tokenUsage.used.toLocaleString()} / {tokenUsage.max.toLocaleString()} tokens)
                </span>
              )}
            </Typography>
          </Box>
          <LinearProgress
            variant={busy && pct === 0 ? "indeterminate" : "determinate"}
            value={pct ?? 0}
            color={barColor}
            sx={{ height: 3, borderRadius: 2 }}
          />
        </Box>
      )}
      <Box sx={{ display: "flex", gap: 1, alignItems: "flex-end", p: 1 }}>
        <TextField
          fullWidth
          multiline
          maxRows={6}
          size="small"
          placeholder={placeholder}
          value={value}
          disabled={disabled}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={onKey}
        />
        <IconButton color="primary" onClick={send} disabled={disabled || !value.trim()} aria-label="Send prompt">
          <SendIcon />
        </IconButton>
      </Box>
    </Box>
  );
}
