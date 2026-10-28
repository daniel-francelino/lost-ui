import {
  PolarAngleAxis,
  PolarGrid,
  PolarRadiusAxis,
  Radar,
  RadarChart as RechartsRadarChart,
} from "recharts";

import { cn } from "../../lib/cn";
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

export type RadarChartProps = {
  data: ChartRow[];
  angleKey: string;
  series: ChartSeries[];
  gridShape?: "polygon" | "circle";
  filled?: boolean;
  showDots?: boolean;
  showRadiusAxis?: boolean;
  showLegend?: boolean;
  showTooltip?: boolean;
  tooltipIndicator?: TooltipIndicator;
  className?: string;
};

export function RadarChart({
  data,
  angleKey,
  series,
  gridShape = "polygon",
  filled = true,
  showDots = false,
  showRadiusAxis = false,
  showLegend = false,
  showTooltip = true,
  tooltipIndicator = "line",
  className,
}: RadarChartProps) {
  return (
    <ChartContainer
      config={buildSeriesConfig(series)}
      className={cn("mx-auto aspect-square max-h-[250px]", className)}
    >
      <RechartsRadarChart data={data}>
        {showTooltip && (
          <ChartTooltip
            cursor={false}
            content={<ChartTooltipContent indicator={tooltipIndicator} />}
          />
        )}
        <PolarAngleAxis dataKey={angleKey} />
        <PolarGrid gridType={gridShape} />
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
          />
        ))}
        {showLegend && <ChartLegend content={<ChartLegendContent />} />}
      </RechartsRadarChart>
    </ChartContainer>
  );
}
