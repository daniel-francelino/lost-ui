import type { Meta, StoryObj } from "@storybook/react-vite";
import { seriesFromConfig } from "../chart-series";

import { browserShare } from "../../stories/chart-data";
import { RadialChart } from "./radial-chart";

const meta = {
  title: "Charts/RadialChart",
  component: RadialChart,
  tags: ["autodocs"],
  parameters: { layout: "padded" },
  args: { data: browserShare, nameKey: "browser", valueKey: "visitors" },
} satisfies Meta<typeof RadialChart>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const WithGrid: Story = { args: { showGrid: true } };

export const WithLabels: Story = { args: { showLabels: true, innerRadius: 20, outerRadius: 120 } };

export const WithCenterLabel: Story = {
  args: {
    data: [{ browser: "Safari", visitors: 200 }],
    startAngle: 0,
    endAngle: 250,
    innerRadius: 80,
    outerRadius: 110,
    centerLabel: { value: 200, caption: "Visitors" },
  },
};

export const Stacked: Story = {
  args: {
    data: [{ month: "January", desktop: 1260, mobile: 570 }],
    series: seriesFromConfig({
      desktop: { label: "Desktop", color: "var(--chart-1)" },
      mobile: { label: "Mobile", color: "var(--chart-2)" },
    }),
    endAngle: 180,
    innerRadius: 80,
    outerRadius: 130,
    centerLabel: { value: 1830, caption: "Visitors" },
  },
};

export const GridRings: Story = {
  args: {
    data: [{ browser: "safari", visitors: 200 }],
    startAngle: 0,
    endAngle: 250,
    innerRadius: 80,
    outerRadius: 110,
    gridRadius: [86, 74],
  },
};

export const ConfigLabels: Story = {
  args: {
    showLabels: true,
    config: { Chrome: { label: "Google Chrome" } },
  },
};
