/**
 * Renders a query result in the format chosen by the AI: table, chart, or mermaid.
 */
import type { JSX } from "react";
import { Box } from "@mui/material";
import type { QueryResult } from "../types/schema";
import { ResultsTable } from "./ResultsTable";
import { ChartView } from "./ChartView";
import { MermaidView } from "./MermaidView";

/** Props for {@link ResultsDisplay}. */
export interface ResultsDisplayProps { result: QueryResult; }

/** Helper: parse the optional chart hint from a JSON string. */
function parseChart(json: unknown): import("../types/schema").ChartHint | undefined {
  if (!json) return undefined;
  try { return typeof json === "string" ? JSON.parse(json) : (json as never); } catch { return undefined; }
}

/**
 * Top-level result renderer. Shows the visualisation (mermaid/chart) when
 * applicable, and the table only for tabular formats.
 *
 * @param props.result - the query result payload
 * @returns the combined result view
 */
export function ResultsDisplay({ result }: ResultsDisplayProps): JSX.Element {
  const hint = parseChart(result.chart);
  const showTable = result.format !== "mermaid" && result.format !== "markdown";
  return (
    <Box>
      {result.mermaid && <MermaidView code={result.mermaid} />}
      {hint && result.rows.length > 0 && <ChartView rows={result.rows} hint={hint} />}
      {showTable && <ResultsTable result={result} />}
    </Box>
  );
}
