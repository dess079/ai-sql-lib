/**
 * Miniature Recharts preview rendered in the example-prompts dialog right panel.
 * Shows a representative sample for each OutputType (bar/line/area/scatter/pie/mermaid/table).
 */
import type { JSX } from "react";
import { Box, Typography } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import {
  BarChart, Bar, LineChart, Line, AreaChart, Area,
  ScatterChart, Scatter, PieChart, Pie, Cell, ResponsiveContainer,
} from "recharts";
import type { OutputType } from "./examplePrompts";
import { PALETTE } from "../chartConfig";

const XY = [
  { x: "Jan", y: 42 }, { x: "Fév", y: 68 }, { x: "Mar", y: 53 },
  { x: "Avr", y: 81 }, { x: "Mai", y: 60 }, { x: "Jun", y: 75 },
];
const PIE_DATA = [
  { name: "A", value: 35 }, { name: "B", value: 25 },
  { name: "C", value: 22 }, { name: "D", value: 18 },
];
const SC_DATA = [
  { x: 10, y: 42 }, { x: 22, y: 63 }, { x: 35, y: 50 },
  { x: 48, y: 85 }, { x: 62, y: 55 }, { x: 75, y: 72 },
];

const W = "100%";
const H = 140;

/** Mini icon for non-chart output types (mermaid/table). */
function IconPlaceholder({ icon, label, color }: { icon: string; label: string; color: string }): JSX.Element {
  return (
    <Box sx={{ height: H, display: "flex", flexDirection: "column", alignItems: "center",
      justifyContent: "center", gap: 1, bgcolor: "action.hover", borderRadius: 2 }}>
      <Typography sx={{ fontSize: "2.2rem", lineHeight: 1 }}>{icon}</Typography>
      <Typography variant="caption" sx={{ color, fontWeight: 600, letterSpacing: 0.5 }}>{label}</Typography>
    </Box>
  );
}

/**
 * Renders a compact read-only chart (or icon) matching the given OutputType.
 *
 * @param props.type - the OutputType to preview
 * @returns the mini-chart JSX
 */
export function ChartPreview({ type }: { type: OutputType }): JSX.Element {
  const theme = useTheme();
  const palette = PALETTE(theme);

  if (type === "mermaid") return <IconPlaceholder icon="🔷" label="Diagramme Mermaid" color={theme.palette.primary.main} />;
  if (type === "table")   return <IconPlaceholder icon="📋" label="Tableau de données" color={theme.palette.text.secondary} />;

  return (
    <ResponsiveContainer width={W} height={H}>
      {type === "bar" ? (
        <BarChart data={XY} margin={{ top: 4, right: 4, left: -28, bottom: 0 }}>
          <Bar dataKey="y" radius={[4, 4, 0, 0]}>
            {XY.map((_, i) => <Cell key={i} fill={palette[i % palette.length]} />)}
          </Bar>
        </BarChart>
      ) : type === "line" ? (
        <LineChart data={XY} margin={{ top: 4, right: 4, left: -28, bottom: 0 }}>
          <Line type="monotone" dataKey="y" stroke={palette[0]} strokeWidth={2} dot={false} />
        </LineChart>
      ) : type === "area" ? (
        <AreaChart data={XY} margin={{ top: 4, right: 4, left: -28, bottom: 0 }}>
          <defs>
            <linearGradient id="prev-area" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%"  stopColor={palette[0]} stopOpacity={0.35} />
              <stop offset="95%" stopColor={palette[0]} stopOpacity={0.02} />
            </linearGradient>
          </defs>
          <Area type="monotone" dataKey="y" stroke={palette[0]} strokeWidth={2}
            fill="url(#prev-area)" dot={false} />
        </AreaChart>
      ) : type === "scatter" ? (
        <ScatterChart margin={{ top: 4, right: 4, left: -28, bottom: 0 }}>
          <Scatter data={SC_DATA} fill={palette[3]} />
        </ScatterChart>
      ) : (
        /* pie / donut */
        <PieChart>
          <Pie data={PIE_DATA} cx="50%" cy="50%" innerRadius={30} outerRadius={55}
            paddingAngle={3} dataKey="value">
            {PIE_DATA.map((_, i) => <Cell key={i} fill={palette[i % palette.length]} />)}
          </Pie>
        </PieChart>
      )}
    </ResponsiveContainer>
  );
}
