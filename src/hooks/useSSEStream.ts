/**
 * Subscribes to a Server-Sent Events stream from the AI-SQL backend using
 * fetch-based SSE (supports custom auth headers unlike native EventSource).
 */
import { useEffect, useRef } from "react";
import type { AISQLEvent } from "../types/events";
import { drainSSE } from "./sseUtils";

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
  /** Optional Bearer token for authenticated backends. */
  authToken?: string;
}

/**
 * Opens a fetch-based SSE stream to `${backendUrl}/api/ai-sql/sessions/{sessionId}/stream`,
 * after optionally replaying the buffered event history.
 *
 * @param opts - stream configuration including optional Bearer authToken
 */
export function useSSEStream(opts: UseSSEStreamOptions): void {
  const { backendUrl, sessionId, onEvent, onClose, replay = true, authToken } = opts;

  const onEventRef = useRef(onEvent);
  const onCloseRef = useRef(onClose);
  onEventRef.current = onEvent;
  onCloseRef.current = onClose;

  useEffect(() => {
    if (!sessionId) return;

    let cancelled = false;
    const ctrl = new AbortController();
    const authHdr: Record<string, string> = authToken
      ? { Authorization: `Bearer ${authToken}` }
      : {};

    const openStream = async () => {
      if (cancelled) return;
      try {
        const r = await fetch(
          `${backendUrl}/api/ai-sql/sessions/${sessionId}/stream`,
          { headers: { Accept: "text/event-stream", ...authHdr }, signal: ctrl.signal },
        );

        if (!r.ok || !r.body) {
          const text = r.body ? await r.text() : "";
          const errorMessage = text || `Stream error HTTP ${r.status}`;
          onEventRef.current({ event: "error", data: { error: errorMessage, code: "STREAM_OPEN_FAILED" } });
          return;
        }

        await drainSSE(
          r.body,
          (e) => onEventRef.current(e),
          (reason) => onCloseRef.current?.(reason),
          () => cancelled,
        );
      } catch (e) {
        if (!cancelled) {
          const msg = e instanceof Error ? e.message : String(e);
          onEventRef.current({ event: "error", data: { error: `Erreur de connexion SSE : ${msg}`, code: "STREAM_ERROR" } });
        }
      }
    };

    if (replay) {
      fetch(`${backendUrl}/api/ai-sql/sessions/${sessionId}/replay`, { headers: authHdr })
        .then((r) => (r.ok ? r.json() : []))
        .then((rows: { name: string; data: unknown }[]) => {
          if (cancelled) return;
          rows.forEach((row) => onEventRef.current({ event: row.name, data: row.data } as AISQLEvent));
          void openStream();
        })
        .catch(() => void openStream());
    } else {
      void openStream();
    }

    return () => { cancelled = true; ctrl.abort(); onCloseRef.current?.("unmount"); };
  }, [backendUrl, sessionId, replay, authToken]);
}
