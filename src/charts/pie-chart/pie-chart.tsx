import type { ReactNode } from "react";
import { Cell, Label, LabelList, Pie, PieChart as RechartsPieChart, Sector } from "recharts";
import type { PieLabelRenderProps, PieSectorShapeProps } from "recharts/types/polar/Pie";

import { cn } from "../../lib/cn";
import type { ChartConfig } from "../lib/chart-context";
import { ChartCenterLabel } from "../chart-center-label";
import { ChartContainer } from "../chart-container";
import { ChartLegend } from "../chart-legend";
import { ChartLegendContent } from "../chart-legend-content";
import { ChartTooltip } from "../chart-tooltip";
import { ChartTooltipContent } from "../chart-tooltip-content";
import {
  buildSliceConfig,
  configLabel,
  sliceColor,
  type CenterLabel,
  type ChartRow,
  type TooltipContentOptions,
} from "../lib/chart-series";

export type PieInnerRing = {
  data: ChartRow[];
  valueKey: string;
};

export type PieChartProps = {
  data: ChartRow[];
  nameKey: string;
  valueKey: string;
  config?: ChartConfig;
  colorKey?: string;
  donut?: boolean;
  innerRadius?: number;
  paddingAngle?: number;
  centerLabel?: CenterLabel;
  inner?: PieInnerRing;
  activeIndex?: number;
  showLabels?: boolean;
  labelPosition?: "inside" | "outside";
  labelFormatter?: (value: unknown, row: ChartRow) => ReactNode;
  showSeparator?: boolean;
  showLegend?: boolean;
  showTooltip?: boolean;
  tooltipProps?: TooltipContentOptions;
  animate?: boolean;
  className?: string;
};

export function PieChart({
  data,
  nameKey,
  valueKey,
  config,
  colorKey,
  donut = false,
  innerRadius = 60,
  paddingAngle = 0,
  centerLabel,
  inner,
  activeIndex,
  showLabels = false,
  labelPosition = "inside",
  labelFormatter,
  showSeparator = true,
  showLegend = false,
  showTooltip = true,
  tooltipProps,
  animate = true,
  className,
}: PieChartProps) {
  const sliceConfig = { ...buildSliceConfig(data, nameKey, colorKey), ...config };
  const outsideLabels = showLabels && labelPosition === "outside";
  const insideLabels = showLabels && labelPosition === "inside";

  const activeShape =
    activeIndex === undefined
      ? undefined
      : ({ index, outerRadius = 0, ...props }: PieSectorShapeProps) => (
          <Sector {...props} outerRadius={index === activeIndex ? outerRadius + 10 : outerRadius} />
        );

  const renderOutsideLabel = (props: PieLabelRenderProps) => (
    <text
      x={props.x}
      y={props.y}
      textAnchor={props.textAnchor}
      dominantBaseline={props.dominantBaseline}
      fill="var(--foreground)"
    >
      {props.payload ? labelFormatter?.(props.payload[valueKey], props.payload as ChartRow) : null}
    </text>
  );

  const outsideLabel = outsideLabels ? (labelFormatter ? renderOutsideLabel : true) : false;
  const ringed = Boolean(inner);

  return (
    <ChartContainer
      config={sliceConfig}
      className={cn("mx-auto aspect-square w-full max-w-[250px]", className)}
    >
      <RechartsPieChart>
        {showTooltip && (
          <ChartTooltip
            cursor={false}
            content={<ChartTooltipContent hideLabel nameKey={nameKey} {...tooltipProps} />}
          />
        )}
        {inner && (
          <Pie
            data={inner.data}
            dataKey={inner.valueKey}
            nameKey={nameKey}
            outerRadius={60}
            stroke={showSeparator ? undefined : "none"}
            isAnimationActive={animate}
          >
            {inner.data.map((row, index) => (
              <Cell key={index} fill={sliceColor(row, index, colorKey)} />
            ))}
          </Pie>
        )}
        <Pie
          data={data}
          dataKey={valueKey}
          nameKey={nameKey}
          innerRadius={ringed ? 70 : donut ? innerRadius : 0}
          outerRadius={ringed ? 90 : undefined}
          paddingAngle={paddingAngle}
          strokeWidth={showSeparator ? 5 : 0}
          stroke={showSeparator ? undefined : "none"}
          shape={activeShape}
          label={outsideLabel}
          labelLine={outsideLabels && !labelFormatter}
          isAnimationActive={animate}
        >
          {data.map((row, index) => (
            <Cell key={index} fill={sliceColor(row, index, colorKey)} />
          ))}
          {insideLabels && (
            <LabelList
              dataKey={nameKey}
              className="fill-background"
              stroke="none"
              fontSize={12}
              formatter={(value) => configLabel(sliceConfig, value)}
            />
          )}
          {donut && centerLabel && (
            <Label
              content={({ viewBox }) => <ChartCenterLabel viewBox={viewBox} {...centerLabel} />}
            />
          )}
        </Pie>
        {showLegend && (
          <ChartLegend itemSorter={null} content={<ChartLegendContent nameKey={nameKey} />} />
        )}
      </RechartsPieChart>
    </ChartContainer>
  );
}
