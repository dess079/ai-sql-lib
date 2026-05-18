/**
 * One chat message bubble: user or assistant.
 */
import type { JSX } from "react";
import { Box, Avatar, Paper } from "@mui/material";
import PersonIcon from "@mui/icons-material/Person";
import SmartToyIcon from "@mui/icons-material/SmartToy";
import type { MessageRole } from "../types/conversation";
import { MarkdownView } from "./MarkdownView";
import { SQLPreview } from "./SQLPreview";

/** Props for {@link ChatMessage}. */
export interface ChatMessageProps {
  role: MessageRole;
  content: string;
  sql?: string;
}

/**
 * Renders a single chat bubble with avatar + markdown content (+ optional SQL).
 *
 * @param props.role    - "user" or "assistant"
 * @param props.content - markdown body
 * @param props.sql     - optional SQL snippet rendered below
 * @returns the bubble JSX
 */
export function ChatMessage({ role, content, sql }: ChatMessageProps): JSX.Element {
  const isUser = role === "user";
  return (
    <Box sx={{ display: "flex", flexDirection: isUser ? "row-reverse" : "row", gap: 1, my: 1 }}>
      <Avatar sx={{ bgcolor: isUser ? "primary.main" : "secondary.main", width: 32, height: 32 }}>
        {isUser ? <PersonIcon fontSize="small" /> : <SmartToyIcon fontSize="small" />}
      </Avatar>
      <Paper
        variant="outlined"
        sx={{
          maxWidth: "80%",
          p: 1.5,
          bgcolor: isUser ? "primary.50" : "background.paper",
          borderColor: isUser ? "primary.light" : "divider",
        }}
      >
        <MarkdownView content={content} />
        {sql && <SQLPreview sql={sql} />}
      </Paper>
    </Box>
  );
}
