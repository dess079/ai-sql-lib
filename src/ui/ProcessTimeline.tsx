/**
 * Vertical step timeline showing what the AI is doing right now.
 * Each completed step shows its elapsed time; the active one pulses.
 */
import type { JSX } from "react";
import { Box, Typography, CircularProgress, Chip } from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import type { TimelineStep } from "../hooks/useAISQL";

/** Props for {@link ProcessTimeline}. */
export interface ProcessTimelineProps {
  steps: TimelineStep[];
  finished: boolean;
  startedAt?: number;
}

/**
 * Renders the live AI process timeline.
 *
 * @param props.steps     - ordered steps emitted by the backend
 * @param props.finished  - true when the session is complete or errored
 * @param props.startedAt - optional reference timestamp for the first step
 * @returns the timeline JSX
 */
export function ProcessTimeline({ steps, finished }: ProcessTimelineProps): JSX.Element {
  if (steps.length === 0) {
    return (
      <Box sx={{ p: 2, display: "flex", alignItems: "center", gap: 1 }}>
        <CircularProgress size={16} />
        <Typography variant="body2" color="text.secondary">Waiting for first event...</Typography>
      </Box>
    );
  }
  return (
    <Box sx={{ p: 1.5, display: "flex", flexDirection: "column", gap: 0.5 }}>
      {steps.map((s, i) => {
        const isLast = i === steps.length - 1;
        const isDone = !!s.doneAt || (finished && isLast);
        const elapsed = s.doneAt && i > 0 ? s.doneAt - (steps[i - 1].doneAt ?? s.doneAt) : undefined;
        return (
          <Box key={`${s.step}-${i}`} sx={{ display: "flex", alignItems: "center", gap: 1, py: 0.5 }}>
            {isDone ? (
              <CheckCircleIcon fontSize="small" color="success" />
            ) : (
              <CircularProgress size={14} thickness={5} />
            )}
            <Typography variant="body2" sx={{ flexGrow: 1 }}>
              <strong>{s.label}</strong> — {s.message}
            </Typography>
            {elapsed != null && <Chip size="small" variant="outlined" label={`${elapsed}ms`} />}
          </Box>
        );
      })}
    </Box>
  );
}
