import type { QueryResult } from "../types/schema";

export function serializeResult(result: QueryResult): string {
  if (result.mermaid) {
    return result.mermaid.trim();
  }

  return JSON.stringify({ format: result.format, columns: result.columns, rows: result.rows }, null, 2);
}

export function serializeAIOutput({ sql, result, narrative }: { sql?: string; result?: QueryResult; narrative?: string }): string {
  const parts = [] as string[];

  if (sql) {
    parts.push(sql.trim());
  }

  if (result) {
    parts.push(serializeResult(result));
  }

  if (narrative) {
    parts.push(narrative.trim());
  }

  return parts.filter(Boolean).join("\n\n");
}
