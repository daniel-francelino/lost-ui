import type { Meta, StoryObj } from "@storybook/react-vite";
import { MonitorIcon, SmartphoneIcon } from "lucide-react";

import { ChartContext } from "../lib/chart-context";
import { ChartLegendContent } from "./chart-legend-content";

const config = {
  desktop: { label: "Desktop", color: "var(--chart-1)", icon: MonitorIcon },
  mobile: { label: "Mobile", color: "var(--chart-2)", icon: SmartphoneIcon },
};

const payload = [
  { dataKey: "desktop", value: "desktop", color: "var(--chart-1)", type: "square" },
  { dataKey: "mobile", value: "mobile", color: "var(--chart-2)", type: "square" },
];

const meta = {
  title: "Charts/ChartLegendContent",
  component: ChartLegendContent,
  tags: ["autodocs"],
  parameters: { layout: "centered" },
  decorators: [
    (Story) => (
      <ChartContext.Provider value={{ config }}>
        <Story />
      </ChartContext.Provider>
    ),
  ],
  args: { payload } as never,
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Playground: Story = { args: { hideIcon: true } };

export const WithIcons: Story = {};

export const TopAligned: Story = { args: { verticalAlign: "top", hideIcon: true } };
