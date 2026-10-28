import type { Meta, StoryObj } from "@storybook/react-vite";
import TextRevealDemoExample from "./examples/text-reveal-demo";
import textRevealDemoExampleSource from "./examples/text-reveal-demo.tsx?raw";

import { TextReveal } from "./text-reveal";

const meta = {
  title: "Effects/Text/TextReveal",
  component: TextReveal,
  tags: ["autodocs"],
  parameters: { layout: "fullscreen" },
} satisfies Meta<typeof TextReveal>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  args: { children: "Components that reveal themselves as you scroll down the page." },
};

export const Default: StoryObj = {
  render: () => <TextRevealDemoExample />,
  parameters: {
    layout: "padded",
    docs: { source: { code: textRevealDemoExampleSource, language: "tsx" } },
  },
};
