import type { Meta, StoryObj } from "@storybook/react-vite";
import TerminalDemoExample from "./examples/terminal-demo";
import terminalDemoExampleSource from "./examples/terminal-demo.tsx?raw";
import TerminalDemo2Example from "./examples/terminal-demo-2";
import terminalDemo2ExampleSource from "./examples/terminal-demo-2.tsx?raw";

import { Terminal, AnimatedSpan, TerminalTypingAnimation } from "./terminal";

const meta = {
  title: "Effects/Layout/Terminal",
  component: Terminal,
  tags: ["autodocs"],
  parameters: { layout: "centered" },
} satisfies Meta<typeof Terminal>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  args: { children: null },
  render: (args) => (
    <Terminal {...args}>
      <TerminalTypingAnimation>&gt; npm install lost-ui</TerminalTypingAnimation>
      <AnimatedSpan>added 1 package in 2s</AnimatedSpan>
    </Terminal>
  ),
};

export const Default: StoryObj = {
  render: () => <TerminalDemoExample />,
  parameters: {
    layout: "padded",
    docs: { source: { code: terminalDemoExampleSource, language: "tsx" } },
  },
};

export const Example2: StoryObj = {
  render: () => <TerminalDemo2Example />,
  parameters: {
    layout: "padded",
    docs: { source: { code: terminalDemo2ExampleSource, language: "tsx" } },
  },
};
