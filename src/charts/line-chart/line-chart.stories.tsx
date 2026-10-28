import type { Meta, StoryObj } from "@storybook/react-vite";
import { Dot } from "recharts";

import { monthLabel, monthlyVisitors, visitorSeries } from "../../stories/chart-data";
import { LineChart } from "./line-chart";

const meta = {
  title: "Charts/LineChart",
  component: LineChart,
  tags: ["autodocs"],
  parameters: { layout: "padded" },
  args: {
    data: monthlyVisitors,
    xKey: "month",
    series: visitorSeries,
    xTickFormatter: monthLabel,
    className: "max-w-xl",
  },
} satisfies Meta<typeof LineChart>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = { args: { showLegend: true } };

export const SingleSeries: Story = { args: { series: [{ key: "desktop", label: "Desktop" }] } };

export const WithDots: Story = { args: { showDots: true, curve: "linear" } };

export const WithLabels: Story = {
  args: { series: [{ key: "desktop", label: "Desktop" }], showDots: true, showLabels: true },
};

export const Step: Story = { args: { curve: "step" } };

export const ColoredDots: Story = {
  args: {
    data: [
      { month: "January", desktop: 186, fill: "var(--chart-1)" },
      { month: "February", desktop: 305, fill: "var(--chart-2)" },
      { month: "March", desktop: 237, fill: "var(--chart-3)" },
    ],
    series: [{ key: "desktop", label: "Desktop" }],
    dotColorKey: "fill",
  },
};

export const CustomDots: Story = {
  args: {
    series: [{ key: "desktop", label: "Desktop" }],
    renderDot: ({ cx, cy, index }) => (
      <Dot key={index} data-testid="custom-dot" r={7} cx={cx} cy={cy} fill="var(--chart-4)" />
    ),
  },
};

export const FormattedLabels: Story = {
  args: {
    series: [{ key: "desktop", label: "Desktop" }],
    labelKey: "month",
    labelFormatter: (value) => String(value).toUpperCase(),
  },
};
