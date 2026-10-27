import type { Meta, StoryObj } from "@storybook/react-vite";

import { Text3DFlip } from "./text-3d-flip";

const meta = {
  title: "Effects/Text/Text3DFlip",
  component: Text3DFlip,
  tags: ["autodocs"],
  parameters: { layout: "centered" },
} satisfies Meta<typeof Text3DFlip>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { children: "Flip me", className: "text-5xl font-bold" },
};
