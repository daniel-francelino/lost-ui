import type { Meta, StoryObj } from "@storybook/react-vite";

import { ChartContext } from "../lib/chart-context";
import { ChartTooltipContent } from "./chart-tooltip-content";

const config = {
  desktop: { label: "Desktop", color: "var(--chart-1)" },
  mobile: { label: "Mobile", color: "var(--chart-2)" },
};

export const payload = [
  {
    dataKey: "desktop",
    name: "desktop",
    value: 186,
    color: "var(--chart-1)",
    payload: { month: "January", desktop: 186, mobile: 80 },
  },
  {
    dataKey: "mobile",
    name: "mobile",
    value: 80,
    color: "var(--chart-2)",
    payload: { month: "January", desktop: 186, mobile: 80 },
  },
];

const meta = {
  title: "Charts/ChartTooltipContent",
  component: ChartTooltipContent,
  tags: ["autodocs"],
  parameters: { layout: "centered" },
  decorators: [
    (Story) => (
      <ChartContext.Provider value={{ config }}>
        <Story />
      </ChartContext.Provider>
    ),
  ],
  args: { active: true, payload, label: "January" } as never,
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Playground: Story = {};

export const LineIndicator: Story = { args: { indicator: "line" } };

export const DashedIndicator: Story = { args: { indicator: "dashed" } };

export const HiddenLabel: Story = { args: { hideLabel: true } };

export const HiddenIndicator: Story = { args: { hideIndicator: true } };

export const SingleItem: Story = { args: { payload: payload.slice(0, 1), indicator: "line" } };
