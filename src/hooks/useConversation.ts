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

  const reload = useCallback(() => {
    setLoading(true); setError(undefined);
    fetch(`${backendUrl}/api/ai-sql/conversations?userId=${encodeURIComponent(userId)}`, { headers: authHdr })
      .then((r) => (r.ok ? r.json() : Promise.reject(new Error(`HTTP ${r.status}`))))
      .then((data: Conversation[]) => setConversations(data))
      .catch((e: Error) => setError(e.message))
      .finally(() => setLoading(false));
  }, [backendUrl, userId, authToken]);

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

  const rename = useCallback(async (id: string, title: string): Promise<void> => {
    const r = await fetch(`${backendUrl}/api/ai-sql/conversations/${encodeURIComponent(id)}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json", ...authHdr },
      body: JSON.stringify({ title }),
    });
    if (!r.ok) throw new Error(`HTTP ${r.status}`);
    reload();
  }, [backendUrl, authToken, reload]);

  return { conversations, loading, error, reload, loadMessages, remove, rename };
}
