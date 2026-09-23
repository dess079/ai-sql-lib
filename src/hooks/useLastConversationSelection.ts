/**
 * Persists and restores the last selected conversation for a given user.
 */
import { useEffect } from "react";
import type { Conversation } from "../types/conversation";

/** Parameters for {@link useLastConversationSelection}. */
export interface UseLastConversationSelectionParams {
  userId: string;
  conversationId: string | null;
  conversations: Conversation[];
  setConversationId: (id: string | null) => void;
  setSessionId: (id: string | null) => void;
  clear: () => void;
  loadHistory: (id: string) => Promise<void>;
  /** When true, skip restoration (e.g. a draft "New Session" is active). */
  skip?: boolean;
}

/**
 * Restores the previously selected conversation when returning to the screen.
 *
 * @param params - chat identity and selection dependencies
 */
export function useLastConversationSelection(params: UseLastConversationSelectionParams): void {
  const { userId, conversationId, conversations, setConversationId, setSessionId, clear, loadHistory, skip = false } = params;
  const key = `ai-sql.lastConversationId:${userId}`;

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    if (!conversationId || conversationId.startsWith("draft-session-")) {
      return;
    }

    window.localStorage.setItem(key, conversationId);
  }, [conversationId, key]);

  useEffect(() => {
    if (typeof window === "undefined" || skip) {
      return;
    }

    if (conversationId || conversations.length === 0) {
      return;
    }

    const savedId = window.localStorage.getItem(key);
    if (!savedId) {
      return;
    }

    const exists = conversations.some((conversation) => conversation.id === savedId);
    if (!exists) {
      window.localStorage.removeItem(key);
      return;
    }

    clear();
    setSessionId(null);
    setConversationId(savedId);
    void loadHistory(savedId);
  }, [clear, conversationId, conversations, key, loadHistory, setConversationId, setSessionId, skip]);
}