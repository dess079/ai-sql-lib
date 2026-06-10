/**
 * Fetches the curated list of AI providers + models from the backend.
 */
import { useEffect, useState } from "react";
import type { AIProvider, AIModel } from "../types/models";

/** Return type of {@link useModels}. */
export interface UseModelsResult {
  providers: AIProvider[];
  enabledModels: AIModel[];
  loading: boolean;
  error?: string;
}

/**
 * Hook that retrieves provider + model metadata from the AI backend.
 * It prefers `GET /api/ai-sql/dynamic-models`, but falls back to the legacy
 * `GET /api/ai-sql/models` route for compatibility with the installed starter.
 *
 * @param backendUrl - absolute backend URL
 * @param authToken  - optional Bearer token for authenticated backends
 */
export function useModels(backendUrl: string, authToken?: string): UseModelsResult {
  const [providers, setProviders] = useState<AIProvider[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | undefined>();

  useEffect(() => {
    let cancelled = false;
    setLoading(true);

    const fetchModels = async (): Promise<AIProvider[]> => {
      const urls = [
        `${backendUrl}/api/ai-sql/dynamic-models`,
        `${backendUrl}/api/ai-sql/models`,
      ];

      const headers = authToken ? { Authorization: `Bearer ${authToken}` } : undefined;

      for (const url of urls) {
        const response = await fetch(url, { headers });

        if (response.status === 404
          || (url.endsWith("/dynamic-models") && response.status === 403)) {
          continue;
        }

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}`);
        }

        return response.json();
      }

      throw new Error("No models endpoint available");
    };

    fetchModels()
      .then((data: AIProvider[]) => { if (!cancelled) setProviders(data); })
      .catch((e: Error) => { if (!cancelled) setError(e.message); })
      .finally(() => { if (!cancelled) setLoading(false); });

    return () => { cancelled = true; };
  }, [backendUrl, authToken]);

  const enabledModels = providers.filter((p) => p.enabled).flatMap((p) => p.models);
  return { providers, enabledModels, loading, error };
}
