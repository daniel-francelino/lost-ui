import type { Meta, StoryObj } from "@storybook/react-vite";
import Text3dFlipDemoExample from "./examples/text-3d-flip-demo";
import text3dFlipDemoExampleSource from "./examples/text-3d-flip-demo.tsx?raw";
import Text3dFlipDemo2Example from "./examples/text-3d-flip-demo-2";
import text3dFlipDemo2ExampleSource from "./examples/text-3d-flip-demo-2.tsx?raw";

import { Text3DFlip } from "./text-3d-flip";

const meta = {
  title: "Effects/Text/Text3DFlip",
  component: Text3DFlip,
  tags: ["autodocs"],
  parameters: { layout: "centered" },
} satisfies Meta<typeof Text3DFlip>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  args: { children: "Flip me", className: "text-5xl font-bold" },
};

export const Default: StoryObj = {
  render: () => <Text3dFlipDemoExample />,
  parameters: {
    layout: "padded",
    docs: { source: { code: text3dFlipDemoExampleSource, language: "tsx" } },
  },
};

export const Example2: StoryObj = {
  render: () => <Text3dFlipDemo2Example />,
  parameters: {
    layout: "padded",
    docs: { source: { code: text3dFlipDemo2ExampleSource, language: "tsx" } },
  },
};
