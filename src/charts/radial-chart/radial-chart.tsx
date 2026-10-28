import {
  Label,
  LabelList,
  PolarGrid,
  PolarRadiusAxis,
  RadialBar,
  RadialBarChart as RechartsRadialBarChart,
} from "recharts";

import { cn } from "../../lib/cn";
import { ChartCenterLabel } from "../chart-center-label";
import { ChartContainer } from "../chart-container";
import { ChartTooltip } from "../chart-tooltip";
import { ChartTooltipContent } from "../chart-tooltip-content";
import {
  buildSliceConfig,
  sliceColor,
  type CenterLabel,
  type ChartRow,
} from "../lib/chart-series";

export type RadialChartProps = {
  data: ChartRow[];
  nameKey: string;
  valueKey: string;
  colorKey?: string;
  innerRadius?: number;
  outerRadius?: number;
  startAngle?: number;
  endAngle?: number;
  showGrid?: boolean;
  showLabels?: boolean;
  centerLabel?: CenterLabel;
  showTooltip?: boolean;
  className?: string;
};

export function RadialChart({
  data,
  nameKey,
  valueKey,
  colorKey,
  innerRadius = 30,
  outerRadius = 110,
  startAngle,
  endAngle,
  showGrid = false,
  showLabels = false,
  centerLabel,
  showTooltip = true,
  className,
}: RadialChartProps) {
  const rows = data.map((row, index) => ({ ...row, fill: sliceColor(row, index, colorKey) }));

  return (
    <ChartContainer
      config={buildSliceConfig(data, nameKey, colorKey)}
      className={cn("mx-auto aspect-square max-h-[250px]", className)}
    >
      <RechartsRadialBarChart
        data={rows}
        innerRadius={innerRadius}
        outerRadius={outerRadius}
        startAngle={startAngle}
        endAngle={endAngle}
      >
        {showTooltip && (
          <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel nameKey={nameKey} />} />
        )}
        {showGrid && <PolarGrid gridType="circle" />}
        <RadialBar dataKey={valueKey} background cornerRadius={10}>
          {showLabels && (
            <LabelList
              position="insideStart"
              dataKey={nameKey}
              className="fill-primary-foreground capitalize"
              fontSize={11}
            />
          )}
        </RadialBar>
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
