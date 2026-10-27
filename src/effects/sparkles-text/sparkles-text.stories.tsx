import type { Meta, StoryObj } from "@storybook/react-vite";
import SparklesTextDemoExample from "./examples/sparkles-text-demo";
import sparklesTextDemoExampleSource from "./examples/sparkles-text-demo.tsx?raw";

import { SparklesText } from "./sparkles-text";

const meta = {
  title: "Effects/Text/SparklesText",
  component: SparklesText,
  tags: ["autodocs"],
  parameters: { layout: "centered" },
} satisfies Meta<typeof SparklesText>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  args: { children: "Sparkles", className: "text-5xl" },
};

export const Default: StoryObj = {
  render: () => <SparklesTextDemoExample />,
  parameters: {
    layout: "padded",
    docs: { source: { code: sparklesTextDemoExampleSource, language: "tsx" } },
  },
};
