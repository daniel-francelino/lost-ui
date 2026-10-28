import type { Meta, StoryObj } from "@storybook/react-vite";

import { ChartCenterLabel } from "./chart-center-label";

const meta = {
  title: "Charts/ChartCenterLabel",
  component: ChartCenterLabel,
  tags: ["autodocs"],
} satisfies Meta<typeof ChartCenterLabel>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  args: { value: 1260, caption: "Visitors", viewBox: { cx: 100, cy: 90 } },
  render: (args) => (
    <svg viewBox="0 0 200 200" className="size-48">
      <ChartCenterLabel {...args} />
    </svg>
  ),
};

export const WithoutCaption: Story = {
  args: { value: "98%", viewBox: { cx: 100, cy: 100 } },
  render: (args) => (
    <svg viewBox="0 0 200 200" className="size-48">
      <ChartCenterLabel {...args} />
    </svg>
  ),
};
