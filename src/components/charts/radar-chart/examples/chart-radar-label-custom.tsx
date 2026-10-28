import { TrendingUp } from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../../../ui/card";
import type { ChartConfig } from "../../chart-container";
import { seriesFromConfig } from "../../chart-series";
import { RadarChart } from "../radar-chart";

const chartData = [
  { month: "January", desktop: 186, mobile: 80 },
  { month: "February", desktop: 305, mobile: 200 },
  { month: "March", desktop: 237, mobile: 120 },
  { month: "April", desktop: 73, mobile: 190 },
  { month: "May", desktop: 209, mobile: 130 },
  { month: "June", desktop: 214, mobile: 140 },
];

const chartConfig = {
  desktop: {
    label: "Desktop",
    color: "var(--chart-1)",
  },
  mobile: {
    label: "Mobile",
    color: "var(--chart-2)",
  },
} satisfies ChartConfig;

const series = seriesFromConfig(chartConfig);

export function ChartRadarLabelCustom() {
  return (
    <Card>
      <CardHeader className="items-center pb-4">
        <CardTitle>Radar Chart - Custom Label</CardTitle>
        <CardDescription>Showing total visitors for the last 6 months</CardDescription>
      </CardHeader>
      <CardContent className="pb-0">
        <RadarChart
          data={chartData}
          angleKey="month"
          series={series}
          angleTick={({ x, y, textAnchor, index, ...props }) => {
            const data = chartData[index];
            const yValue = typeof y === "number" ? y : 0;

            return (
              <text
                x={x}
                y={yValue + (index === 0 ? -10 : 0)}
                textAnchor={textAnchor}
                fontSize={13}
                fontWeight={500}
                {...props}
              >
                <tspan>{data.desktop}</tspan>
                <tspan className="fill-muted-foreground">/</tspan>
                <tspan>{data.mobile}</tspan>
                <tspan x={x} dy={"1rem"} fontSize={12} className="fill-muted-foreground">
                  {data.month}
                </tspan>
              </text>
            );
          }}
          tooltipIndicator="line"
        />
      </CardContent>
      <CardFooter className="flex-col gap-2 text-sm">
        <div className="flex items-center gap-2 leading-none font-medium">
          Trending up by 5.2% this month <TrendingUp className="h-4 w-4" />
        </div>
        <div className="flex items-center gap-2 leading-none text-muted-foreground">
          January - June 2024
        </div>
      </CardFooter>
    </Card>
  );
}
