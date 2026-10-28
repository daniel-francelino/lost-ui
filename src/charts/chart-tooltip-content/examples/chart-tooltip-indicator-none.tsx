import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../../ui/card";
import type { ChartConfig } from "../../chart-container";
import { seriesFromConfig } from "../../chart-series";
import { BarChart } from "../../bar-chart";

const chartData = [
  { date: "2024-07-15", running: 450, swimming: 300 },
  { date: "2024-07-16", running: 380, swimming: 420 },
  { date: "2024-07-17", running: 520, swimming: 120 },
  { date: "2024-07-18", running: 140, swimming: 550 },
  { date: "2024-07-19", running: 600, swimming: 350 },
  { date: "2024-07-20", running: 480, swimming: 400 },
];

const chartConfig = {
  running: {
    label: "Running",
    color: "var(--chart-1)",
  },
  swimming: {
    label: "Swimming",
    color: "var(--chart-2)",
  },
} satisfies ChartConfig;

const series = seriesFromConfig(chartConfig);

export function ChartTooltipIndicatorNone() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Tooltip - No Indicator</CardTitle>
        <CardDescription>Tooltip with no indicator.</CardDescription>
      </CardHeader>
      <CardContent>
        <BarChart
          data={chartData}
          xKey="date"
          series={series}
          xTickFormatter={(value) => {
            return new Date(value).toLocaleDateString("en-US", {
              weekday: "short",
            });
          }}
          stacked
          tooltipIndicator="dot"
          tooltipProps={{ hideIndicator: true }}
        />
      </CardContent>
    </Card>
  );
}
