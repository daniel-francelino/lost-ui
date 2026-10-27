import type { Meta, StoryObj } from "@storybook/react-vite";

import { TypingAnimation } from "./typing-animation";

const meta = {
  title: "Effects/Text/TypingAnimation",
  component: TypingAnimation,
  tags: ["autodocs"],
  parameters: { layout: "centered" },
} satisfies Meta<typeof TypingAnimation>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { children: "Typing animation in lost-ui", className: "text-2xl font-semibold" },
};

export const RotatingWords: Story = {
  args: { words: ["Design", "Build", "Ship"], loop: true, className: "text-2xl font-semibold" },
};
