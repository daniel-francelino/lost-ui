import type { Meta, StoryObj } from "@storybook/react-vite";
import PulsatingButtonDemoExample from "./examples/pulsating-button-demo";
import pulsatingButtonDemoExampleSource from "./examples/pulsating-button-demo.tsx?raw";
import PulsatingButtonDemo2Example from "./examples/pulsating-button-demo-2";
import pulsatingButtonDemo2ExampleSource from "./examples/pulsating-button-demo-2.tsx?raw";

import { PulsatingButton } from "./pulsating-button";

const meta = {
  title: "Effects/Buttons/PulsatingButton",
  component: PulsatingButton,
  tags: ["autodocs"],
  parameters: { layout: "centered" },
} satisfies Meta<typeof PulsatingButton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  args: { children: "Join the waitlist" },
};

export const Ripple: Story = {
  args: { children: "Join the waitlist", variant: "ripple" },
};

export const Default: StoryObj = {
  render: () => <PulsatingButtonDemoExample />,
  parameters: {
    layout: "padded",
    docs: { source: { code: pulsatingButtonDemoExampleSource, language: "tsx" } },
  },
};

export const Example2: StoryObj = {
  render: () => <PulsatingButtonDemo2Example />,
  parameters: {
    layout: "padded",
    docs: { source: { code: pulsatingButtonDemo2ExampleSource, language: "tsx" } },
  },
};
