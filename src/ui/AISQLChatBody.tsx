/** Scrollable body of the AI-SQL chat: timeline + SQL + results + narrative. */
import type { JSX } from "react";
import { useRef, useEffect, useState } from "react";
import { Box, Typography, Alert, Chip, IconButton, Tooltip } from "@mui/material";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import CheckIcon from "@mui/icons-material/Check";
import type { AISQLState } from "../hooks/useAISQL";
import type { Message } from "../types/conversation";
import { ProcessTimeline } from "./ProcessTimeline";
import { serializeAIOutput } from "./aiCopyUtils";
import { SQLPreview } from "./SQLPreview";
import { ResultsDisplay } from "./ResultsDisplay";
import { MarkdownView } from "./MarkdownView";
import { HistoryMessages } from "./HistoryMessages";

/** Props for {@link AISQLChatBody}. */
export interface AISQLChatBodyProps {
  state: AISQLState;
  backendUrl: string;
  /** Persisted DB messages shown when no live session is active. */
  historyMessages?: Message[];
}

/** Renders the live session state (timeline + SQL + result + narrative). */
export function AISQLChatBody({ state, historyMessages = [] }: AISQLChatBodyProps): JSX.Element {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [state.steps.length, state.sql, state.result, state.narrative, state.completedTurns.length]);

  const [copiedStates, setCopiedStates] = useState<Record<string, boolean>>({});

  const onCopy = (content: string, id: string): void => {
    navigator.clipboard.writeText(content).then(() => {
      setCopiedStates((prev) => ({ ...prev, [id]: true }));
      setTimeout(() => {
        setCopiedStates((prev) => ({ ...prev, [id]: false }));
      }, 1500);
    });
  };

  const showHistory = historyMessages.length > 0 && state.completedTurns.length === 0 && state.steps.length === 0 && !state.sql;
  const showCurrentPrompt = !!state.currentPrompt;

  const liveQueryNumber = state.completedTurns.length + 1;

  return (
    <Box sx={{ flex: 1, overflow: "auto", px: 2, py: 1 }}>
      {showHistory && <HistoryMessages messages={historyMessages} />}
      {showCurrentPrompt && !showHistory && (
        <Box sx={{ mb: 2, pb: 1 }}>
          <Chip label={`Query #${liveQueryNumber}`} size="small" variant="filled" sx={{ mb: 0.75 }} />

          <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1, justifyContent: "flex-end" }}>
            <Box sx={{ maxWidth: "85%", textAlign: "right" }}>
              <Chip label="You" size="small" color="default" sx={{ mb: 0.5 }} />
              <Typography variant="body2" sx={{ whiteSpace: "pre-wrap" }}>{state.currentPrompt}</Typography>
            </Box>
          </Box>
        </Box>
      )}

      {state.completedTurns.map((t, i) => (
        <Box key={i} sx={{ mb: 2, pb: 1}}>
          <Chip label={`Query #${i + 1}`} size="small" variant="filled" sx={{ mb: 0.75}} />

          <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
            <Chip label="AI" size="small" color="primary" />
            <Tooltip title={copiedStates[`turn-${i}`] ? "Copied!" : "Copy result"}>
              <IconButton
                onClick={() => onCopy(serializeAIOutput({ sql: t.sql, result: t.result, narrative: t.narrative }), `turn-${i}`)}
                size="small"
              >
                {copiedStates[`turn-${i}`] ? <CheckIcon fontSize="small" color="success" /> : <ContentCopyIcon fontSize="small" />}
              </IconButton>
            </Tooltip>
          </Box>

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
        <>
          <Chip label={`Query #${liveQueryNumber}`} size="small" color="secondary" variant="filled" sx={{ mb: 1 }} />
          <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
            <Chip label="AI" size="small" color="primary" />
            <Tooltip title={copiedStates[`live`] ? "Copied!" : "Copy result"}>
              <IconButton
                onClick={() => onCopy(serializeAIOutput({ sql: state.sql, result: state.result, narrative: state.narrative }), "live")}
                size="small"
              >
                {copiedStates[`live`] ? <CheckIcon fontSize="small" color="success" /> : <ContentCopyIcon fontSize="small" />}
              </IconButton>
            </Tooltip>
          </Box>
        </>
      )}

      {(state.steps.length > 0 || state.finished) && <ProcessTimeline steps={state.steps} finished={state.finished} />}
      {state.sql && <SQLPreview sql={state.sql} issues={state.validationIssues} />}
      {state.result && <ResultsDisplay result={state.result} />}
      {state.narrative && <MarkdownView content={state.narrative} />}
      <div ref={bottomRef} />
    </Box>
  );
}
