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
 * Hook that retrieves provider + model metadata from `GET /api/ai-sql/models`.
 *
 * @param backendUrl - absolute backend URL
 */
export function useModels(backendUrl: string): UseModelsResult {
  const [providers, setProviders] = useState<AIProvider[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | undefined>();

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    fetch(`${backendUrl}/api/ai-sql/models`)
      .then((r) => (r.ok ? r.json() : Promise.reject(new Error(`HTTP ${r.status}`))))
      .then((data: AIProvider[]) => { if (!cancelled) setProviders(data); })
      .catch((e: Error) => { if (!cancelled) setError(e.message); })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, [backendUrl]);

  const enabledModels = providers.filter((p) => p.enabled).flatMap((p) => p.models);
  return { providers, enabledModels, loading, error };
}
