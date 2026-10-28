import type { Meta, StoryObj } from "@storybook/react-vite";

import { monthlyVisitors, visitorSeries } from "../../stories/chart-data";
import { RadarChart } from "./radar-chart";

const meta = {
  title: "Charts/RadarChart",
  component: RadarChart,
  tags: ["autodocs"],
  parameters: { layout: "padded" },
  args: { data: monthlyVisitors, angleKey: "month", series: visitorSeries },
} satisfies Meta<typeof RadarChart>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = { args: { showLegend: true } };

export const SingleSeries: Story = { args: { series: [{ key: "desktop", label: "Desktop" }] } };

export const CircleGrid: Story = { args: { gridShape: "circle", showDots: true } };

export const LinesOnly: Story = { args: { filled: false, showLegend: true } };

export const WithRadiusAxis: Story = { args: { showRadiusAxis: true } };
