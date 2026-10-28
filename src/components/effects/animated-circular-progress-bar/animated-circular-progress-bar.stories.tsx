import type { Meta, StoryObj } from "@storybook/react-vite";
import AnimatedCircularProgressBarDemoExample from "./examples/animated-circular-progress-bar-demo";
import animatedCircularProgressBarDemoExampleSource from "./examples/animated-circular-progress-bar-demo.tsx?raw";

import { AnimatedCircularProgressBar } from "./animated-circular-progress-bar";

const meta = {
  title: "Effects/Media/AnimatedCircularProgressBar",
  component: AnimatedCircularProgressBar,
  tags: ["autodocs"],
  parameters: { layout: "centered" },
} satisfies Meta<typeof AnimatedCircularProgressBar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  args: {
    value: 65,
    min: 0,
    max: 100,
    gaugePrimaryColor: "var(--primary)",
    gaugeSecondaryColor: "var(--muted)",
    className: "size-40",
  },
};

export const Default: StoryObj = {
  render: () => <AnimatedCircularProgressBarDemoExample />,
  parameters: {
    layout: "padded",
    docs: { source: { code: animatedCircularProgressBarDemoExampleSource, language: "tsx" } },
  },
};
