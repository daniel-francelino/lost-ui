import type { Meta, StoryObj } from "@storybook/react-vite";

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
