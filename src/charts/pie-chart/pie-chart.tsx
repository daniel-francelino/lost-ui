import { Cell, Label, LabelList, Pie, PieChart as RechartsPieChart } from "recharts";

import { cn } from "../../lib/cn";
import { ChartCenterLabel } from "../chart-center-label";
import { ChartContainer } from "../chart-container";
import { ChartLegend } from "../chart-legend";
import { ChartLegendContent } from "../chart-legend-content";
import { ChartTooltip } from "../chart-tooltip";
import { ChartTooltipContent } from "../chart-tooltip-content";
import {
  buildSliceConfig,
  sliceColor,
  type CenterLabel,
  type ChartRow,
} from "../lib/chart-series";

export type PieChartProps = {
  data: ChartRow[];
  nameKey: string;
  valueKey: string;
  colorKey?: string;
  donut?: boolean;
  innerRadius?: number;
  paddingAngle?: number;
  centerLabel?: CenterLabel;
  showLabels?: boolean;
  showLegend?: boolean;
  showTooltip?: boolean;
  className?: string;
};

export function PieChart({
  data,
  nameKey,
  valueKey,
  colorKey,
  donut = false,
  innerRadius = 60,
  paddingAngle = 0,
  centerLabel,
  showLabels = false,
  showLegend = false,
  showTooltip = true,
  className,
}: PieChartProps) {
  return (
    <ChartContainer
      config={buildSliceConfig(data, nameKey, colorKey)}
      className={cn("mx-auto aspect-square max-h-[250px]", className)}
    >
      <RechartsPieChart>
        {showTooltip && (
          <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel nameKey={nameKey} />} />
        )}
        <Pie
          data={data}
          dataKey={valueKey}
          nameKey={nameKey}
          innerRadius={donut ? innerRadius : 0}
          paddingAngle={paddingAngle}
          strokeWidth={5}
        >
          {data.map((row, index) => (
            <Cell key={index} fill={sliceColor(row, index, colorKey)} />
          ))}
          {showLabels && (
            <LabelList dataKey={nameKey} className="fill-background" stroke="none" fontSize={12} />
          )}
          {donut && centerLabel && (
            <Label
              content={({ viewBox }) => <ChartCenterLabel viewBox={viewBox} {...centerLabel} />}
            />
          )}
        </Pie>
        {showLegend && <ChartLegend content={<ChartLegendContent nameKey={nameKey} />} />}
      </RechartsPieChart>
    </ChartContainer>
  );
}
