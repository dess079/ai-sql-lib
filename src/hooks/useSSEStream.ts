/**
 * Subscribes to a Server-Sent Events stream from the AI-SQL backend.
 * Handles auto-reconnect with replay so users can navigate away and return.
 *
 * The hook is unopinionated: it just delivers typed events to a handler.
 */
import { useEffect, useRef } from "react";
import type { AISQLEvent } from "../types/events";

/** Options for {@link useSSEStream}. */
export interface UseSSEStreamOptions {
  /** Absolute backend URL (no trailing slash). */
  backendUrl: string;
  /** Active session id; `null` disables the stream. */
  sessionId: string | null;
  /** Callback invoked for every parsed event. */
  onEvent: (event: AISQLEvent) => void;
  /** Callback invoked when the stream closes (clean or error). */
  onClose?: (reason: "complete" | "error" | "unmount") => void;
  /** If true, fetch buffered events from `/replay` first (default true). */
  replay?: boolean;
}

/**
 * Opens an `EventSource` to `${backendUrl}/api/ai-sql/sessions/{sessionId}/stream`,
 * after optionally replaying the buffered event history.
 *
 * @param opts - stream configuration
 */
export function useSSEStream(opts: UseSSEStreamOptions): void {
  const { backendUrl, sessionId, onEvent, onClose, replay = true } = opts;
  const onEventRef = useRef(onEvent);
  const onCloseRef = useRef(onClose);
  onEventRef.current = onEvent;
  onCloseRef.current = onClose;

  useEffect(() => {
    if (!sessionId) return;
    let cancelled = false;
    let es: EventSource | null = null;

    const open = () => {
      if (cancelled) return;
      es = new EventSource(`${backendUrl}/api/ai-sql/sessions/${sessionId}/stream`);
      const handler = (name: AISQLEvent["event"]) => (e: MessageEvent) => {
        try {
          const data = JSON.parse(e.data);
          onEventRef.current({ event: name, data } as AISQLEvent);
          if (name === "complete") { es?.close(); onCloseRef.current?.("complete"); }
        } catch { /* ignore malformed frame */ }
      };
      const names: AISQLEvent["event"][] = [
        "session_start", "schema_built", "prompt_rephrased", "step_start",
        "sql_generated", "sql_validated", "query_executing", "query_result",
        "render_start", "content_chunk", "complete", "error", "token_usage",
      ];
      names.forEach((n) => es!.addEventListener(n, handler(n)));
      es.onerror = () => { es?.close(); onCloseRef.current?.("error"); };
    };

    if (replay) {
      fetch(`${backendUrl}/api/ai-sql/sessions/${sessionId}/replay`)
        .then((r) => (r.ok ? r.json() : []))
        .then((rows: { name: string; data: unknown }[]) => {
          if (cancelled) return;
          rows.forEach((row) => onEventRef.current({ event: row.name, data: row.data } as AISQLEvent));
          open();
        })
        .catch(() => open());
    } else {
      open();
    }

    return () => { cancelled = true; es?.close(); onCloseRef.current?.("unmount"); };
  }, [backendUrl, sessionId, replay]);
}
