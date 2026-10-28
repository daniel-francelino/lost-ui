import type { Meta, StoryObj } from "@storybook/react-vite";

import { Separator } from "./separator";

const meta = {
  title: "UI/Separator",
  component: Separator,
  tags: ["autodocs"],
  parameters: { layout: "centered" },
} satisfies Meta<typeof Separator>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { className: "w-64" },
};

export const Vertical: Story = {
  args: { orientation: "vertical", className: "h-8" },
};
