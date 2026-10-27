import type { Meta, StoryObj } from "@storybook/react-vite";

import { Toggle } from "./toggle";

const meta = {
  title: "UI/Toggle",
  component: Toggle,
  tags: ["autodocs"],
  parameters: { layout: "centered" },
} satisfies Meta<typeof Toggle>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { "aria-label": "Toggle italic", children: "Italic" },
};

export const Outline: Story = {
  args: { "aria-label": "Toggle bold", variant: "outline", children: "Bold" },
};
