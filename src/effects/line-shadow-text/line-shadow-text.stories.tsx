import type { Meta, StoryObj } from "@storybook/react-vite";
import LineShadowTextDemoExample from "./examples/line-shadow-text-demo";
import lineShadowTextDemoExampleSource from "./examples/line-shadow-text-demo.tsx?raw";

import { LineShadowText } from "./line-shadow-text";

const meta = {
  title: "Effects/Text/LineShadowText",
  component: LineShadowText,
  tags: ["autodocs"],
  parameters: { layout: "centered" },
} satisfies Meta<typeof LineShadowText>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  args: { children: "Shadow", className: "text-6xl font-bold" },
};

export const Default: StoryObj = {
  render: () => <LineShadowTextDemoExample />,
  parameters: {
    layout: "padded",
    docs: { source: { code: lineShadowTextDemoExampleSource, language: "tsx" } },
  },
};
