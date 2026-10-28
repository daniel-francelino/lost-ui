import type { Meta, StoryObj } from "@storybook/react-vite";

import { monthLabel, monthlyVisitors, visitorSeries } from "../../../stories/chart-data";
import { AreaChart } from "./area-chart";

const meta = {
  title: "Charts/AreaChart",
  component: AreaChart,
  tags: ["autodocs"],
  parameters: { layout: "padded" },
  args: {
    data: monthlyVisitors,
    xKey: "month",
    series: visitorSeries,
    xTickFormatter: monthLabel,
    className: "max-w-xl",
  },
} satisfies Meta<typeof AreaChart>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = { args: { showLegend: true } };

export const SingleSeries: Story = { args: { series: [{ key: "desktop", label: "Desktop" }] } };

export const Stacked: Story = { args: { stacked: true, showLegend: true } };

export const StackedExpanded: Story = { args: { expand: true, showYAxis: true, showLegend: true } };

export const Gradient: Story = { args: { gradient: true, showLegend: true } };

export const Step: Story = { args: { curve: "step" } };

export const WithYAxis: Story = { args: { showYAxis: true, curve: "linear" } };

export const WithTooltipOptions: Story = {
  args: { tooltipProps: { hideLabel: true }, tooltipIndicator: "line", xMinTickGap: 32 },
};
