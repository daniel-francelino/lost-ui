import type { Meta, StoryObj } from "@storybook/react-vite";

import { monthlyVisitors, visitorSeries } from "../../../stories/chart-data";
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

export const WithoutGrid: Story = { args: { showGrid: false, showDots: true } };

export const FilledGrid: Story = { args: { gridFilled: true } };

export const NoRadialLines: Story = { args: { radialLines: false } };

export const SingleRing: Story = { args: { radialLines: false, gridRadius: [90] } };

export const CustomAngleLabels: Story = {
  args: {
    angleTick: ({ x, y, index, payload }) => (
      <text key={index} data-testid="angle-tick" x={x} y={y}>
        {payload.value.slice(0, 3)}
      </text>
    ),
  },
};
