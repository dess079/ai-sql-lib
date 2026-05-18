/**
 * Syntax-highlighted SQL preview block with a copy button.
 */
import type { JSX } from "react";
import { useState } from "react";
import { Box, IconButton, Tooltip, Typography } from "@mui/material";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import CheckIcon from "@mui/icons-material/Check";

/** Props for {@link SQLPreview}. */
export interface SQLPreviewProps {
  sql: string;
  issues?: string[];
}

/**
 * Renders an SQL snippet in a monospace block, with copy-to-clipboard.
 * Highlights validation issues in red below the snippet.
 *
 * @param props.sql    - the SQL string to display
 * @param props.issues - optional list of validation errors
 * @returns the preview JSX
 */
export function SQLPreview({ sql, issues }: SQLPreviewProps): JSX.Element {
  const [copied, setCopied] = useState(false);
  const onCopy = (): void => {
    navigator.clipboard.writeText(sql).then(() => {
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1500);
    });
  };
  return (
    <Box sx={{ position: "relative", bgcolor: "grey.900", color: "grey.50", p: 1.5, borderRadius: 1, my: 1 }}>
      <Tooltip title={copied ? "Copied!" : "Copy SQL"}>
        <IconButton
          size="small"
          onClick={onCopy}
          sx={{ position: "absolute", top: 4, right: 4, color: "grey.300" }}
          aria-label="Copy SQL"
        >
          {copied ? <CheckIcon fontSize="small" /> : <ContentCopyIcon fontSize="small" />}
        </IconButton>
      </Tooltip>
      <Box component="pre" sx={{ m: 0, fontFamily: "monospace", fontSize: 13, whiteSpace: "pre-wrap", wordBreak: "break-word" }}>
        {sql}
      </Box>
      {issues && issues.length > 0 && (
        <Box sx={{ mt: 1 }}>
          {issues.map((it, idx) => (
            <Typography key={idx} variant="caption" sx={{ display: "block", color: "error.light" }}>
              ⚠ {it}
            </Typography>
          ))}
        </Box>
      )}
    </Box>
  );
}
