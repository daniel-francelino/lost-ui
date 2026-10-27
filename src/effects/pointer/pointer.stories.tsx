import type { Meta, StoryObj } from "@storybook/react-vite";

import { Pointer } from "./pointer";

const meta = {
  title: "Effects/Interactive/Pointer",
  component: Pointer,
  tags: ["autodocs"],
  parameters: { layout: "centered" },
} satisfies Meta<typeof Pointer>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {},
  render: (args) => (
    <div className="relative flex h-48 w-72 items-center justify-center rounded-xl border">
      Hover here
      <Pointer {...args} />
    </div>
  ),
};
