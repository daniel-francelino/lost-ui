import { CartesianGrid, LabelList, Line, LineChart as RechartsLineChart, XAxis } from "recharts";

import { ChartContainer } from "../chart-container";
import { ChartLegend } from "../chart-legend";
import { ChartLegendContent } from "../chart-legend-content";
import { ChartTooltip } from "../chart-tooltip";
import { ChartTooltipContent } from "../chart-tooltip-content";
import {
  buildSeriesConfig,
  seriesFill,
  type ChartRow,
  type ChartSeries,
  type TooltipIndicator,
} from "../lib/chart-series";

export type LineChartProps = {
  data: ChartRow[];
  xKey: string;
  series: ChartSeries[];
  curve?: "natural" | "linear" | "step" | "monotone";
  showDots?: boolean;
  showLabels?: boolean;
  strokeWidth?: number;
  showGrid?: boolean;
  showXAxis?: boolean;
  xTickFormatter?: (value: string) => string;
  showLegend?: boolean;
  showTooltip?: boolean;
  tooltipIndicator?: TooltipIndicator;
  className?: string;
};

export function LineChart({
  data,
  xKey,
  series,
  curve = "natural",
  showDots = false,
  showLabels = false,
  strokeWidth = 2,
  showGrid = true,
  showXAxis = true,
  xTickFormatter,
  showLegend = false,
  showTooltip = true,
  tooltipIndicator = "line",
  className,
}: LineChartProps) {
  return (
    <ChartContainer config={buildSeriesConfig(series)} className={className}>
      <RechartsLineChart
        accessibilityLayer
        data={data}
        margin={{ left: 12, right: 12, top: showLabels ? 20 : 5 }}
      >
        {showGrid && <CartesianGrid vertical={false} />}
        {showXAxis && (
          <XAxis
            dataKey={xKey}
            tickLine={false}
            axisLine={false}
            tickMargin={8}
            tickFormatter={xTickFormatter}
          />
        )}
        {showTooltip && (
          <ChartTooltip
            cursor={false}
            content={<ChartTooltipContent indicator={tooltipIndicator} />}
          />
        )}
        {series.map((item) => (
          <Line
            key={item.key}
            dataKey={item.key}
            type={curve}
            stroke={seriesFill(item.key)}
            strokeWidth={strokeWidth}
            dot={showDots ? { fill: seriesFill(item.key) } : false}
            activeDot={{ r: 6 }}
          >
            {showLabels && (
              <LabelList position="top" offset={12} className="fill-foreground" fontSize={12} />
            )}
          </Line>
        ))}
        {showLegend && <ChartLegend content={<ChartLegendContent />} />}
      </RechartsLineChart>
    </ChartContainer>
  );
}
