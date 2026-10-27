import type { Meta, StoryObj } from "@storybook/react-vite";
import DiaTextRevealDemoExample from "./examples/dia-text-reveal-demo";
import diaTextRevealDemoExampleSource from "./examples/dia-text-reveal-demo.tsx?raw";
import DiaTextRevealDemo2Example from "./examples/dia-text-reveal-demo-2";
import diaTextRevealDemo2ExampleSource from "./examples/dia-text-reveal-demo-2.tsx?raw";
import DiaTextRevealDemo3Example from "./examples/dia-text-reveal-demo-3";
import diaTextRevealDemo3ExampleSource from "./examples/dia-text-reveal-demo-3.tsx?raw";
import DiaTextRevealDemo4Example from "./examples/dia-text-reveal-demo-4";
import diaTextRevealDemo4ExampleSource from "./examples/dia-text-reveal-demo-4.tsx?raw";

import { DiaTextReveal } from "./dia-text-reveal";

const meta = {
  title: "Effects/Text/DiaTextReveal",
  component: DiaTextReveal,
  tags: ["autodocs"],
  parameters: { layout: "centered" },
} satisfies Meta<typeof DiaTextReveal>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  args: { text: "Lost UI", repeat: true, repeatDelay: 1.5, className: "text-5xl font-bold" },
};

export const Default: StoryObj = {
  render: () => <DiaTextRevealDemoExample />,
  parameters: {
    layout: "padded",
    docs: { source: { code: diaTextRevealDemoExampleSource, language: "tsx" } },
  },
};

export const Example2: StoryObj = {
  render: () => <DiaTextRevealDemo2Example />,
  parameters: {
    layout: "padded",
    docs: { source: { code: diaTextRevealDemo2ExampleSource, language: "tsx" } },
  },
};

export const Example3: StoryObj = {
  render: () => <DiaTextRevealDemo3Example />,
  parameters: {
    layout: "padded",
    docs: { source: { code: diaTextRevealDemo3ExampleSource, language: "tsx" } },
  },
};

export const Example4: StoryObj = {
  render: () => <DiaTextRevealDemo4Example />,
  parameters: {
    layout: "padded",
    docs: { source: { code: diaTextRevealDemo4ExampleSource, language: "tsx" } },
  },
};
