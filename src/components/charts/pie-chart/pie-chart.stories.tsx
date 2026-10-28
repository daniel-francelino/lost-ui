import type { Meta, StoryObj } from "@storybook/react-vite";

import { browserShare } from "../../../stories/chart-data";
import { PieChart } from "./pie-chart";

const meta = {
  title: "Charts/PieChart",
  component: PieChart,
  tags: ["autodocs"],
  parameters: { layout: "padded" },
  args: { data: browserShare, nameKey: "browser", valueKey: "visitors" },
} satisfies Meta<typeof PieChart>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = { args: { showLegend: true } };

export const Donut: Story = { args: { donut: true, paddingAngle: 2 } };

export const DonutWithTotal: Story = {
  args: { donut: true, centerLabel: { value: 925, caption: "Visitors" } },
};

export const WithLabels: Story = { args: { showLabels: true } };

export const CustomColors: Story = {
  args: {
    data: [
      { browser: "Chrome", visitors: 275, fill: "var(--chart-1)" },
      { browser: "Safari", visitors: 200, fill: "var(--chart-4)" },
    ],
    colorKey: "fill",
  },
};

export const OutsideLabels: Story = { args: { showLabels: true, labelPosition: "outside" } };

export const FormattedOutsideLabels: Story = {
  args: {
    showLabels: true,
    labelPosition: "outside",
    labelFormatter: (value) => `${String(value)} visits`,
  },
};

export const WithoutSeparator: Story = { args: { showSeparator: false } };

export const Highlighted: Story = { args: { donut: true, activeIndex: 0 } };

export const TwoRings: Story = {
  args: {
    data: [
      { month: "January", mobile: 80 },
      { month: "February", mobile: 200 },
    ],
    nameKey: "month",
    valueKey: "mobile",
    inner: {
      data: [
        { month: "January", desktop: 186 },
        { month: "February", desktop: 305 },
      ],
      valueKey: "desktop",
    },
  },
};

export const ConfigLabels: Story = {
  args: {
    data: [
      { browser: "chrome", visitors: 275, fill: "var(--chart-1)" },
      { browser: "safari", visitors: 200, fill: "var(--chart-2)" },
    ],
    colorKey: "fill",
    showLegend: true,
    config: { chrome: { label: "Google Chrome" }, safari: { label: "Apple Safari" } },
  },
};
