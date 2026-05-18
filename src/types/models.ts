/**
 * AI provider + model metadata used by the model selector chip.
 * The backend returns this from `GET /api/ai-sql/models`.
 */

/** Curated list of supported provider keys. Mirrors Spring AI provider names. */
export type ProviderKey =
  | "openai"
  | "anthropic"
  | "azure-openai"
  | "github-models"
  | "ollama"
  | "gemini"
  | "mistral";

/** A single selectable model. */
export interface AIModel {
  /** Stable id, e.g. `gpt-4o`, `claude-opus-4-5`. */
  id: string;
  /** Human label shown in UI. */
  label: string;
  /** Provider this model belongs to. */
  provider: ProviderKey;
  /** Max context window in tokens. */
  contextWindow: number;
  /** Whether this is the recommended default for the provider. */
  recommended?: boolean;
}

/** Provider group as returned by the backend. */
export interface AIProvider {
  key: ProviderKey;
  label: string;
  /** True if API key / endpoint is configured on the server. */
  enabled: boolean;
  models: AIModel[];
}

/** Token accounting for the current session and model. */
export interface TokenUsage {
  model: string;
  used: number;
  /** Max tokens supported by the model (= AIModel.contextWindow). */
  max: number;
  /** Optional split for richer UI display. */
  promptTokens?: number;
  completionTokens?: number;
}
