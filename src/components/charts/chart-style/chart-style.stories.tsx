import type { Meta, StoryObj } from "@storybook/react-vite";

import { ChartStyle } from "./chart-style";

const meta = {
  title: "Charts/ChartStyle",
  component: ChartStyle,
  tags: ["autodocs"],
} satisfies Meta<typeof ChartStyle>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  args: {
    id: "chart-demo",
    config: {
      desktop: { label: "Desktop", color: "var(--chart-1)" },
      mobile: { label: "Mobile", color: "var(--chart-2)" },
    },
  },
  render: (args) => (
    <div data-chart={args.id} className="flex gap-2">
      <ChartStyle {...args} />
      <span className="size-8 rounded-md" style={{ background: "var(--color-desktop)" }} />
      <span className="size-8 rounded-md" style={{ background: "var(--color-mobile)" }} />
    </div>
  ),
};
