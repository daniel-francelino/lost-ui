import type { Meta, StoryObj } from "@storybook/react-vite";

import { monthLabel, monthlyVisitors, visitorSeries } from "../../stories/chart-data";
import { BarChart } from "./bar-chart";

const meta = {
  title: "Charts/BarChart",
  component: BarChart,
  tags: ["autodocs"],
  parameters: { layout: "padded" },
  args: {
    data: monthlyVisitors,
    xKey: "month",
    series: visitorSeries,
    xTickFormatter: monthLabel,
    className: "max-w-xl",
  },
} satisfies Meta<typeof BarChart>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = { args: { showLegend: true } };

export const SingleSeries: Story = { args: { series: [{ key: "desktop", label: "Desktop" }] } };

export const Horizontal: Story = {
  args: { orientation: "horizontal", series: [{ key: "desktop", label: "Desktop" }] },
};

export const Stacked: Story = { args: { stacked: true, showLegend: true } };

export const WithLabels: Story = {
  args: { series: [{ key: "desktop", label: "Desktop" }], showLabels: true },
};

export const ColoredBars: Story = {
  args: {
    data: [
      { month: "January", desktop: 186, fill: "var(--chart-1)" },
      { month: "February", desktop: 305, fill: "var(--chart-2)" },
      { month: "March", desktop: 237, fill: "var(--chart-3)" },
    ],
    series: [{ key: "desktop", label: "Desktop" }],
    colorKey: "fill",
  },
};
