import { useMemo, useState } from "react";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../../ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../../ui/select";
import type { ChartConfig } from "../../chart-container";
import { PieChart } from "../pie-chart";

const desktopData = [
  { month: "january", desktop: 186, fill: "var(--color-january)" },
  { month: "february", desktop: 305, fill: "var(--color-february)" },
  { month: "march", desktop: 237, fill: "var(--color-march)" },
  { month: "april", desktop: 173, fill: "var(--color-april)" },
  { month: "may", desktop: 209, fill: "var(--color-may)" },
];

const chartConfig = {
  visitors: {
    label: "Visitors",
  },
  desktop: {
    label: "Desktop",
  },
  mobile: {
    label: "Mobile",
  },
  january: {
    label: "January",
    color: "var(--chart-1)",
  },
  february: {
    label: "February",
    color: "var(--chart-2)",
  },
  march: {
    label: "March",
    color: "var(--chart-3)",
  },
  april: {
    label: "April",
    color: "var(--chart-4)",
  },
  may: {
    label: "May",
    color: "var(--chart-5)",
  },
} satisfies ChartConfig;

const months = desktopData.map((item) => item.month);

export function ChartPieInteractive() {
  const [activeMonth, setActiveMonth] = useState(months[0] ?? "");

  const activeIndex = useMemo(
    () => desktopData.findIndex((item) => item.month === activeMonth),
    [activeMonth],
  );

  return (
    <Card className="flex flex-col">
      <CardHeader className="flex-row items-start space-y-0 pb-0">
        <div className="grid gap-1">
          <CardTitle>Pie Chart - Interactive</CardTitle>
          <CardDescription>January - June 2024</CardDescription>
        </div>
        <Select value={activeMonth} onValueChange={setActiveMonth}>
          <SelectTrigger
            className="ml-auto h-7 w-[130px] rounded-lg pl-2.5"
            aria-label="Select a month"
          >
            <SelectValue placeholder="Select month" />
          </SelectTrigger>
          <SelectContent align="end" className="rounded-xl">
            {months.map((month) => (
              <SelectItem key={month} value={month} className="rounded-lg">
                {chartConfig[month.toLowerCase() as keyof typeof chartConfig]?.label ?? month}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </CardHeader>
      <CardContent className="flex flex-1 justify-center pb-0">
        <PieChart
          className="aspect-square w-full max-w-[300px]"
          data={desktopData}
          nameKey="month"
          valueKey="desktop"
          config={chartConfig}
          colorKey="fill"
          donut
          innerRadius={60}
          activeIndex={activeIndex}
          centerLabel={{ value: desktopData[activeIndex]?.desktop ?? 0, caption: "Visitors" }}
          tooltipProps={{ hideLabel: true }}
        />
      </CardContent>
    </Card>
  );
}
