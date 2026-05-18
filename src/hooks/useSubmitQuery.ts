/**
 * Submits a new query to the backend and returns the freshly minted session id.
 */
import { useCallback, useState } from "react";

/** Return type of {@link useSubmitQuery}. */
export interface UseSubmitQueryResult {
  submit: (prompt: string, opts?: { model?: string; conversationId?: string; userId?: string }) => Promise<{ sessionId: string; conversationId: string }>;
  submitting: boolean;
  error?: string;
}

/**
 * Hook wrapping `POST /api/ai-sql/query`.
 *
 * @param backendUrl - absolute backend URL
 */
export function useSubmitQuery(backendUrl: string): UseSubmitQueryResult {
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | undefined>();

  const submit = useCallback(async (
    prompt: string,
    opts: { model?: string; conversationId?: string; userId?: string } = {},
  ) => {
    setSubmitting(true); setError(undefined);
    try {
      const r = await fetch(`${backendUrl}/api/ai-sql/query`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt, ...opts }),
      });
      if (!r.ok) throw new Error(`HTTP ${r.status}`);
      return await r.json();
    } catch (e) {
      const msg = e instanceof Error ? e.message : String(e);
      setError(msg);
      throw e;
    } finally {
      setSubmitting(false);
    }
  }, [backendUrl]);

  return { submit, submitting, error };
}
