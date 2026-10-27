import type { Meta, StoryObj } from "@storybook/react-vite";
import HyperTextDemoExample from "./examples/hyper-text-demo";
import hyperTextDemoExampleSource from "./examples/hyper-text-demo.tsx?raw";

import { HyperText } from "./hyper-text";

const meta = {
  title: "Effects/Text/HyperText",
  component: HyperText,
  tags: ["autodocs"],
  parameters: { layout: "centered" },
} satisfies Meta<typeof HyperText>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  args: { children: "Hyper Text", className: "text-4xl font-bold" },
};

export const Default: StoryObj = {
  render: () => <HyperTextDemoExample />,
  parameters: {
    layout: "padded",
    docs: { source: { code: hyperTextDemoExampleSource, language: "tsx" } },
  },
};
