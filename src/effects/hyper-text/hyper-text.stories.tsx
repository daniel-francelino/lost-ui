import type { Meta, StoryObj } from "@storybook/react-vite";

import { HyperText } from "./hyper-text";

const meta = {
  title: "Effects/Text/HyperText",
  component: HyperText,
  tags: ["autodocs"],
  parameters: { layout: "centered" },
} satisfies Meta<typeof HyperText>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { children: "Hyper Text", className: "text-4xl font-bold" },
};
