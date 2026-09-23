/**
 * Mapping des types ai-sql (Message, QueryResult) vers les types
 * backend-agnostiques de shared-components (AiChatMessage).
 */
import type { Message } from "../types/conversation";
import type { QueryResult } from "../types/schema";
import type { AiChatMessage, AiQueryResult } from "shared-components";

/** Convertit un QueryResult ai-sql en AiQueryResult shared-components. */
export function toAiQueryResult(r: QueryResult): AiQueryResult {
  return {
    format: r.format,
    columns: r.columns,
    rows: r.rows,
    rowCount: r.rowCount,
    truncated: r.truncated,
    chart: r.chart ?? null,
    mermaid: r.mermaid ?? null,
  };
}

/** Convertit un Message persisté en AiChatMessage shared-components. */
export function toAiChatMessage(m: Message): AiChatMessage {
  return {
    id: m.id,
    role: m.role,
    content: m.content,
    code: m.sql,
    result: m.queryResult ? toAiQueryResult(m.queryResult) : null,
    model: m.model,
    provider: m.provider,
    createdAt: m.createdAt,
  };
}