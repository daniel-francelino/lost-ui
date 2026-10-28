import type { ReactElement } from "react";
import {
  PolarAngleAxis,
  PolarGrid,
  PolarRadiusAxis,
  Radar,
  RadarChart as RechartsRadarChart,
} from "recharts";

import { cn } from "../../../lib/cn";
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

export type AngleTickProps = {
  x: number;
  y: number;
  index: number;
  textAnchor?: "start" | "middle" | "end" | "inherit";
  payload: { value: string };
  cx?: number;
  cy?: number;
};

export type RadarChartProps = {
  data: ChartRow[];
  angleKey: string;
  series: ChartSeries[];
  gridShape?: "polygon" | "circle";
  showGrid?: boolean;
  gridFilled?: boolean;
  gridRadius?: number[];
  radialLines?: boolean;
  filled?: boolean;
  showDots?: boolean;
  showRadiusAxis?: boolean;
  angleTick?: (props: AngleTickProps) => ReactElement;
  showLegend?: boolean;
  showTooltip?: boolean;
  tooltipIndicator?: TooltipIndicator;
  tooltipProps?: TooltipContentOptions;
  animate?: boolean;
  className?: string;
};

export function RadarChart({
  data,
  angleKey,
  series,
  gridShape = "polygon",
  showGrid = true,
  gridFilled = false,
  gridRadius,
  radialLines = true,
  filled = true,
  showDots = false,
  showRadiusAxis = false,
  angleTick,
  showLegend = false,
  showTooltip = true,
  tooltipIndicator = "line",
  tooltipProps,
  animate = true,
  className,
}: RadarChartProps) {
  const firstKey = series[0]?.key ?? "value";

  return (
    <ChartContainer
      config={buildSeriesConfig(series)}
      className={cn("mx-auto aspect-square w-full max-w-[250px]", className)}
    >
      <RechartsRadarChart data={data}>
        {showTooltip && (
          <ChartTooltip
            cursor={false}
            content={<ChartTooltipContent indicator={tooltipIndicator} {...tooltipProps} />}
          />
        )}
        <PolarAngleAxis
          dataKey={angleKey}
          tick={angleTick ? (props) => angleTick(props as AngleTickProps) : undefined}
        />
        {showGrid && (
          <PolarGrid
            gridType={gridShape}
            radialLines={radialLines}
            polarRadius={gridRadius}
            className={gridFilled ? `fill-(--color-${firstKey}) opacity-20` : undefined}
          />
        )}
        {showRadiusAxis && <PolarRadiusAxis angle={60} />}
        {series.map((item) => (
          <Radar
            key={item.key}
            dataKey={item.key}
            fill={seriesFill(item.key)}
            fillOpacity={filled ? 0.6 : 0}
            stroke={seriesFill(item.key)}
            strokeWidth={filled ? undefined : 2}
            dot={showDots ? { r: 4, fillOpacity: 1 } : undefined}
            isAnimationActive={animate}
          />
        ))}
        {showLegend && <ChartLegend itemSorter={null} content={<ChartLegendContent />} />}
      </RechartsRadarChart>
    </ChartContainer>
  );
}
