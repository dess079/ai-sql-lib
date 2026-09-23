/**
 * Tracks a local draft conversation created by "New Session" and marks it as new.
 */
import { useMemo, useState } from "react";
import type { Conversation } from "../types/conversation";

const DRAFT_PREFIX = "draft-session-";

/** Conversation row rendered in the sidebar with a stable UI key. */
export interface ConversationRow extends Conversation {
  backendId?: string;
  isDraft: boolean;
  isNew: boolean;
}

/** Output contract for {@link useNewSessionDraft}. */
export interface UseNewSessionDraftResult {
  listConversations: ConversationRow[];
  draftConversationId: string | null;
  pendingConversationId: string | null;
  startNewSession: () => string;
  onSubmitResolved: (previousConversationId: string | null, persistedConversationId: string) => void;
}

/**
 * Provides a temporary session row for instant UX feedback on "New Session".
 *
 * @param conversations - persisted conversations fetched from the backend
 * @param userId - current user id
 * @returns draft/session-new helpers for sidebar rendering
 */
export function useNewSessionDraft(conversations: Conversation[], userId: string): UseNewSessionDraftResult {
  const [draftConversation, setDraftConversation] = useState<Conversation | null>(null);
  const [pendingConversationId, setPendingConversationId] = useState<string | null>(null);

  const listConversations = useMemo(() => {
    const baseRows = conversations
      .filter((conversation) => conversation.id !== pendingConversationId)
      .map((conversation) => ({ ...conversation, backendId: conversation.id, isDraft: false, isNew: false }));

    if (!draftConversation) {
      return baseRows;
    }

    const persisted = pendingConversationId ? conversations.find((conversation) => conversation.id === pendingConversationId) : undefined;

    const draftRow = persisted
      ? { ...persisted, id: draftConversation.id, backendId: persisted.id, isDraft: false, isNew: false }
      : { ...draftConversation, backendId: undefined, isDraft: true, isNew: true };

    return [draftRow, ...baseRows];
  }, [conversations, draftConversation, pendingConversationId]);

  const startNewSession = (): string => {
    const now = new Date().toISOString();
    const id = `${DRAFT_PREFIX}${Date.now()}`;

    setDraftConversation({ id, userId, title: "Nouvelle session", model: undefined, createdAt: now, updatedAt: now });
    setPendingConversationId(null);

    return id;
  };

  const onSubmitResolved = (previousConversationId: string | null, persistedConversationId: string): void => {
    if (previousConversationId?.startsWith(DRAFT_PREFIX)) {
      setPendingConversationId(persistedConversationId);
    }
  };

  return {
    listConversations,
    draftConversationId: draftConversation?.id ?? null,
    pendingConversationId,
    startNewSession,
    onSubmitResolved,
  };
}