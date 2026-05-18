/**
 * Renders the tabular part of a query result with pagination.
 * Monetary columns (name keywords) → $X XXX.00. Other numeric columns → X XXX (no symbol, no decimals).
 */
import type { JSX } from "react";
import { useState } from "react";
import { Table, TableBody, TableCell, TableContainer, TableHead, TablePagination,
         TableRow, Paper, Chip, Box } from "@mui/material";
import type { QueryResult } from "../types/schema";

/** Props for {@link ResultsTable}. */
export interface ResultsTableProps { result: QueryResult; }

const MONEY_RE = /montant|amount|price|prix|total|cost|co[uû]t|salaire|salary|revenue|revenu|balance|solde|frais|tax[e]?|valeur|value|sum|somme|budget|paiement|payment|profit|d[eé]pense|expense/i;
const ID_RE = /(_id$|^id$|_key$|code$|no$|num$)/i;
/** Words that override monetary detection — time units, counts, rates, scores, etc. */
const NON_MONEY_RE = /heure|hour|minute|second|jour|day|semaine|week|mois|month|ann[eé]e?|year|quantit[eé]|qty|count|nb_|nombre|note|score|rang|rank|pourcent|percent|age|dur[eé]e|duration|taux|rate/i;

/** True only when the column name itself signals a monetary amount and not a time/count unit. */
function isMoneyCol(col: string): boolean {
  return MONEY_RE.test(col) && !ID_RE.test(col) && !NON_MONEY_RE.test(col);
}

/** True when every non-null value in the column is a finite number and it is not an ID column. */
function isNumericCol(col: string, rows: Record<string, unknown>[]): boolean {
  if (ID_RE.test(col)) return false;
  const nonNull = rows.map((r) => r[col]).filter((v) => v != null);
  return nonNull.length > 0 && nonNull.every((v) => typeof v === "number" && isFinite(v as number));
}

/** Formats a monetary value as $X XXX.00 (non-breaking space as thousands separator). */
function fmtMoney(v: unknown): string {
  if (v == null) return "";
  const n = typeof v === "number" ? v : parseFloat(String(v));
  if (isNaN(n)) return String(v);
  return "$" + new Intl.NumberFormat("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })
    .format(n).replace(/,/g, "\u00A0");
}

/** Formats a plain numeric value as an integer with thousands separator — no symbol, no decimals. */
function fmtNumber(v: unknown): string {
  if (v == null) return "";
  const n = typeof v === "number" ? v : parseFloat(String(v));
  if (isNaN(n)) return String(v);
  return new Intl.NumberFormat("en-US", { maximumFractionDigits: 0 }).format(n).replace(/,/g, "\u00A0");
}

/**
 * MUI DataTable rendering of a {@link QueryResult}.
 * Monetary columns (keyword names) → `$X XXX.00`. Other numeric columns → `X XXX`. Text columns → plain string.
 *
 * @param props.result - the query result to render
 * @returns the table JSX
 */
export function ResultsTable({ result }: ResultsTableProps): JSX.Element {
  const [page, setPage] = useState(0);
  const [rpp, setRpp] = useState(25);
  const start = page * rpp;
  const slice = result.rows.slice(start, start + rpp);

  const moneyCols = new Set(result.columns.filter((c) => isMoneyCol(c)));
  const numCols = new Set(result.columns.filter((c) => !moneyCols.has(c) && isNumericCol(c, result.rows)));

  const fmtCell = (col: string, v: unknown): string => {
    if (v == null) return "";
    if (moneyCols.has(col)) return fmtMoney(v);
    if (numCols.has(col)) return fmtNumber(v);
    if (typeof v === "object") return JSON.stringify(v);
    return String(v);
  };

  const align = (col: string) => (moneyCols.has(col) || numCols.has(col)) ? "right" as const : "left" as const;

  return (
    <Box sx={{ my: 1 }}>
      {result.truncated && <Chip size="small" color="warning" label={`Truncated at ${result.rowCount} rows`} sx={{ mb: 1 }} />}
      <TableContainer component={Paper} variant="outlined">
        <Table size="small" stickyHeader>
          <TableHead>
            <TableRow>
              {result.columns.map((c) => (
                <TableCell key={c} align={align(c)} sx={{ fontWeight: 600 }}>{c}</TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {slice.map((row, i) => (
              <TableRow key={start + i} hover>
                {result.columns.map((c) => (
                  <TableCell key={c} align={align(c)}>{fmtCell(c, row[c])}</TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        component="div"
        count={result.rows.length}
        page={page}
        onPageChange={(_, p) => setPage(p)}
        rowsPerPage={rpp}
        onRowsPerPageChange={(e) => { setRpp(parseInt(e.target.value, 10)); setPage(0); }}
        rowsPerPageOptions={[10, 25, 50, 100]}
      />
    </Box>
  );
}
