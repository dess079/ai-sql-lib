/**
 * Stores per-conversation execution outcomes for history restoration.
 */
import { useCallback } from "react";

const KEY_PREFIX = "ai-sql.outcome:";

/** Outcome metadata for a conversation run. */
export interface ConversationOutcome {
  status: "success" | "error";
  message?: string;
  at: string;
}

/**
 * Persists and reads conversation outcomes in localStorage.
 *
 * @returns outcome helpers scoped by conversation id
 */
export function useConversationOutcome(): {
  saveSuccess: (conversationId: string) => void;
  saveError: (conversationId: string, message: string) => void;
  readOutcome: (conversationId: string) => ConversationOutcome | undefined;
} {
  const saveSuccess = useCallback((conversationId: string): void => {
    if (typeof window === "undefined" || !conversationId) return;

    const outcome: ConversationOutcome = { status: "success", at: new Date().toISOString() };
    window.localStorage.setItem(`${KEY_PREFIX}${conversationId}`, JSON.stringify(outcome));
  }, []);

  const saveError = useCallback((conversationId: string, message: string): void => {
    if (typeof window === "undefined" || !conversationId) return;

    const outcome: ConversationOutcome = { status: "error", message, at: new Date().toISOString() };
    window.localStorage.setItem(`${KEY_PREFIX}${conversationId}`, JSON.stringify(outcome));
  }, []);

  const readOutcome = useCallback((conversationId: string): ConversationOutcome | undefined => {
    if (typeof window === "undefined" || !conversationId) return undefined;

    const raw = window.localStorage.getItem(`${KEY_PREFIX}${conversationId}`);
    if (!raw) return undefined;

    try {
      return JSON.parse(raw) as ConversationOutcome;
    } catch {
      return undefined;
    }
  }, []);

  return { saveSuccess, saveError, readOutcome };
}