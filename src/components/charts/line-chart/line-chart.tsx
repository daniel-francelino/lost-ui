import type { ReactElement } from "react";
import {
  CartesianGrid,
  Dot,
  LabelList,
  Line,
  LineChart as RechartsLineChart,
  XAxis,
  type LabelProps,
} from "recharts";

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
  type TooltipContentOptions,
  type TooltipIndicator,
} from "../lib/chart-series";

export type ChartDotProps = {
  cx?: number;
  cy?: number;
  index?: number;
  payload?: ChartRow;
  value?: unknown;
};

export type LineChartProps = {
  data: ChartRow[];
  xKey: string;
  series: ChartSeries[];
  curve?: "natural" | "linear" | "step" | "monotone";
  showDots?: boolean;
  dotColorKey?: string;
  renderDot?: (props: ChartDotProps) => ReactElement;
  showLabels?: boolean;
  labelKey?: string;
  labelFormatter?: NonNullable<LabelProps["formatter"]>;
  strokeWidth?: number;
  showGrid?: boolean;
  showXAxis?: boolean;
  xTickFormatter?: (value: string) => string;
  xMinTickGap?: number;
  showLegend?: boolean;
  showTooltip?: boolean;
  tooltipIndicator?: TooltipIndicator;
  tooltipProps?: TooltipContentOptions;
  animate?: boolean;
  className?: string;
};

export function LineChart({
  data,
  xKey,
  series,
  curve = "natural",
  showDots = false,
  dotColorKey,
  renderDot,
  showLabels = false,
  labelKey,
  labelFormatter,
  strokeWidth = 2,
  showGrid = true,
  showXAxis = true,
  xTickFormatter,
  xMinTickGap,
  showLegend = false,
  showTooltip = true,
  tooltipIndicator = "line",
  tooltipProps,
  animate = true,
  className,
}: LineChartProps) {
  const dotFor = (key: string) => {
    if (renderDot) {
      return (props: ChartDotProps) => renderDot(props);
    }
    if (dotColorKey) {
      return ({ cx, cy, index, payload }: ChartDotProps) => {
        const color = payload ? String(payload[dotColorKey]) : seriesFill(key);
        return <Dot key={index} r={5} cx={cx} cy={cy} fill={color} stroke={color} />;
      };
    }
    return showDots ? { fill: seriesFill(key) } : false;
  };

  return (
    <ChartContainer config={buildSeriesConfig(series)} className={className}>
      <RechartsLineChart
        accessibilityLayer
        data={data}
        margin={{ left: 12, right: 12, top: showLabels || labelKey ? 24 : 5 }}
      >
        {showGrid && <CartesianGrid vertical={false} />}
        {showXAxis && (
          <XAxis
            dataKey={xKey}
            tickLine={false}
            axisLine={false}
            tickMargin={8}
            tickFormatter={xTickFormatter}
            minTickGap={xMinTickGap}
          />
        )}
        {showTooltip && (
          <ChartTooltip
            cursor={false}
            content={<ChartTooltipContent indicator={tooltipIndicator} {...tooltipProps} />}
          />
        )}
        {series.map((item) => (
          <Line
            key={item.key}
            dataKey={item.key}
            type={curve}
            stroke={seriesFill(item.key)}
            strokeWidth={strokeWidth}
            dot={dotFor(item.key)}
            activeDot={{ r: 6 }}
            isAnimationActive={animate}
          >
            {(showLabels || labelKey) && (
              <LabelList
                dataKey={labelKey}
                position="top"
                offset={12}
                className="fill-foreground"
                fontSize={12}
                formatter={labelFormatter}
              />
            )}
          </Line>
        ))}
        {showLegend && <ChartLegend itemSorter={null} content={<ChartLegendContent />} />}
      </RechartsLineChart>
    </ChartContainer>
  );
}
