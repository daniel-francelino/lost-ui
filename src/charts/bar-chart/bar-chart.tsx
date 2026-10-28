import {
  Bar,
  BarChart as RechartsBarChart,
  CartesianGrid,
  Cell,
  LabelList,
  XAxis,
  YAxis,
} from "recharts";

import { ChartContainer } from "../chart-container";
import { ChartLegend } from "../chart-legend";
import { ChartLegendContent } from "../chart-legend-content";
import { ChartTooltip } from "../chart-tooltip";
import { ChartTooltipContent } from "../chart-tooltip-content";
import {
  buildSeriesConfig,
  seriesFill,
  sliceColor,
  type ChartRow,
  type ChartSeries,
  type TooltipIndicator,
} from "../lib/chart-series";

export type BarChartProps = {
  data: ChartRow[];
  xKey: string;
  series: ChartSeries[];
  orientation?: "vertical" | "horizontal";
  stacked?: boolean;
  radius?: number;
  showLabels?: boolean;
  colorKey?: string;
  showGrid?: boolean;
  showXAxis?: boolean;
  xTickFormatter?: (value: string) => string;
  showLegend?: boolean;
  showTooltip?: boolean;
  tooltipIndicator?: TooltipIndicator;
  className?: string;
};

export function BarChart({
  data,
  xKey,
  series,
  orientation = "vertical",
  stacked = false,
  radius = 4,
  showLabels = false,
  colorKey,
  showGrid = true,
  showXAxis = true,
  xTickFormatter,
  showLegend = false,
  showTooltip = true,
  tooltipIndicator = "dashed",
  className,
}: BarChartProps) {
  const horizontalBars = orientation === "horizontal";

  return (
    <ChartContainer config={buildSeriesConfig(series)} className={className}>
      <RechartsBarChart
        accessibilityLayer
        data={data}
        layout={horizontalBars ? "vertical" : "horizontal"}
        margin={horizontalBars ? { left: 0 } : undefined}
      >
        {showGrid && <CartesianGrid vertical={horizontalBars} horizontal={!horizontalBars} />}
        {horizontalBars ? (
          <>
            <YAxis
              dataKey={xKey}
              type="category"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={xTickFormatter}
            />
            <XAxis type="number" hide />
          </>
        ) : (
          showXAxis && (
            <XAxis
              dataKey={xKey}
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={xTickFormatter}
            />
          )
        )}
        {showTooltip && (
          <ChartTooltip
            cursor={false}
            content={<ChartTooltipContent indicator={tooltipIndicator} />}
          />
        )}
        {series.map((item) => (
          <Bar
            key={item.key}
            dataKey={item.key}
            fill={seriesFill(item.key)}
            radius={stacked ? 0 : radius}
            stackId={stacked ? "stack" : undefined}
          >
            {colorKey &&
              data.map((row, index) => (
                <Cell key={index} fill={sliceColor(row, index, colorKey)} />
              ))}
            {showLabels && (
              <LabelList
                position={horizontalBars ? "right" : "top"}
                offset={8}
                className="fill-foreground"
                fontSize={12}
              />
            )}
          </Bar>
        ))}
        {showLegend && <ChartLegend content={<ChartLegendContent />} />}
      </RechartsBarChart>
    </ChartContainer>
  );
}
