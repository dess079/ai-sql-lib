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
 */
export function useConversation(backendUrl: string, userId = "default"): UseConversationResult {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | undefined>();

  const reload = useCallback(() => {
    setLoading(true); setError(undefined);
    fetch(`${backendUrl}/api/ai-sql/conversations?userId=${encodeURIComponent(userId)}`)
      .then((r) => (r.ok ? r.json() : Promise.reject(new Error(`HTTP ${r.status}`))))
      .then((data: Conversation[]) => setConversations(data))
      .catch((e: Error) => setError(e.message))
      .finally(() => setLoading(false));
  }, [backendUrl, userId]);

  useEffect(() => { reload(); }, [reload]);

  const loadMessages = useCallback(async (id: string): Promise<Message[]> => {
    const r = await fetch(`${backendUrl}/api/ai-sql/conversations/${encodeURIComponent(id)}/messages`);
    if (!r.ok) throw new Error(`HTTP ${r.status}`);
    return r.json();
  }, [backendUrl]);

  const remove = useCallback(async (id: string): Promise<void> => {
    const r = await fetch(`${backendUrl}/api/ai-sql/conversations/${encodeURIComponent(id)}`, { method: "DELETE" });
    if (!r.ok) throw new Error(`HTTP ${r.status}`);
    reload();
  }, [backendUrl, reload]);

  const rename = useCallback(async (id: string, title: string): Promise<void> => {
    const r = await fetch(`${backendUrl}/api/ai-sql/conversations/${encodeURIComponent(id)}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title }),
    });
    if (!r.ok) throw new Error(`HTTP ${r.status}`);
    reload();
  }, [backendUrl, reload]);

  return { conversations, loading, error, reload, loadMessages, remove, rename };
}
