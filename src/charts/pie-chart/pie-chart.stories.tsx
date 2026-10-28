import type { Meta, StoryObj } from "@storybook/react-vite";

import { browserShare } from "../../stories/chart-data";
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
