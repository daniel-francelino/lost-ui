import type { Meta, StoryObj } from "@storybook/react-vite";

import { SmoothCursor } from "./smooth-cursor";

const meta = {
  title: "Effects/Interactive/SmoothCursor",
  component: SmoothCursor,
  tags: ["autodocs"],
  parameters: { layout: "centered" },
} satisfies Meta<typeof SmoothCursor>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {},
  render: (args) => (
    <div className="flex h-64 w-96 items-center justify-center rounded-xl border text-sm">
      Move the mouse over this canvas
      <SmoothCursor {...args} />
    </div>
  ),
};
