/**
 * Tiny preview card used by the example prompts panel.
 */
import type { JSX } from "react";
import { Box, Paper, Typography } from "@mui/material";
import type { OutputType } from "./examplePrompts";

/** Props for {@link ChartPreview}. */
export interface ChartPreviewProps {
  /** Chart type selected in the prompt catalog. */
  type: OutputType;
}

/**
 * Renders a minimal preview of the selected output type.
 *
 * @param props.type - preview kind to display
 * @returns the preview JSX
 */
export function ChartPreview({ type }: ChartPreviewProps): JSX.Element {
  return (
    <Paper variant="outlined" sx={{ p: 1.25, bgcolor: "background.default" }}>
      <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: 72 }}>
        <Typography variant="body2" color="text.secondary">
          Aperçu: {type}
        </Typography>
      </Box>
    </Paper>
  );
}
