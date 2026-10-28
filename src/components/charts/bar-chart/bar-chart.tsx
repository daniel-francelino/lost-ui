import {
  Bar,
  BarChart as RechartsBarChart,
  CartesianGrid,
  Cell,
  LabelList,
  Rectangle,
  XAxis,
  YAxis,
  type LabelProps,
} from "recharts";
import type { BarShapeProps } from "recharts/types/cartesian/Bar";

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
  type TooltipContentOptions,
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
  labelKey?: string;
  labelFormatter?: NonNullable<LabelProps["formatter"]>;
  categoryInside?: boolean;
  colorKey?: string;
  negativeColor?: string;
  activeIndex?: number;
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

export function BarChart({
  data,
  xKey,
  series,
  orientation = "vertical",
  stacked = false,
  radius = 4,
  showLabels = false,
  labelKey,
  labelFormatter,
  categoryInside = false,
  colorKey,
  negativeColor,
  activeIndex,
  showGrid = true,
  showXAxis = true,
  xTickFormatter,
  xMinTickGap,
  showLegend = false,
  showTooltip = true,
  tooltipIndicator = "dashed",
  tooltipProps,
  animate = true,
  className,
}: BarChartProps) {
  const horizontalBars = orientation === "horizontal";

  const activeShape =
    activeIndex === undefined
      ? undefined
      : ({ index, ...props }: BarShapeProps) =>
          index === activeIndex ? (
            <Rectangle
              {...props}
              fillOpacity={0.8}
              stroke={props.fill}
              strokeDasharray={4}
              strokeDashoffset={4}
            />
          ) : (
            <Rectangle {...props} />
          );

  return (
    <ChartContainer config={buildSeriesConfig(series)} className={className}>
      <RechartsBarChart
        accessibilityLayer
        data={data}
        layout={horizontalBars ? "vertical" : "horizontal"}
        margin={horizontalBars ? { left: 0, right: showLabels ? 24 : 0 } : undefined}
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
              hide={categoryInside}
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
              minTickGap={xMinTickGap}
            />
          )
        )}
        {showTooltip && (
          <ChartTooltip
            cursor={false}
            content={<ChartTooltipContent indicator={tooltipIndicator} {...tooltipProps} />}
          />
        )}
        {series.map((item) => (
          <Bar
            key={item.key}
            dataKey={item.key}
            fill={seriesFill(item.key)}
            radius={stacked ? 0 : radius}
            stackId={stacked ? "stack" : undefined}
            strokeWidth={activeShape ? 2 : undefined}
            shape={activeShape}
            isAnimationActive={animate}
          >
            {(colorKey || negativeColor) &&
              data.map((row, index) => (
                <Cell
                  key={index}
                  fill={
                    negativeColor && Number(row[item.key]) < 0
                      ? negativeColor
                      : colorKey
                        ? sliceColor(row, index, colorKey)
                        : seriesFill(item.key)
                  }
                />
              ))}
            {categoryInside && horizontalBars && (
              <LabelList
                dataKey={xKey}
                position="insideLeft"
                offset={8}
                className="fill-primary-foreground"
                fontSize={12}
                formatter={xTickFormatter ? (value) => xTickFormatter(String(value)) : undefined}
              />
            )}
            {(showLabels || labelKey) && (
              <LabelList
                dataKey={labelKey}
                position={horizontalBars ? "right" : "top"}
                offset={8}
                className="fill-foreground"
                fontSize={12}
                formatter={labelFormatter}
              />
            )}
          </Bar>
        ))}
        {showLegend && <ChartLegend itemSorter={null} content={<ChartLegendContent />} />}
      </RechartsBarChart>
    </ChartContainer>
  );
}
