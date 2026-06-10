/**
 * Renders a single persisted message: role chip, model, content, optional chart/mermaid, optional SQL.
 */
import type { JSX } from "react";
import { Box, Typography, Chip, IconButton, Tooltip } from "@mui/material";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import CheckIcon from "@mui/icons-material/Check";
import { useState } from "react";
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
  const [copied, setCopied] = useState(false);
  
  const onCopy = (text: string): void => {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <Box>
      <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 0.5 }}>
        {queryNumber != null && (
          <Chip size="small" label={`Query #${queryNumber}`} color="secondary" variant="filled" />
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
        {m.role !== "user" && (
          <Tooltip title={copied ? "Copied!" : "Copy result"}>
            <IconButton
              onClick={() => onCopy(serializeMessage(m))}
              size="small"
              sx={{ ml: "auto" }}
            >
              {copied ? <CheckIcon fontSize="small" color="success" /> : <ContentCopyIcon fontSize="small" />}
            </IconButton>
          </Tooltip>
        )}
      </Box>

      {m.role === "user" ? (
        <Box position="relative">
          <Tooltip title={copied ? "Copied!" : "Copy content"}>
            <IconButton 
              onClick={() => onCopy(m.content)} 
              size="small"
              sx={{ position: "absolute", top: 0, right: 0 }}
            >
              {copied ? <CheckIcon fontSize="small" color="success" /> : <ContentCopyIcon fontSize="small" />}
            </IconButton>
          </Tooltip>
          <Typography variant="body2" sx={{ whiteSpace: "pre-wrap" }}>{m.content}</Typography>
        </Box>
      ) : (
        <Box position="relative">
          <MarkdownView content={m.content} />
        </Box>
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
