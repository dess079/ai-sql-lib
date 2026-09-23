/**
 * Fetches provider readiness diagnostics from the backend.
 */
import { useEffect, useState } from "react";
import type { ProviderReadiness } from "../types/models";

/** Return type of {@link useProviderReadiness}. */
export interface UseProviderReadinessResult {
  readiness: Map<string, ProviderReadiness>;
  loading: boolean;
  error?: string;
}

/**
 * Hook that fetches provider readiness from `GET /api/ai-sql/provider-readiness`.
 *
 * @param backendUrl - absolute backend URL
 * @param authToken  - optional Bearer token
 * @returns readiness map keyed by provider key
 */
export function useProviderReadiness(backendUrl: string, authToken?: string): UseProviderReadinessResult {
  const [readiness, setReadiness] = useState<Map<string, ProviderReadiness>>(new Map());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | undefined>();

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(undefined);

    const fetchReadiness = async (): Promise<void> => {
      const url = `${backendUrl}/api/ai-sql/provider-readiness`;
      const headers: Record<string, string> = authToken ? { Authorization: `Bearer ${authToken}` } : {};

      try {
        const response = await fetch(url, { headers });

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}`);
        }

        const data: ProviderReadiness[] = await response.json();
        const map = new Map(data.map((r) => [r.key, r]));

        if (!cancelled) {
          setReadiness(map);
        }
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : "Failed to fetch provider readiness");
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    void fetchReadiness();
    return () => { cancelled = true; };
  }, [backendUrl, authToken]);

  return { readiness, loading, error };
}
