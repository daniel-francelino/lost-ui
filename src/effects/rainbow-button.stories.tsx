import type { Meta, StoryObj } from "@storybook/react-vite";

import { RainbowButton } from "./rainbow-button";

const meta = {
  title: "Effects/Buttons/RainbowButton",
  component: RainbowButton,
  tags: ["autodocs"],
  parameters: { layout: "centered" },
} satisfies Meta<typeof RainbowButton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { children: "Get unlimited access" },
};

export const Outline: Story = {
  args: { children: "Get unlimited access", variant: "outline" },
};
