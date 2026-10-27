import type { Meta, StoryObj } from "@storybook/react-vite";

import { OrbitingCircles } from "./orbiting-circles";

const meta = {
  title: "Effects/Media/OrbitingCircles",
  component: OrbitingCircles,
  tags: ["autodocs"],
  parameters: { layout: "centered" },
} satisfies Meta<typeof OrbitingCircles>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { radius: 100, iconSize: 30, path: true },
  render: (args) => (
    <div className="relative flex size-72 items-center justify-center overflow-hidden">
      <OrbitingCircles {...args}>
        {["A", "B", "C"].map((label) => (
          <div
            key={label}
            className="flex size-full items-center justify-center rounded-full border bg-background text-xs"
          >
            {label}
          </div>
        ))}
      </OrbitingCircles>
    </div>
  ),
};
