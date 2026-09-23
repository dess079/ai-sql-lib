/**
 * Utilities for packing and unpacking provider-aware model references.
 */

/** Separator used to encode a provider + model into one request string. */
export const MODEL_REF_SEPARATOR = "|";

/** Parsed model reference parts. */
export interface ModelReference {
  provider?: string;
  model: string;
}

/**
 * Builds a request-safe model reference from a provider key and a model id.
 *
 * @param provider - provider key selected in the UI
 * @param model - model id selected in the UI
 * @returns an encoded reference when both parts are present, otherwise the model id
 */
export function buildModelReference(provider?: string, model?: string | null): string | undefined {
  if (!model) {
    return undefined;
  }

  if (!provider) {
    return model;
  }

  return `${provider}${MODEL_REF_SEPARATOR}${model}`;
}

/**
 * Splits an encoded model reference into provider and model parts.
 *
 * @param reference - encoded or plain model reference
 * @returns the parsed provider and model parts
 */
export function parseModelReference(reference?: string | null): ModelReference {
  if (!reference) {
    return { model: "" };
  }

  const index = reference.indexOf(MODEL_REF_SEPARATOR);

  if (index < 0) {
    return { model: reference };
  }

  return {
    provider: reference.slice(0, index),
    model: reference.slice(index + 1),
  };
}