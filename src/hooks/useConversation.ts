/**
 * Loads + manages a user's conversations.
 */
import { useCallback, useEffect, useState } from "react";
import type { Conversation, Message } from "../types/conversation";

/** Return type of {@link useConversation}. */
export interface UseConversationResult {
  conversations: Conversation[];
  loading: boolean;
  error?: string;
  reload: () => void;
  loadMessages: (id: string) => Promise<Message[]>;
  remove: (id: string) => Promise<void>;
  removeMany: (ids: string[]) => Promise<void>;
  copy: (id: string) => Promise<Conversation>;
  rename: (id: string, title: string) => Promise<void>;
}

/**
 * Hook to list conversations for a user and fetch their messages on demand.
 *
 * @param backendUrl - absolute backend URL
 * @param userId     - user id (defaults to "default" on the server)
 * @param authToken  - optional Bearer token for authenticated backends
 */
export function useConversation(backendUrl: string, userId = "default", authToken?: string): UseConversationResult {
  const authHdr: Record<string, string> = authToken ? { Authorization: `Bearer ${authToken}` } : {};
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | undefined>();
  const hasConversations = conversations.length > 0;

  const reload = useCallback(() => {
    if (!hasConversations) {
      setLoading(true);
    }

    setError(undefined);

    fetch(`${backendUrl}/api/ai-sql/conversations?userId=${encodeURIComponent(userId)}`, { headers: authHdr })
      .then((r) => (r.ok ? r.json() : Promise.reject(new Error(`HTTP ${r.status}`))))
      .then((data: Conversation[]) => setConversations(data))
      .catch((e: Error) => setError(e.message))
      .finally(() => {
        if (!hasConversations) {
          setLoading(false);
        }
      });
  }, [backendUrl, userId, authToken, hasConversations]);

  useEffect(() => { reload(); }, [reload]);

  const loadMessages = useCallback(async (id: string): Promise<Message[]> => {
    const r = await fetch(`${backendUrl}/api/ai-sql/conversations/${encodeURIComponent(id)}/messages`, { headers: authHdr });
    if (!r.ok) throw new Error(`HTTP ${r.status}`);
    return r.json();
  }, [backendUrl, authToken]);

  const remove = useCallback(async (id: string): Promise<void> => {
    const r = await fetch(`${backendUrl}/api/ai-sql/conversations/${encodeURIComponent(id)}`, { method: "DELETE", headers: authHdr });
    if (!r.ok) throw new Error(`HTTP ${r.status}`);
    reload();
  }, [backendUrl, authToken, reload]);

  const removeMany = useCallback(async (ids: string[]): Promise<void> => {
    const uniqueIds = [...new Set(ids.map((id) => id.trim()).filter(Boolean))];
    if (uniqueIds.length === 0) {
      return;
    }

    for (const id of uniqueIds) {
      const r = await fetch(`${backendUrl}/api/ai-sql/conversations/${encodeURIComponent(id)}`, {
        method: "DELETE",
        headers: authHdr,
      });

      if (!r.ok) {
        throw new Error(`HTTP ${r.status}`);
      }
    }

    reload();
  }, [backendUrl, authToken, reload]);

  const copy = useCallback(async (id: string): Promise<Conversation> => {
    const r = await fetch(`${backendUrl}/api/ai-sql/conversations/${encodeURIComponent(id)}/copy`, {
      method: "POST",
      headers: authHdr,
    });
    if (!r.ok) throw new Error(`HTTP ${r.status}`);
    const cloned = await r.json() as Conversation;
    reload();
    return cloned;
  }, [backendUrl, authToken, reload]);

  const rename = useCallback(async (id: string, title: string): Promise<void> => {
    const r = await fetch(`${backendUrl}/api/ai-sql/conversations/${encodeURIComponent(id)}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json", ...authHdr },
      body: JSON.stringify({ title }),
    });
    if (!r.ok) throw new Error(`HTTP ${r.status}`);
    reload();
  }, [backendUrl, authToken, reload]);

  return { conversations, loading, error, reload, loadMessages, remove, removeMany, copy, rename };
}
