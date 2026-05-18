/**
 * Database schema + query result types shared between backend and UI.
 */

/** A single column in a table. */
export interface ColumnDef {
  name: string;
  dataType: string;
  nullable: boolean;
  primaryKey?: boolean;
  unique?: boolean;
  /** When set, the column is a foreign key referencing `referencedTable.referencedColumn`. */
  referencedTable?: string;
  referencedColumn?: string;
  /** Free-text comment pulled from `pg_description`. */
  comment?: string;
}

/** A single table with its columns. */
export interface TableDef {
  schema: string;
  name: string;
  comment?: string;
  columns: ColumnDef[];
}

/** Full extracted schema, cached on the server. */
export interface DBSchema {
  tables: TableDef[];
  /** Pre-formatted text version embedded in the AI prompt. */
  formatted: string;
  /** ISO timestamp the schema was extracted. */
  extractedAt: string;
}

/** Recognised render formats for the result of an AI-generated query. */
export type ResultFormat = "table" | "chart" | "mermaid" | "markdown";

/** Optional chart hint emitted alongside a tabular result. */
export interface ChartHint {
  chartType: "bar" | "line" | "pie" | "scatter" | "area";
  xKey: string;
  yKeys: string[];
}

/** Tabular / chart payload streamed to the UI. */
export interface QueryResult {
  format: ResultFormat;
  columns: string[];
  rows: Array<Record<string, unknown>>;
  rowCount: number;
  truncated: boolean;
  /** Present when `format === "chart"`. */
  chart?: ChartHint;
  /** Present when `format === "mermaid"`. */
  mermaid?: string;
}
