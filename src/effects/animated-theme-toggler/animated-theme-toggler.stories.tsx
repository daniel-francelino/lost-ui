import type { Meta, StoryObj } from "@storybook/react-vite";

import { AnimatedThemeToggler } from "./animated-theme-toggler";

const meta = {
  title: "Effects/Buttons/AnimatedThemeToggler",
  component: AnimatedThemeToggler,
  tags: ["autodocs"],
  parameters: { layout: "centered" },
} satisfies Meta<typeof AnimatedThemeToggler>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {},
};
