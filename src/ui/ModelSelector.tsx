/**
 * Compact provider/model selector with context-window info and selection badge.
 */
import type { JSX } from "react";
import { FormControl, InputLabel, MenuItem, Select, Chip, Box, Typography } from "@mui/material";
import type { AIProvider } from "../types/models";

/** Formats a context-window token count as a short human label (e.g. 128k, 1M). */
function ctxLabel(n: number): string {
  if (n >= 1_000_000) return `${n / 1_000_000}M ctx`;
  return `${n / 1_000}k ctx`;
}

/** Props for {@link ModelSelector}. */
export interface ModelSelectorProps {
  providers: AIProvider[];
  value: string | null;
  onChange: (modelId: string) => void;
  disabled?: boolean;
}

/**
 * Renders a flat dropdown of all enabled models grouped by provider label.
 * Selected model is highlighted with a star chip; context window is shown for each option.
 *
 * @param props.providers - provider catalog
 * @param props.value     - currently selected model id
 * @param props.onChange  - callback fired when the user picks a model
 * @param props.disabled  - disable the control during in-flight requests
 * @returns the selector JSX
 */
export function ModelSelector({ providers, value, onChange, disabled }: ModelSelectorProps): JSX.Element {
  const enabled = providers.filter((p) => p.enabled);
  return (
    <FormControl size="small" sx={{ minWidth: 300 }} disabled={disabled}>
      <InputLabel id="ai-sql-model-label">Model</InputLabel>
      <Select
        labelId="ai-sql-model-label"
        label="Model"
        value={value ?? ""}
        onChange={(e) => onChange(String(e.target.value))}
        renderValue={(v) => {
          const m = enabled.flatMap((p) => p.models).find((x) => x.id === v);
          return <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>{m?.label ?? String(v)}</Box>;
        }}
      >
        {enabled.flatMap((p) => [
          <MenuItem key={`h-${p.key}`} disabled sx={{ opacity: 0.7, fontSize: 12, fontWeight: 600 }}>
            {p.label}
          </MenuItem>,
          ...p.models.map((m) => (
            <MenuItem key={m.id} value={m.id}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1, width: "100%" }}>
                <span>{m.label}</span>
                <Typography variant="caption" sx={{ color: "text.secondary", ml: 0.5 }}>{ctxLabel(m.contextWindow)}</Typography>
                {m.id === value && <Chip size="small" color="primary" label="★" sx={{ ml: "auto" }} />}
              </Box>
            </MenuItem>
          )),
        ])}
      </Select>
    </FormControl>
  );
}
