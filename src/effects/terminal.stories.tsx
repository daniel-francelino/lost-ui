import type { Meta, StoryObj } from "@storybook/react-vite";

import { Terminal, AnimatedSpan, TerminalTypingAnimation } from "./terminal";

const meta = {
  title: "Effects/Layout/Terminal",
  component: Terminal,
  tags: ["autodocs"],
  parameters: { layout: "centered" },
} satisfies Meta<typeof Terminal>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { children: null },
  render: (args) => (
    <Terminal {...args}>
      <TerminalTypingAnimation>&gt; npm install lost-ui</TerminalTypingAnimation>
      <AnimatedSpan>added 1 package in 2s</AnimatedSpan>
    </Terminal>
  ),
};
