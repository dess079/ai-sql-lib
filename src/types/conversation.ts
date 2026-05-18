/**
 * Conversation + message types for the conversation sidebar.
 */

import type { QueryResult } from "./schema";

/** Author of a message. */
export type MessageRole = "user" | "assistant" | "system";

export interface Message {
  id: string;
  conversationId: string;
  role: MessageRole;
  /** Final rendered content (markdown). */
  content: string;
  /** Optional SQL that produced the content, when role === "assistant". */
  sql?: string;
  /** Model used to produce this assistant message. */
  model?: string;
  /** Persisted query result (columns, rows, chart hint, mermaid) for history rendering. */
  queryResult?: QueryResult;
  createdAt: string;
}

export interface Conversation {
  id: string;
  userId: string;
  title: string;
  /** Last model used in this conversation. */
  model?: string;
  createdAt: string;
  updatedAt: string;
}
