import type { Meta, StoryObj } from "@storybook/react-vite";
import RainbowButtonDemoExample from "./examples/rainbow-button-demo";
import rainbowButtonDemoExampleSource from "./examples/rainbow-button-demo.tsx?raw";
import RainbowButtonDemo2Example from "./examples/rainbow-button-demo-2";
import rainbowButtonDemo2ExampleSource from "./examples/rainbow-button-demo-2.tsx?raw";

import { RainbowButton } from "./rainbow-button";

const meta = {
  title: "Effects/Buttons/RainbowButton",
  component: RainbowButton,
  tags: ["autodocs"],
  parameters: { layout: "centered" },
} satisfies Meta<typeof RainbowButton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  args: { children: "Get unlimited access" },
};

export const Outline: Story = {
  args: { children: "Get unlimited access", variant: "outline" },
};

export const Default: StoryObj = {
  render: () => <RainbowButtonDemoExample />,
  parameters: {
    layout: "padded",
    docs: { source: { code: rainbowButtonDemoExampleSource, language: "tsx" } },
  },
};

export const Example2: StoryObj = {
  render: () => <RainbowButtonDemo2Example />,
  parameters: {
    layout: "padded",
    docs: { source: { code: rainbowButtonDemo2ExampleSource, language: "tsx" } },
  },
};
