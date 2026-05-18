/**
 * Renders a single persisted message: role chip, model, content, optional chart/mermaid, optional SQL.
 */
import type { JSX } from "react";
import { Box, Typography, Chip } from "@mui/material";
import type { Message } from "../types/conversation";
import { MarkdownView } from "./MarkdownView";
import { ResultsDisplay } from "./ResultsDisplay";

/** Props for {@link MessageRow}. */
export interface MessageRowProps {
  /** The message to display. */
  message: Message;

  /** Optional query number associated with this message. */
  queryNumber?: number;
}

/**
 * Single message row for use in session history views.
 *
 * @param props.message     - the persisted message to render
 * @param props.queryNumber - optional query group number for visual grouping
 * @returns the row JSX
 */
export function MessageRow({ message: m, queryNumber }: MessageRowProps): JSX.Element {
  return (
    <Box>
      <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 0.5 }}>
        {queryNumber != null && (
          <Chip size="small" label={`Query #${queryNumber}`} color="secondary" variant="outlined" />
        )}

        <Chip
          size="small"
          label={m.role}
          color={m.role === "user" ? "primary" : "default"}
          variant="outlined"
        />
        {m.model && (
          <Typography variant="caption" color="text.secondary">{m.model}</Typography>
        )}
      </Box>

      {m.role === "user" ? (
        <Typography variant="body2" sx={{ whiteSpace: "pre-wrap" }}>{m.content}</Typography>
      ) : (
        <MarkdownView content={m.content} />
      )}

      {m.queryResult && m.role !== "user" && (
        <Box sx={{ mt: 1 }}>
          <ResultsDisplay result={m.queryResult} />
        </Box>
      )}

      {m.sql && (
        <Box sx={{ bgcolor: "action.hover", borderRadius: 1, p: 1, mt: 1 }}>
          <Typography variant="caption" color="text.secondary" display="block" sx={{ mb: 0.25 }}>
            SQL
          </Typography>
          <Typography variant="body2" sx={{ fontFamily: "monospace", whiteSpace: "pre-wrap" }}>
            {m.sql}
          </Typography>
        </Box>
      )}
    </Box>
  );
}
