import type { Meta, StoryObj } from "@storybook/react-vite";

import { LineShadowText } from "./line-shadow-text";

const meta = {
  title: "Effects/Text/LineShadowText",
  component: LineShadowText,
  tags: ["autodocs"],
  parameters: { layout: "centered" },
} satisfies Meta<typeof LineShadowText>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { children: "Shadow", className: "text-6xl font-bold" },
};
