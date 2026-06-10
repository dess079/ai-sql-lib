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
 * @param authToken  - optional Bearer token for authenticated backends
 */
async function extractErrorMessage(response: Response): Promise<string> {
  const text = await response.text();

  if (!text) {
    return `HTTP ${response.status}`;
  }

  try {
    const json = JSON.parse(text);
    if (json && typeof json === "object") {
      return (json.message as string) ?? (json.error as string) ?? JSON.stringify(json);
    }
  } catch {
    // Not JSON, fall through to raw text
  }

  return text;
}

export function useSubmitQuery(backendUrl: string, authToken?: string): UseSubmitQueryResult {
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
        headers: {
          "Content-Type": "application/json",
          ...(authToken ? { Authorization: `Bearer ${authToken}` } : {}),
        },
        body: JSON.stringify({ prompt, ...opts }),
      });

      if (!r.ok) {
        const msg = await extractErrorMessage(r);
        throw new Error(msg);
      }

      return await r.json();
    } catch (e) {
      const msg = e instanceof Error ? e.message : String(e);
      setError(msg);
      throw new Error(msg);
    } finally {
      setSubmitting(false);
    }
  }, [backendUrl, authToken]);

  return { submit, submitting, error };
}
