/**
 * Renders a single persisted history message in the AI-SQL chat history.
 */
import type { JSX } from "react";
import { useState } from "react";
import { Box, Typography, Chip, IconButton, Tooltip } from "@mui/material";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import CheckIcon from "@mui/icons-material/Check";
import type { Message } from "../types/conversation";
import type { QueryResult } from "../types/schema";
import { MarkdownView } from "./MarkdownView";
import { ResultsDisplay } from "./ResultsDisplay";

function serializeResult(result: QueryResult): string {
  if (result.mermaid) {
    return result.mermaid.trim();
  }

  return JSON.stringify({ format: result.format, columns: result.columns, rows: result.rows }, null, 2);
}

function serializeMessage(message: Message): string {
  const chunks = [message.content.trim()];

  if (message.queryResult) {
    chunks.push(serializeResult(message.queryResult));
  }

  if (message.sql) {
    chunks.push(message.sql.trim());
  }

  return chunks.filter(Boolean).join("\n\n");
}

/** Props for {@link HistoryMessage}. */
export interface HistoryMessageProps {
  message: Message;
  queryNumber: number;
  showQueryHeading: boolean;
}

/**
 * Renders one persisted user or assistant message in history.
 *
 * @param props.message - the persisted message to render
 * @param props.queryNumber - the query number this message belongs to
 * @param props.showQueryHeading - whether to render a query heading above this message
 * @returns the rendered history message
 */
export function HistoryMessage({ message: m, queryNumber, showQueryHeading }: HistoryMessageProps): JSX.Element {
  const [copied, setCopied] = useState(false);

  const onCopy = (text: string): void => {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1500);
    });
  };

  const isUser = m.role === "user";

  return (
    <Box sx={{ mb: 2 }}>
      {showQueryHeading && (
        <Typography variant="overline" color="text.secondary" sx={{ fontWeight: 700, mb: 1, display: "block" }}>
          Query #{queryNumber}
        </Typography>
      )}

      <Box sx={{ display: "flex", justifyContent: isUser ? "flex-end" : "flex-start" }}>
        <Box sx={{ maxWidth: "85%", textAlign: isUser ? "right" : "left" }}>
          <Box sx={{ display: "flex", justifyContent: isUser ? "flex-end" : "flex-start", gap: 1, alignItems: "center", mb: 1 }}>
            <Chip
              label={isUser ? "You" : "AI"}
              size="small"
              color={isUser ? "default" : "primary"}
            />
            <Tooltip title={copied ? "Copied!" : isUser ? "Copy content" : "Copy result"}>
              <IconButton onClick={() => onCopy(isUser ? m.content : serializeMessage(m))} size="small">
                {copied ? <CheckIcon fontSize="small" color="success" /> : <ContentCopyIcon fontSize="small" />}
              </IconButton>
            </Tooltip>
          </Box>

          {m.model && (
            <Typography variant="caption" color="text.secondary" sx={{ display: isUser ? "block" : "block", textAlign: isUser ? "right" : "left", mb: 1 }}>
              {m.model}
            </Typography>
          )}

          {isUser ? (
            <Typography variant="body2" sx={{ whiteSpace: "pre-wrap" }}>
              {m.content}
            </Typography>
          ) : (
            <MarkdownView content={m.content} />
          )}

          {m.queryResult && !isUser && (
            <Box sx={{ mt: 1 }}>
              <ResultsDisplay result={m.queryResult} />
            </Box>
          )}

          {m.sql && (
            <Box component="pre" sx={{ fontSize: 12, bgcolor: "action.hover", p: 1, borderRadius: 1, overflowX: "auto", mt: 0.5 }}>
              {m.sql}
            </Box>
          )}
        </Box>
      </Box>
    </Box>
  );
}
