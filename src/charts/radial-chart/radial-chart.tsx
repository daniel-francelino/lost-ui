import {
  Label,
  LabelList,
  PolarAngleAxis,
  PolarGrid,
  PolarRadiusAxis,
  RadialBar,
  RadialBarChart as RechartsRadialBarChart,
} from "recharts";

import { cn } from "../../lib/cn";
import type { ChartConfig } from "../lib/chart-context";
import { ChartCenterLabel } from "../chart-center-label";
import { ChartContainer } from "../chart-container";
import { ChartTooltip } from "../chart-tooltip";
import { ChartTooltipContent } from "../chart-tooltip-content";
import {
  buildSeriesConfig,
  buildSliceConfig,
  configLabel,
  seriesFill,
  sliceColor,
  type CenterLabel,
  type ChartRow,
  type ChartSeries,
  type TooltipContentOptions,
} from "../lib/chart-series";

export type RadialChartProps = {
  data: ChartRow[];
  nameKey?: string;
  valueKey?: string;
  series?: ChartSeries[];
  config?: ChartConfig;
  colorKey?: string;
  innerRadius?: number;
  outerRadius?: number;
  startAngle?: number;
  endAngle?: number;
  showGrid?: boolean;
  gridRadius?: number[];
  showLabels?: boolean;
  centerLabel?: CenterLabel;
  showTooltip?: boolean;
  tooltipProps?: TooltipContentOptions;
  animate?: boolean;
  className?: string;
};

export function RadialChart({
  data,
  nameKey = "name",
  valueKey = "value",
  series,
  config: configProp,
  colorKey,
  innerRadius = 30,
  outerRadius = 110,
  startAngle,
  endAngle,
  showGrid = false,
  gridRadius,
  showLabels = false,
  centerLabel,
  showTooltip = true,
  tooltipProps,
  animate = true,
  className,
}: RadialChartProps) {
  const stacked = Boolean(series?.length);
  const rows = stacked
    ? data
    : data.map((row, index) => ({ ...row, fill: sliceColor(row, index, colorKey) }));
  const stackTotal = stacked
    ? Math.max(
        0,
        ...data.map((row) =>
          (series ?? []).reduce((sum, item) => sum + (Number(row[item.key]) || 0), 0),
        ),
      )
    : 0;
  const config = {
    ...(series ? buildSeriesConfig(series) : buildSliceConfig(data, nameKey, colorKey)),
    ...configProp,
  };

  return (
    <ChartContainer
      config={config}
      className={cn("mx-auto aspect-square w-full max-w-[250px]", className)}
    >
      <RechartsRadialBarChart
        data={rows}
        innerRadius={innerRadius}
        outerRadius={outerRadius}
        startAngle={startAngle}
        endAngle={endAngle}
      >
        {showTooltip && (
          <ChartTooltip
            cursor={false}
            content={
              <ChartTooltipContent hideLabel={!stacked} nameKey={nameKey} {...tooltipProps} />
            }
          />
        )}
        {stacked && <PolarAngleAxis type="number" domain={[0, stackTotal]} tick={false} />}
        {gridRadius ? (
          <PolarGrid
            gridType="circle"
            radialLines={false}
            stroke="none"
            className="first:fill-muted last:fill-background"
            polarRadius={gridRadius}
          />
        ) : (
          showGrid && <PolarGrid gridType="circle" />
        )}
        {series ? (
          series.map((item) => (
            <RadialBar
              key={item.key}
              dataKey={item.key}
              stackId="stack"
              cornerRadius={5}
              fill={seriesFill(item.key)}
              className="stroke-transparent stroke-2"
              isAnimationActive={animate}
            />
          ))
        ) : (
          <RadialBar dataKey={valueKey} background cornerRadius={10} isAnimationActive={animate}>
            {showLabels && (
              <LabelList
                position="insideStart"
                dataKey={nameKey}
                className="fill-primary-foreground capitalize"
                fontSize={11}
                formatter={(value) => configLabel(config, value)}
              />
            )}
          </RadialBar>
        )}
        {centerLabel && (
          <PolarRadiusAxis tick={false} tickLine={false} axisLine={false}>
            <Label
              content={({ viewBox }) => <ChartCenterLabel viewBox={viewBox} {...centerLabel} />}
            />
          </PolarRadiusAxis>
        )}
      </RechartsRadialBarChart>
    </ChartContainer>
  );
}
