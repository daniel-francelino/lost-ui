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
import { RadialChart } from "../radial-chart";

const chartData = [{ browser: "safari", visitors: 1260, fill: "var(--color-safari)" }];

const chartConfig = {
  visitors: {
    label: "Visitors",
  },
  safari: {
    label: "Safari",
    color: "var(--chart-2)",
  },
} satisfies ChartConfig;

export function ChartRadialShape() {
  return (
    <Card className="flex flex-col">
      <CardHeader className="items-center pb-0">
        <CardTitle>Radial Chart - Shape</CardTitle>
        <CardDescription>January - June 2024</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <RadialChart
          data={chartData}
          nameKey="browser"
          valueKey="visitors"
          config={chartConfig}
          colorKey="fill"
          endAngle={100}
          innerRadius={65}
          outerRadius={95}
          gridRadius={[86, 74]}
          centerLabel={{ value: chartData[0]?.visitors ?? 0, caption: "Visitors" }}
        />
      </CardContent>
      <CardFooter className="flex-col gap-2 text-sm">
        <div className="flex items-center gap-2 leading-none font-medium">
          Trending up by 5.2% this month <TrendingUp className="h-4 w-4" />
        </div>
        <div className="leading-none text-muted-foreground">
          Showing total visitors for the last 6 months
        </div>
      </CardFooter>
    </Card>
  );
}
