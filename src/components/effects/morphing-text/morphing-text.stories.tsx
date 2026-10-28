import type { Meta, StoryObj } from "@storybook/react-vite";
import MorphingTextDemoExample from "./examples/morphing-text-demo";
import morphingTextDemoExampleSource from "./examples/morphing-text-demo.tsx?raw";

import { MorphingText } from "./morphing-text";

const meta = {
  title: "Effects/Text/MorphingText",
  component: MorphingText,
  tags: ["autodocs"],
  parameters: { layout: "centered" },
} satisfies Meta<typeof MorphingText>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  args: { texts: ["Hello", "Morphing", "Text", "Lost UI"] },
};

export const Default: StoryObj = {
  render: () => <MorphingTextDemoExample />,
  parameters: {
    layout: "padded",
    docs: { source: { code: morphingTextDemoExampleSource, language: "tsx" } },
  },
};
