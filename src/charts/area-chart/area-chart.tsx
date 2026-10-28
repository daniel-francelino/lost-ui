import { useId } from "react";
import { Area, AreaChart as RechartsAreaChart, CartesianGrid, XAxis, YAxis } from "recharts";

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

export type AreaChartProps = {
  data: ChartRow[];
  xKey: string;
  series: ChartSeries[];
  curve?: "natural" | "linear" | "step" | "monotone";
  stacked?: boolean;
  expand?: boolean;
  gradient?: boolean;
  showGrid?: boolean;
  showXAxis?: boolean;
  showYAxis?: boolean;
  xTickFormatter?: (value: string) => string;
  showLegend?: boolean;
  showTooltip?: boolean;
  tooltipIndicator?: TooltipIndicator;
  className?: string;
};

export function AreaChart({
  data,
  xKey,
  series,
  curve = "natural",
  stacked = false,
  expand = false,
  gradient = false,
  showGrid = true,
  showXAxis = true,
  showYAxis = false,
  xTickFormatter,
  showLegend = false,
  showTooltip = true,
  tooltipIndicator = "dot",
  className,
}: AreaChartProps) {
  const gradientId = useId().replace(/:/g, "");
  const stackId = stacked || expand ? "stack" : undefined;

  return (
    <ChartContainer config={buildSeriesConfig(series)} className={className}>
      <RechartsAreaChart
        accessibilityLayer
        data={data}
        stackOffset={expand ? "expand" : undefined}
        margin={{ left: showYAxis ? 0 : 12, right: 12 }}
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
        {showYAxis && <YAxis tickLine={false} axisLine={false} tickMargin={8} />}
        {showTooltip && (
          <ChartTooltip
            cursor={false}
            content={<ChartTooltipContent indicator={tooltipIndicator} />}
          />
        )}
        {gradient && (
          <defs>
            {series.map((item) => (
              <linearGradient
                key={item.key}
                id={`${gradientId}-${item.key}`}
                x1="0"
                y1="0"
                x2="0"
                y2="1"
              >
                <stop offset="5%" stopColor={seriesFill(item.key)} stopOpacity={0.8} />
                <stop offset="95%" stopColor={seriesFill(item.key)} stopOpacity={0.1} />
              </linearGradient>
            ))}
          </defs>
        )}
        {series.map((item) => (
          <Area
            key={item.key}
            dataKey={item.key}
            type={curve}
            fill={gradient ? `url(#${gradientId}-${item.key})` : seriesFill(item.key)}
            fillOpacity={gradient ? 1 : 0.4}
            stroke={seriesFill(item.key)}
            stackId={stackId}
          />
        ))}
        {showLegend && <ChartLegend content={<ChartLegendContent />} />}
      </RechartsAreaChart>
    </ChartContainer>
  );
}
