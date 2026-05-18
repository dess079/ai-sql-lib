/**
 * Manages conversation history display and detail dialog state for {@link AISQLChat}.
 */
import { useState, useCallback } from "react";
import type { Message } from "../types/conversation";

/** Return type of {@link useSessionHistory}. */
export interface UseSessionHistoryResult {
  historyMessages: Message[];
  loadHistory: (id: string) => Promise<void>;
  clearHistory: () => void;
  detailOpen: boolean;
  detailTitle: string;
  detailMsgs: Message[];
  detailLoading: boolean;
  openDetail: (id: string, title: string) => Promise<void>;
  closeDetail: () => void;
}

/**
 * Tracks loaded conversation history (main view) and detail dialog state.
 *
 * @param loadMessages - async message fetcher from {@link useConversation}
 * @returns history + detail dialog state and action callbacks
 */
export function useSessionHistory(
  loadMessages: (id: string) => Promise<Message[]>,
): UseSessionHistoryResult {
  const [historyMessages, setHistoryMessages] = useState<Message[]>([]);
  const [detailOpen, setDetailOpen] = useState(false);
  const [detailTitle, setDetailTitle] = useState("");
  const [detailMsgs, setDetailMsgs] = useState<Message[]>([]);
  const [detailLoading, setDetailLoading] = useState(false);

  const loadHistory = useCallback(async (id: string): Promise<void> => {
    try { setHistoryMessages(await loadMessages(id)); } catch { /* noop */ }
  }, [loadMessages]);

  const clearHistory = useCallback(() => setHistoryMessages([]), []);

  const openDetail = useCallback(async (id: string, title: string): Promise<void> => {
    setDetailOpen(true); setDetailLoading(true); setDetailTitle(title);
    try { setDetailMsgs(await loadMessages(id)); } catch { /* noop */ }
    finally { setDetailLoading(false); }
  }, [loadMessages]);

  const closeDetail = useCallback(() => setDetailOpen(false), []);

  return {
    historyMessages, loadHistory, clearHistory,
    detailOpen, detailTitle, detailMsgs, detailLoading, openDetail, closeDetail,
  };
}
