import type { Meta, StoryObj } from "@storybook/react-vite";
import AnimatedShinyTextDemoExample from "./examples/animated-shiny-text-demo";
import animatedShinyTextDemoExampleSource from "./examples/animated-shiny-text-demo.tsx?raw";

import { AnimatedShinyText } from "./animated-shiny-text";

const meta = {
  title: "Effects/Text/AnimatedShinyText",
  component: AnimatedShinyText,
  tags: ["autodocs"],
  parameters: { layout: "centered" },
} satisfies Meta<typeof AnimatedShinyText>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  args: { children: "Introducing lost-ui" },
  render: (args) => <AnimatedShinyText {...args} />,
};

export const Default: StoryObj = {
  render: () => <AnimatedShinyTextDemoExample />,
  parameters: {
    layout: "padded",
    docs: { source: { code: animatedShinyTextDemoExampleSource, language: "tsx" } },
  },
};
