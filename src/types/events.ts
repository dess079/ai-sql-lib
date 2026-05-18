/**
 * SSE event types streamed from `ai-sql-spring-boot-starter` to the UI.
 * Each event carries an `event` discriminator and a typed `data` payload.
 *
 * Event sequence for a typical successful query:
 *   session_start → schema_built → prompt_rephrased → step_start (multiple)
 *   → sql_generated → sql_validated → query_executing → query_result
 *   → render_start → content_chunk (multiple) → complete
 */

import type { TokenUsage } from "./models";
import type { QueryResult } from "./schema";

/** Step labels in the AI process timeline (1-based index). */
export type StepLabel =
  | "understand"
  | "extract-schema"
  | "generate-sql"
  | "validate-sql"
  | "execute-sql"
  | "analyze-results"
  | "render";

export interface SessionStartEvent { event: "session_start"; data: { sessionId: string; model: string; tokenUsage: TokenUsage }; }
export interface SchemaBuiltEvent { event: "schema_built"; data: { schemaContext: string; tableCount: number }; }
export interface PromptRephrasedEvent { event: "prompt_rephrased"; data: { original: string; rephrased: string }; }
export interface StepStartEvent { event: "step_start"; data: { step: number; label: StepLabel; message: string }; }
export interface SqlGeneratedEvent { event: "sql_generated"; data: { sql: string }; }
export interface SqlValidatedEvent { event: "sql_validated"; data: { valid: boolean; issues: string[] }; }
export interface QueryExecutingEvent { event: "query_executing"; data: { message: string }; }
export interface QueryResultEvent { event: "query_result"; data: QueryResult; }
export interface RenderStartEvent { event: "render_start"; data: { format: "markdown" | "table" | "chart" | "mermaid" }; }
export interface ContentChunkEvent { event: "content_chunk"; data: { content: string }; }
export interface CompleteEvent { event: "complete"; data: { summary: string; tokenUsage: TokenUsage }; }
export interface ErrorEvent { event: "error"; data: { error: string; code: string }; }
/** Emitted before each SQL correction attempt (attempt 2 → MAX). */
export interface SqlRetryEvent { event: "sql_retry"; data: { attempt: number; maxAttempts: number; failedSql: string; error: string }; }
/** Emitted after every LLM call (rephrase, generate) with the cumulative token usage. */
export interface TokenUsageEvent { event: "token_usage"; data: TokenUsage; }

/** Discriminated union of every event emitted by the backend. */
export type AISQLEvent =
  | SessionStartEvent | SchemaBuiltEvent | PromptRephrasedEvent
  | StepStartEvent | SqlGeneratedEvent | SqlValidatedEvent
  | QueryExecutingEvent | QueryResultEvent | RenderStartEvent
  | ContentChunkEvent | CompleteEvent | ErrorEvent | SqlRetryEvent | TokenUsageEvent;

/** Narrow an `AISQLEvent` to a specific event name. */
export type EventOf<K extends AISQLEvent["event"]> = Extract<AISQLEvent, { event: K }>;
