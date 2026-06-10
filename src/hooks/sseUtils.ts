/**
 * Low-level SSE stream utilities shared by {@link useSSEStream}.
 */
import type { AISQLEvent } from "../types/events";

/** Reason a stream was closed. */
export type SSECloseReason = "complete" | "error" | "unmount";

/** All known AI-SQL event names. */
export const SSE_EVENTS: AISQLEvent["event"][] = [
  "session_start", "schema_built", "prompt_rephrased", "step_start",
  "sql_generated", "sql_validated", "query_executing", "query_result",
  "render_start", "content_chunk", "complete", "error", "token_usage",
];

/**
 * Reads a fetch-based SSE ReadableStream and dispatches typed {@link AISQLEvent}s.
 *
 * @param body        - response body as a readable byte stream
 * @param onEvent     - called for every valid named event
 * @param onClose     - called once when the stream ends or fails
 * @param isCancelled - predicate; returns true after the parent effect cleans up
 */
export async function drainSSE(
  body: ReadableStream<Uint8Array>,
  onEvent: (e: AISQLEvent) => void,
  onClose: (r: SSECloseReason) => void,
  isCancelled: () => boolean,
): Promise<void> {
  const reader = body.getReader();
  const decoder = new TextDecoder();
  let buf = "";
  let evtType = "";
  let evtData = "";

  const flushEvent = (): void => {
    if (!evtType || !evtData) {
      return;
    }

    try {
      const data = JSON.parse(evtData);
      if ((SSE_EVENTS as string[]).includes(evtType)) {
        onEvent({ event: evtType, data } as AISQLEvent);
      }
      if (evtType === "complete") {
        onClose("complete");
        throw new Error("stream-complete");
      }
    } catch {
      // Ignore malformed SSE frames.
    } finally {
      evtType = "";
      evtData = "";
    }
  };

  try {
    while (!isCancelled()) {
      const { done, value } = await reader.read();

      if (done) {
        flushEvent();
        onClose("complete");
        return;
      }

      buf += decoder.decode(value, { stream: true });
      const lines = buf.split(/\r?\n/);
      buf = lines.pop() ?? "";

      for (const line of lines) {
        if (line.startsWith("event:")) {
          evtType = line.slice(6).trim();
        } else if (line.startsWith("data:")) {
          const next = line.slice(5).trimStart();
          evtData = evtData ? `${evtData}\n${next}` : next;
        } else if (line.trim() === "" && evtType) {
          flushEvent();
        }
      }
    }
  } catch (error) {
    if (error instanceof Error && error.message === "stream-complete") {
      return;
    }
    if (!isCancelled()) {
      onClose("error");
    }
  } finally {
    reader.releaseLock();
  }
}
