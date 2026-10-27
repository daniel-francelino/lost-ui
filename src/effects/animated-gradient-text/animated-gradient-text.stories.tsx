import type { Meta, StoryObj } from "@storybook/react-vite";
import AnimatedGradientTextDemoExample from "./examples/animated-gradient-text-demo";
import animatedGradientTextDemoExampleSource from "./examples/animated-gradient-text-demo.tsx?raw";
import AnimatedGradientTextDemo2Example from "./examples/animated-gradient-text-demo-2";
import animatedGradientTextDemo2ExampleSource from "./examples/animated-gradient-text-demo-2.tsx?raw";

import { AnimatedGradientText } from "./animated-gradient-text";

const meta = {
  title: "Effects/Text/AnimatedGradientText",
  component: AnimatedGradientText,
  tags: ["autodocs"],
  parameters: { layout: "centered" },
} satisfies Meta<typeof AnimatedGradientText>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  args: { children: "Introducing lost-ui" },
  render: (args) => (
    <div className="rounded-full border px-4 py-1.5 text-sm font-medium">
      <AnimatedGradientText {...args} />
    </div>
  ),
};

export const Default: StoryObj = {
  render: () => <AnimatedGradientTextDemoExample />,
  parameters: {
    layout: "padded",
    docs: { source: { code: animatedGradientTextDemoExampleSource, language: "tsx" } },
  },
};

export const Example2: StoryObj = {
  render: () => <AnimatedGradientTextDemo2Example />,
  parameters: {
    layout: "padded",
    docs: { source: { code: animatedGradientTextDemo2ExampleSource, language: "tsx" } },
  },
};
