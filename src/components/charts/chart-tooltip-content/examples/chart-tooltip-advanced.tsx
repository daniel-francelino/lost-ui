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

export function ChartTooltipAdvanced() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Tooltip - Advanced</CardTitle>
        <CardDescription>Tooltip with custom formatter and total.</CardDescription>
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
          tooltipProps={{
            hideLabel: true,
            className: "w-[180px]",
            formatter: (value, name, item, index) => (
              <>
                <div
                  className="h-2.5 w-2.5 shrink-0 rounded-[2px] bg-(--color-bg)"
                  style={
                    {
                      "--color-bg": `var(--color-${name})`,
                    } as React.CSSProperties
                  }
                />
                {chartConfig[name as keyof typeof chartConfig]?.label || name}
                <div className="ml-auto flex items-baseline gap-0.5 font-mono font-medium text-foreground tabular-nums">
                  {value}
                  <span className="font-normal text-muted-foreground">kcal</span>
                </div>
                {/* Add this after the last item */}
                {index === 1 && (
                  <div className="mt-1.5 flex basis-full items-center border-t pt-1.5 text-xs font-medium text-foreground">
                    Total
                    <div className="ml-auto flex items-baseline gap-0.5 font-mono font-medium text-foreground tabular-nums">
                      {item.payload.running + item.payload.swimming}
                      <span className="font-normal text-muted-foreground">kcal</span>
                    </div>
                  </div>
                )}
              </>
            ),
          }}
        />
      </CardContent>
    </Card>
  );
}
