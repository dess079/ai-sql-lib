/**
 * Scrollable body of the AI-SQL chat: timeline + SQL + results + narrative.
 * Split out of `AISQLChat` to honour the 100-line cap.
 */
import type { JSX } from "react";
import { useRef, useEffect } from "react";
import { Box, Typography, Alert, Chip, Divider } from "@mui/material";
import type { AISQLState } from "../hooks/useAISQL";
import type { Message } from "../types/conversation";
import { ProcessTimeline } from "./ProcessTimeline";
import { SQLPreview } from "./SQLPreview";
import { ResultsDisplay } from "./ResultsDisplay";
import { MarkdownView } from "./MarkdownView";

/** Props for {@link AISQLChatBody}. */
export interface AISQLChatBodyProps {
  state: AISQLState;
  backendUrl: string;
  /** Persisted DB messages shown when no live session is active. */
  historyMessages?: Message[];
}

/**
 * Renders the live session state (timeline + SQL + result + narrative).
 * Falls back to persisted DB history when no live session is active.
 *
 * @param props.state           - aggregated session state from `useAISQL`
 * @param props.backendUrl      - backend URL (kept for future RAG widgets)
 * @param props.historyMessages - DB messages shown when state is empty
 * @returns the body JSX
 */
export function AISQLChatBody({ state, historyMessages = [] }: AISQLChatBodyProps): JSX.Element {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [state.steps.length, state.sql, state.result, state.narrative, state.completedTurns.length]);

  const showHistory = historyMessages.length > 0 && state.completedTurns.length === 0 && state.steps.length === 0 && !state.sql;

  let historyQuery = 0;

  const numberedHistoryMessages = historyMessages
    .filter((m) => m.role !== "system")
    .map((msg) => {
      if (msg.role === "user") historyQuery += 1;

      return { msg, queryNumber: historyQuery || 1 };
    });

  const liveQueryNumber = state.completedTurns.length + 1;

  return (
    <Box sx={{ flex: 1, overflow: "auto", px: 2, py: 1 }}>
      {showHistory && numberedHistoryMessages.map(({ msg, queryNumber }) => (
        <Box key={msg.id} sx={{ mb: 2, display: "flex", justifyContent: msg.role === "user" ? "flex-end" : "flex-start" }}>
          <Box sx={{ maxWidth: "85%", textAlign: msg.role === "user" ? "right" : "left" }}>
          <Chip
            label={`Query #${queryNumber}`}
            size="small"
            color="secondary"
            variant="outlined"
            sx={{ mb: 0.5, mr: 0.5 }}
          />

          <Chip
            label={msg.role === "user" ? "You" : "AI"} size="small"
            color={msg.role === "user" ? "default" : "primary"} sx={{ mb: 0.5 }}
          />
          {msg.role === "user"
            ? <Typography variant="body2" sx={{ whiteSpace: "pre-wrap" }}>{msg.content}</Typography>
            : <MarkdownView content={msg.content} />}
          {msg.queryResult && msg.role !== "user" && (
            <Box sx={{ mt: 1 }}><ResultsDisplay result={msg.queryResult} /></Box>
          )}
          {msg.sql && (
            <Box component="pre" sx={{ fontSize: 12, bgcolor: "action.hover", p: 1, borderRadius: 1, overflowX: "auto", mt: 0.5 }}>
              {msg.sql}
            </Box>
          )}
          <Divider sx={{ mt: 1 }} />
          </Box>
        </Box>
      ))}
      {state.completedTurns.map((t, i) => (
        <Box key={i} sx={{ mb: 2, pb: 1, borderBottom: 1, borderColor: "divider" }}>
          <Chip label={`Query #${i + 1}`} size="small" color="secondary" variant="outlined" sx={{ mb: 0.75 }} />

          {t.userPrompt && (
            <Box sx={{ mb: 1, display: "flex", justifyContent: "flex-end" }}>
              <Box sx={{ maxWidth: "85%", textAlign: "right" }}>
              <Chip label="You" size="small" color="default" sx={{ mb: 0.5 }} />
              <Typography variant="body2" sx={{ whiteSpace: "pre-wrap" }}>{t.userPrompt}</Typography>
              </Box>
            </Box>
          )}
          {t.rephrased && <Typography variant="body2" color="text.secondary" sx={{ fontStyle: "italic", mb: 0.5 }}>Understanding: {t.rephrased}</Typography>}
          {t.sql && <SQLPreview sql={t.sql} issues={[]} />}
          {t.result && <ResultsDisplay result={t.result} />}
          {t.narrative && <MarkdownView content={t.narrative} />}
        </Box>
      ))}
      {state.rephrased && (
        <Typography variant="body2" color="text.secondary" sx={{ fontStyle: "italic", mb: 1 }}>
          Understanding: {state.rephrased}
        </Typography>
      )}
      {state.error && <Alert severity="error" sx={{ my: 1 }}>{state.error}</Alert>}
      {state.retryAttempt != null && (
        <Alert severity="warning" sx={{ my: 1 }}>
          SQL failed — correcting automatically (attempt {state.retryAttempt}/{state.retryMax ?? 5})…
        </Alert>
      )}

      {(state.steps.length > 0 || state.sql || state.result || state.narrative) && (
        <Chip label={`Query #${liveQueryNumber}`} size="small" color="secondary" variant="outlined" sx={{ mb: 1 }} />
      )}

      {(state.steps.length > 0 || state.finished) && <ProcessTimeline steps={state.steps} finished={state.finished} />}
      {state.sql && <SQLPreview sql={state.sql} issues={state.validationIssues} />}
      {state.result && <ResultsDisplay result={state.result} />}
      {state.narrative && <MarkdownView content={state.narrative} />}
      <div ref={bottomRef} />
    </Box>
  );
}
