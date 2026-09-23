/**
 * High-level state machine for an AI-SQL session.
 * Aggregates all event types into a single immutable state object.
 */
import { useCallback, useReducer } from "react";
import type { AISQLEvent, StepLabel } from "../types/events";
import type { TokenUsage } from "../types/models";
import type { QueryResult } from "../types/schema";

/** One entry in the live process timeline. */
export interface TimelineStep { step: number; label: StepLabel; message: string; doneAt?: number; }

/** A completed turn, archived when a new query starts in the same session. */
export interface CompletedTurn { userPrompt?: string; model?: string; provider?: string; rephrased?: string; sql?: string; result?: QueryResult; narrative: string; }

/** Aggregated state of an active session. */
export interface AISQLState {
  sessionId: string | null;
  model: string | null;
  tokenUsage: TokenUsage | null;
  currentPrompt: string | null;
  rephrased?: string;
  steps: TimelineStep[];
  sql?: string;
  validationIssues: string[];
  result?: QueryResult;
  narrative: string;
  finished: boolean;
  error?: string;
  /** Set during SQL retry (1-based attempt number), cleared on success or new session. */
  retryAttempt?: number;
  retryMax?: number;
  /** Turns completed before this one, within the same browser session. */
  completedTurns: CompletedTurn[];
}

const empty: AISQLState = { sessionId: null, model: null, tokenUsage: null, currentPrompt: null, steps: [], validationIssues: [], narrative: "", finished: false, completedTurns: [] };

/** Internal reset/clear actions (not part of the public SSE event contract). */
type ReducerAction = AISQLEvent | { event: "_reset"; prompt?: string; provider?: string } | { event: "_clear" };

/** Reducer applying one SSE event to the session state. */
function reduce(s: AISQLState, e: ReducerAction): AISQLState {
  if (e.event === "_clear") return { ...empty };
  if (e.event === "_reset") {
    const live = s.steps.length > 0 || !!s.result || !!s.sql;
    const prompt = (e as { event: "_reset"; prompt?: string }).prompt ?? null;
    const provider = (e as { event: "_reset"; provider?: string }).provider ?? null;
    const turn: CompletedTurn = {
      userPrompt: prompt ?? undefined,
      model: s.model ?? undefined,
      provider: provider ?? undefined,
      rephrased: s.rephrased,
      sql: s.sql,
      result: s.result,
      narrative: s.narrative,
    };
    return { ...empty, currentPrompt: prompt, completedTurns: live ? [...s.completedTurns, turn] : s.completedTurns };
  }
  switch (e.event) {
    case "session_start": {
      const prevUsed = s.tokenUsage?.used ?? 0;
      const tu = e.data.tokenUsage ? { ...e.data.tokenUsage, used: prevUsed + (e.data.tokenUsage.used ?? 0) } : null;
      return { ...empty, currentPrompt: s.currentPrompt, completedTurns: s.completedTurns, sessionId: e.data.sessionId, model: e.data.model, tokenUsage: tu };
    }
    case "prompt_rephrased": return { ...s, rephrased: e.data.rephrased };
    case "step_start": {
      const now = Date.now();
      const steps = s.steps.map((x) => (x.doneAt ? x : { ...x, doneAt: now }));
      return { ...s, steps: [...steps, { step: e.data.step, label: e.data.label, message: e.data.message }] };
    }
    case "sql_generated": return { ...s, sql: e.data.sql || s.sql };
    case "sql_validated": return { ...s, validationIssues: e.data.issues };
    case "sql_retry": return { ...s, retryAttempt: e.data.attempt, retryMax: e.data.maxAttempts };
    case "token_usage": return { ...s, tokenUsage: e.data };
    case "query_result": return { ...s, result: e.data, retryAttempt: undefined };
    case "content_chunk": return { ...s, narrative: s.narrative + e.data.content };
    case "complete": {
      const now = Date.now();
      const steps = s.steps.map((x) => (x.doneAt ? x : { ...x, doneAt: now }));
      return { ...s, steps, finished: true, tokenUsage: e.data.tokenUsage, narrative: s.narrative || e.data.summary, retryAttempt: undefined };
    }
    case "error": return { ...s, error: e.data.error, finished: true };
    default: return s;
  }
}

/** Drives an AI-SQL session and exposes the aggregated state + an event handler. */
export function useAISQL(initialSessionId: string | null = null): {
  state: AISQLState; apply: (e: AISQLEvent) => void; reset: (prompt?: string, provider?: string) => void; clear: () => void;
} {
  const [state, dispatch] = useReducer(reduce, { ...empty, sessionId: initialSessionId });
  const apply = useCallback((e: AISQLEvent) => dispatch(e), []);
  const reset = useCallback((prompt?: string, provider?: string) => dispatch({ event: "_reset", prompt, provider } as unknown as AISQLEvent), []);
  const clear = useCallback(() => dispatch({ event: "_clear" } as unknown as AISQLEvent), []);
  return { state, apply, reset, clear };
}
