/**
 * Lightbulb icon button that opens a dialog with two-panel example prompts
 * (list by difficulty on the left, full prompt + chart type on the right).
 */
import type { JSX } from "react";
import { useState } from "react";
import {
  IconButton, Tooltip, Dialog, DialogTitle, DialogContent,
  Typography, Box,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import LightbulbOutlinedIcon from "@mui/icons-material/LightbulbOutlined";
import { ExamplePromptsPanel } from "./ExamplePromptsPanel";

/** Props for {@link ExamplePromptsButton}. */
export interface ExamplePromptsButtonProps {
  /**
   * Called with the selected prompt text.
   * Consumer is responsible for submission.
   */
  onSelect: (prompt: string) => void;
  /** Disable the button while a query is in flight. */
  disabled?: boolean;
}

/**
 * Renders a lightbulb icon that opens a two-panel prompt suggestion dialog.
 *
 * @param props.onSelect - handler receiving the chosen prompt string
 * @param props.disabled - whether the button is interactive
 * @returns the icon + dialog JSX
 */
export function ExamplePromptsButton({ onSelect, disabled }: ExamplePromptsButtonProps): JSX.Element {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Tooltip title="Exemples de prompts">
        <span>
          <IconButton
            onClick={() => setOpen(true)}
            disabled={disabled}
            size="small"
            color="primary"
            aria-label="Exemples de prompts"
          >
            <LightbulbOutlinedIcon fontSize="small" />
          </IconButton>
        </span>
      </Tooltip>

      <Dialog open={open} onClose={() => setOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", py: 1.5 }}>
          <Typography variant="subtitle1" component="span" sx={{ fontWeight: "bold" }}>
            Exemples de prompts — cabinet dentaire
          </Typography>
          <Box sx={{ display: "flex", gap: 0.5, alignItems: "center" }}>
            <IconButton size="small" onClick={() => setOpen(false)} aria-label="Fermer">
              <CloseIcon fontSize="small" />
            </IconButton>
          </Box>
        </DialogTitle>
        <DialogContent dividers sx={{ p: 0 }}>
          <ExamplePromptsPanel onSelect={onSelect} onClose={() => setOpen(false)} />
        </DialogContent>
      </Dialog>
    </>
  );
}
