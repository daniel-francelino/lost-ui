import type { Meta, StoryObj } from "@storybook/react-vite";
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";

import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "./chart";

const chartData = [
  { month: "January", desktop: 186, mobile: 80 },
  { month: "February", desktop: 305, mobile: 200 },
  { month: "March", desktop: 237, mobile: 120 },
  { month: "April", desktop: 73, mobile: 190 },
];

const chartConfig = {
  desktop: { label: "Desktop", color: "var(--chart-1)" },
  mobile: { label: "Mobile", color: "var(--chart-2)" },
} satisfies ChartConfig;

const meta = {
  title: "Charts/Chart",
  component: ChartContainer,
  tags: ["autodocs"],
  parameters: { layout: "padded" },
} satisfies Meta<typeof ChartContainer>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  args: { config: chartConfig, children: <div />, className: "min-h-[200px] w-full" },
  render: (args) => (
    <ChartContainer {...args}>
      <BarChart accessibilityLayer data={chartData}>
        <CartesianGrid vertical={false} />
        <XAxis dataKey="month" tickLine={false} tickMargin={10} axisLine={false} />
        <ChartTooltip content={<ChartTooltipContent />} />
        <ChartLegend content={<ChartLegendContent />} />
        <Bar dataKey="desktop" fill="var(--color-desktop)" radius={4} />
        <Bar dataKey="mobile" fill="var(--color-mobile)" radius={4} />
      </BarChart>
    </ChartContainer>
  ),
};

export const WithThemeColors: Story = {
  args: {
    config: {
      desktop: {
        label: "Desktop",
        theme: { light: "oklch(0.6 0.2 250)", dark: "oklch(0.8 0.15 250)" },
      },
    },
    children: <div />,
    className: "min-h-[200px] w-full",
  },
  render: (args) => (
    <ChartContainer {...args}>
      <BarChart accessibilityLayer data={chartData}>
        <XAxis dataKey="month" tickLine={false} axisLine={false} />
        <Bar dataKey="desktop" fill="var(--color-desktop)" radius={4} />
      </BarChart>
    </ChartContainer>
  ),
};
