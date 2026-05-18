/**
 * Renders a tabular query result as a Recharts chart according to a chart hint.
 * Styling is sourced from {@link chartConfig} for consistency across chart types.
 */
import type { JSX } from "react";
import { Box, Typography } from "@mui/material";
import {
  ResponsiveContainer, BarChart, Bar, LineChart, Line,
  AreaChart, Area, PieChart, Pie, Cell,
  ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
} from "recharts";
import type { ChartHint } from "../types/schema";
import {
  pal, CHART_MARGIN, BAR_CHART_MARGIN, AXIS_STYLE,
  xAxisProps, yAxisProps, gridProps, tooltipProps, legendStyle,
} from "./chartConfig";

/** Props for {@link ChartView}. */
export interface ChartViewProps {
  rows: Array<Record<string, unknown>>;
  hint: ChartHint;
}

/**
 * Renders a professional chart from query rows using the AI-provided hint.
 * Supports bar, line, area, scatter and pie with tooltip, legend and animations.
 *
 * @param props.rows - data rows from the query result
 * @param props.hint - chart configuration emitted by the AI (type, xKey, yKeys)
 * @returns the chart JSX element
 */
export function ChartView({ rows, hint }: ChartViewProps): JSX.Element {
  if (rows.length === 0) return <Typography variant="body2">No data to chart.</Typography>;
  const xp = xAxisProps(hint.xKey);
  return (
    <Box sx={{ width: "100%", height: 420, my: 2 }}>
      <ResponsiveContainer>
        {hint.chartType === "bar" ? (
          <BarChart data={rows} margin={BAR_CHART_MARGIN}>
            <CartesianGrid {...gridProps} />
            <XAxis {...xp} /><YAxis {...yAxisProps} />
            <Tooltip {...tooltipProps} /><Legend verticalAlign="top" wrapperStyle={legendStyle} />
            {hint.yKeys.map((k, i) => (
              <Bar key={k} dataKey={k} fill={pal(i)} radius={[6, 6, 0, 0]} maxBarSize={64} animationDuration={600} />
            ))}
          </BarChart>
        ) : hint.chartType === "line" ? (
          <LineChart data={rows} margin={CHART_MARGIN}>
            <CartesianGrid {...gridProps} />
            <XAxis {...xp} /><YAxis {...yAxisProps} />
            <Tooltip {...tooltipProps} /><Legend wrapperStyle={legendStyle} />
            {hint.yKeys.map((k, i) => (
              <Line key={k} dataKey={k} stroke={pal(i)} strokeWidth={2.5} type="monotone"
                dot={{ r: 4, fill: pal(i), strokeWidth: 0 }} activeDot={{ r: 7 }} animationDuration={600} />
            ))}
          </LineChart>
        ) : hint.chartType === "area" ? (
          <AreaChart data={rows} margin={CHART_MARGIN}>
            <CartesianGrid {...gridProps} />
            <XAxis {...xp} /><YAxis {...yAxisProps} />
            <Tooltip {...tooltipProps} /><Legend wrapperStyle={legendStyle} />
            {hint.yKeys.map((k, i) => (
              <Area key={k} dataKey={k} stroke={pal(i)} fill={pal(i)} fillOpacity={0.18}
                strokeWidth={2.5} type="monotone" animationDuration={600} />
            ))}
          </AreaChart>
        ) : hint.chartType === "scatter" ? (
          <ScatterChart margin={CHART_MARGIN}>
            <CartesianGrid {...gridProps} />
            <XAxis dataKey={hint.xKey} type="number" name={hint.xKey} {...AXIS_STYLE} />
            <YAxis dataKey={hint.yKeys[0]} type="number" name={hint.yKeys[0]} {...AXIS_STYLE} width={56} />
            <Tooltip {...tooltipProps} /><Legend wrapperStyle={legendStyle} />
            <Scatter name={hint.yKeys[0]} data={rows} fill={pal(0)} animationDuration={600} />
          </ScatterChart>
        ) : (
          <PieChart margin={{ top: 10, right: 20, left: 20, bottom: 10 }}>
            <Tooltip {...tooltipProps} />
            <Legend wrapperStyle={legendStyle} />
            <Pie data={rows} dataKey={hint.yKeys[0]} nameKey={hint.xKey}
              outerRadius={130} innerRadius={55} paddingAngle={3} animationDuration={600}
              label={({ percent }: { percent: number }) => `${(percent * 100).toFixed(0)}%`} labelLine
            >
              {rows.map((_, i) => <Cell key={i} fill={pal(i)} />)}
            </Pie>
          </PieChart>
        )}
      </ResponsiveContainer>
    </Box>
  );
}
