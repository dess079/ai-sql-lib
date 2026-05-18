/**
 * Schema viewer: expandable table list with column annotations.
 * Read-only sidebar widget that shows what the AI "sees".
 */
import type { JSX } from "react";
import { useEffect, useState } from "react";
import { Accordion, AccordionDetails, AccordionSummary, Box, Chip, Typography, CircularProgress } from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import type { TableDef } from "../types/schema";

/** Props for {@link SchemaViewer}. */
export interface SchemaViewerProps { backendUrl: string; }

/**
 * Fetches `/api/ai-sql/schema` and renders one accordion per table.
 * PK / FK / NOT NULL annotations are shown as chips next to each column.
 *
 * @param props.backendUrl - absolute backend URL
 * @returns the schema viewer JSX
 */
export function SchemaViewer({ backendUrl }: SchemaViewerProps): JSX.Element {
  const [tables, setTables] = useState<TableDef[] | null>(null);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    fetch(`${backendUrl}/api/ai-sql/schema`)
      .then((r) => (r.ok ? r.json() : Promise.reject(new Error(`HTTP ${r.status}`))))
      .then((d: { tables: TableDef[] }) => setTables(d.tables))
      .catch((e: Error) => setErr(e.message));
  }, [backendUrl]);

  if (err) return <Typography color="error" sx={{ p: 2 }}>{err}</Typography>;
  if (!tables) return <Box sx={{ p: 2 }}><CircularProgress size={18} /></Box>;
  return (
    <Box sx={{ p: 1 }}>
      {tables.map((t) => (
        <Accordion key={`${t.schema}.${t.name}`} disableGutters elevation={0}>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography variant="body2"><strong>{t.name}</strong>{t.comment ? ` — ${t.comment}` : ""}</Typography>
          </AccordionSummary>
          <AccordionDetails sx={{ display: "flex", flexDirection: "column", gap: 0.5 }}>
            {t.columns.map((c) => (
              <Box key={c.name} sx={{ display: "flex", alignItems: "center", gap: 0.5, flexWrap: "wrap" }}>
                <Typography variant="caption" sx={{ fontFamily: "monospace" }}>{c.name}</Typography>
                <Chip size="small" label={c.dataType} variant="outlined" />
                {c.primaryKey && <Chip size="small" color="primary" label="PK" />}
                {c.referencedTable && <Chip size="small" color="secondary" label={`FK→${c.referencedTable}`} />}
                {!c.nullable && <Chip size="small" label="NOT NULL" variant="outlined" />}
                {c.comment && <Typography variant="caption" color="text.secondary">— {c.comment}</Typography>}
              </Box>
            ))}
          </AccordionDetails>
        </Accordion>
      ))}
    </Box>
  );
}
