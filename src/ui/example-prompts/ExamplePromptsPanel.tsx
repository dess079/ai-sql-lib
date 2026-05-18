/**
 * Two-panel prompt picker: difficulty list on the left, full detail on the right.
 */
import type { JSX } from "react";
import { useState } from "react";
import { Box, Typography, Chip, Stack, Divider, Button, Paper } from "@mui/material";
import type { ExamplePrompt, OutputType } from "./examplePrompts";
import { EXAMPLE_GROUPS } from "./examplePrompts";
import { ChartPreview } from "./ChartPreview";

/** Label and accent colour for each output type. */
const CHART_CFG: Record<OutputType, { label: string; bg: string }> = {
  bar:     { label: "Barres",      bg: "#4F8EF7" },
  line:    { label: "Courbe",      bg: "#10B981" },
  pie:     { label: "Circulaire",  bg: "#A855F7" },
  area:    { label: "Aire",        bg: "#06B6D4" },
  scatter: { label: "Nuage pts",   bg: "#F59E0B" },
  mermaid: { label: "Diagramme",   bg: "#8B5CF6" },
  table:   { label: "Tableau",     bg: "#64748b" },
};

/** Returns the sx object for a list row depending on its active state. */
const rowSx = (active: boolean) => ({
  display: "flex", justifyContent: "space-between", alignItems: "center",
  px: 1.5, py: 0.6, cursor: "pointer", borderRadius: 1, mx: 0.5,
  bgcolor: active ? "primary.main" : "transparent",
  color:   active ? "primary.contrastText" : "text.primary",
  "&:hover": { bgcolor: active ? "primary.main" : "action.hover" },
});

/** Props for {@link ExamplePromptsPanel}. */
export interface ExamplePromptsPanelProps {
  /** Called with the chosen prompt text when the user clicks "Utiliser". */
  onSelect: (prompt: string) => void;
  /** Closes the parent dialog/popover. */
  onClose: () => void;
}

/**
 * Two-column prompt picker used inside the ExamplePromptsButton dialog.
 *
 * - **Section 1 (gauche)** : liste des prompts groupés par difficulté (Facile / Intermédiaire / Complexe),
 *   chaque ligne affichant le label + un badge coloré du type de visualisation.
 * - **Section 2 (droite)** : détail du prompt sélectionné — badge difficulté + badge type + texte complet + bouton d'action.
 *
 * @param props.onSelect - handler recevant le texte du prompt choisi
 * @param props.onClose  - ferme le dialog parent
 * @returns the panel JSX element
 */
export function ExamplePromptsPanel({ onSelect, onClose }: ExamplePromptsPanelProps): JSX.Element {
  const all = EXAMPLE_GROUPS.flatMap((g) => g.items);
  const [sel, setSel] = useState<ExamplePrompt>(all[0]);
  const cfg = CHART_CFG[sel.outputType];
  const grp = EXAMPLE_GROUPS.find((g) => g.items.some((i) => i.label === sel.label))!;

  return (
    <Box sx={{ display: "flex", height: 500 }}>

      {/* ── SECTION 1 : liste par difficulté ── */}
      <Box sx={{ width: "38%", borderRight: "1px solid", borderColor: "divider", overflowY: "auto", py: 1 }}>
        {EXAMPLE_GROUPS.map((g, gi) => (
          <Box key={g.level} mb={gi < EXAMPLE_GROUPS.length - 1 ? 1.5 : 0}>
            <Chip label={g.level} color={g.color} size="small" sx={{ mx: 1, mb: 0.5 }} />
            <Stack spacing={0}>
              {g.items.map((item) => (
                <Box key={item.label} onClick={() => setSel(item)} sx={rowSx(sel.label === item.label)}>
                  <Typography variant="body2" noWrap sx={{ fontSize: "0.76rem", flex: 1, mr: 0.5 }}>
                    {item.label}
                  </Typography>
                  <Chip label={CHART_CFG[item.outputType].label} size="small"
                    sx={{ height: 18, fontSize: "0.62rem", bgcolor: CHART_CFG[item.outputType].bg, color: "#fff", pointerEvents: "none" }} />
                </Box>
              ))}
            </Stack>
            {gi < EXAMPLE_GROUPS.length - 1 && <Divider sx={{ mt: 1.5 }} />}
          </Box>
        ))}
      </Box>

      {/* ── SECTION 2 : détail du prompt sélectionné ── */}
      <Box sx={{ width: "62%", p: 2.5, display: "flex", flexDirection: "column", gap: 1.5 }}>
        <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap", alignItems: "center" }}>
          <Chip label={grp.level} color={grp.color} size="small" />
          <Chip label={cfg.label} size="small" sx={{ bgcolor: cfg.bg, color: "#fff", fontWeight: 700 }} />
        </Box>
        <Typography variant="subtitle1" fontWeight={700} lineHeight={1.3}>{sel.label}</Typography>
        <Paper variant="outlined" sx={{ p: 1.5, bgcolor: "action.hover", overflowY: "auto", maxHeight: 96 }}>
          <Typography variant="body2" sx={{ lineHeight: 1.7, fontStyle: "italic", color: "text.primary" }}>
            « {sel.prompt} »
          </Typography>
        </Paper>
        <Box sx={{ mt: 0.5 }}>
          <ChartPreview type={sel.outputType} />
        </Box>
        <Button variant="contained" size="small"
          onClick={() => { onSelect(sel.prompt); onClose(); }}
          sx={{ alignSelf: "flex-end", textTransform: "none", borderRadius: 20, px: 2.5 }}
        >
          Utiliser ce prompt →
        </Button>
      </Box>

    </Box>
  );
}
