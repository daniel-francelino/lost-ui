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
  { month: "January", desktop: 186, mobile: 160 },
  { month: "February", desktop: 185, mobile: 170 },
  { month: "March", desktop: 207, mobile: 180 },
  { month: "April", desktop: 173, mobile: 160 },
  { month: "May", desktop: 160, mobile: 190 },
  { month: "June", desktop: 174, mobile: 204 },
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

export function ChartRadarLinesOnly() {
  return (
    <Card>
      <CardHeader className="items-center pb-4">
        <CardTitle>Radar Chart - Lines Only</CardTitle>
        <CardDescription>Showing total visitors for the last 6 months</CardDescription>
      </CardHeader>
      <CardContent className="pb-0">
        <RadarChart
          data={chartData}
          angleKey="month"
          series={series}
          filled={false}
          radialLines={false}
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
