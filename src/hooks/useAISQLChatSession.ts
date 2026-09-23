/**
 * Derives the visible active conversation and sidebar actions for the AI-SQL chat.
 */
import { useCallback, useMemo } from "react";
import type { Conversation } from "../types/conversation";
import type { AISQLEvent } from "../types/events";

/** Parameters for {@link useAISQLChatSession}. */
export interface UseAISQLChatSessionParams {
  conversations: Conversation[];
  conversationId: string | null;
  draftConversationId: string | null;
  selectedProviderLabel?: string;
  model: string | null;
  userId: string;
  submit: (prompt: string, options: { model?: string; conversationId?: string; userId: string }) => Promise<{ sessionId: string; conversationId: string }>;
  setConversationId: (id: string | null) => void;
  setSessionId: (id: string | null) => void;
  setStreaming: (value: boolean) => void;
  reset: (prompt: string, providerLabel?: string) => void;
  clear: () => void;
  clearHistory: () => void;
  apply: (event: AISQLEvent) => void;
  onSubmitResolved: (previousConversationId: string | null, persistedConversationId: string) => void;
  startNewSession: () => void;
  loadHistory: (id: string) => Promise<void>;
}

/** Result of {@link useAISQLChatSession}. */
export interface UseAISQLChatSessionResult {
  activeSidebarId: string | null;
  activeTitle: string;
  onSubmit: (prompt: string) => Promise<void>;
  onSelectConversation: (id: string) => void;
  onNewSession: () => void;
}

/**
 * Builds the chat actions used by the sidebar and toolbar.
 *
 * @param params - chat state and side effects
 * @returns derived selection plus event handlers
 */
export function useAISQLChatSession(params: UseAISQLChatSessionParams): UseAISQLChatSessionResult {
  const { conversations, conversationId, draftConversationId, selectedProviderLabel, model, userId, submit, setConversationId, setSessionId, setStreaming, reset, clear, clearHistory, apply, onSubmitResolved, startNewSession, loadHistory } = params;

  const activeSidebarId = useMemo(() => (conversations.some((conversation) => conversation.id === conversationId) ? conversationId : draftConversationId), [conversationId, conversations, draftConversationId]);
  const activeTitle = useMemo(() => conversations.find((conversation) => conversation.id === activeSidebarId)?.title ?? "", [activeSidebarId, conversations]);

  const onSubmit = useCallback(async (prompt: string): Promise<void> => {
    reset(prompt, selectedProviderLabel);
    setStreaming(true);
    clearHistory();

    try {
      const res = await submit(prompt, { model: model ?? undefined, conversationId: conversationId ?? undefined, userId });

      setSessionId(res.sessionId);
      setConversationId(res.conversationId);
      onSubmitResolved(activeSidebarId, res.conversationId);
    } catch (e) {
      setStreaming(false);
      apply({ event: "error", data: { error: e instanceof Error ? e.message : "La requête a échoué. Veuillez réessayer.", code: "SUBMIT_ERROR" } });
    }
  }, [activeSidebarId, apply, clearHistory, conversationId, model, onSubmitResolved, reset, selectedProviderLabel, setConversationId, setSessionId, setStreaming, submit, userId]);

  const onSelectConversation = useCallback((id: string): void => {
    clear();
    setSessionId(null);

    if (id.startsWith("draft-session-")) {
      setConversationId(null);
      clearHistory();
      return;
    }

    setConversationId(id);
    void loadHistory(id);
  }, [clear, clearHistory, loadHistory, setConversationId, setSessionId]);

  const onNewSession = useCallback((): void => {
    startNewSession();
    setConversationId(null);
    setSessionId(null);
    setStreaming(false);
    clear();
    clearHistory();
  }, [clear, clearHistory, setConversationId, setSessionId, setStreaming, startNewSession]);

  return { activeSidebarId, activeTitle, onSubmit, onSelectConversation, onNewSession };
}