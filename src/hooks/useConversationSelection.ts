/**
 * Manages conversation selection state and bulk actions for the sidebar.
 */
import { useState } from "react";
import type { Conversation } from "../types/conversation";

/** Input dependencies for {@link useConversationSelection}. */
export interface UseConversationSelectionParams {
  conversationId: string | null;
  conversations: Conversation[];
  clear: () => void;
  clearHistory: () => void;
  remove: (id: string) => Promise<void>;
  removeMany: (ids: string[]) => Promise<void>;
  copy: (id: string) => Promise<Conversation>;
  setConversationId: (id: string | null) => void;
}

/** Output contract of {@link useConversationSelection}. */
export interface UseConversationSelectionResult {
  selectedIds: string[];
  toggleSelect: (id: string) => void;
  toggleSelectAll: () => void;
  deleteSelected: () => Promise<void>;
  deleteOne: (id: string) => Promise<void>;
  copySession: (id: string) => Promise<void>;
}

/**
 * Provides selection toggles and batch operations for conversation rows.
 *
 * @param params - conversation state and action dependencies
 * @returns selected ids and row/bulk action handlers
 */
export function useConversationSelection(params: UseConversationSelectionParams): UseConversationSelectionResult {
  const { conversationId, conversations, clear, clearHistory, remove, removeMany, copy, setConversationId } = params;
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const toggleSelect = (id: string): void => {
    setSelectedIds((prev) => prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]);
  };

  const toggleSelectAll = (): void => {
    setSelectedIds((prev) => prev.length === conversations.length ? [] : conversations.map((c) => c.id));
  };

  const deleteSelected = async (): Promise<void> => {
    if (selectedIds.length === 0) return;

    await removeMany(selectedIds);

    if (conversationId && selectedIds.includes(conversationId)) {
      setConversationId(null);
      clearHistory();
      clear();
    }

    setSelectedIds([]);
  };

  const deleteOne = async (id: string): Promise<void> => {
    await remove(id);

    if (conversationId === id) {
      setConversationId(null);
      clearHistory();
      clear();
    }

    setSelectedIds((prev) => prev.filter((x) => x !== id));
  };

  const copySession = async (id: string): Promise<void> => {
    await copy(id);
  };

  return { selectedIds, toggleSelect, toggleSelectAll, deleteSelected, deleteOne, copySession };
}
