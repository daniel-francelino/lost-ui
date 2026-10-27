import type { Meta, StoryObj } from "@storybook/react-vite";
import PointerDemo1Example from "./examples/pointer-demo-1";
import pointerDemo1ExampleSource from "./examples/pointer-demo-1.tsx?raw";

import { Pointer } from "./pointer";

const meta = {
  title: "Effects/Interactive/Pointer",
  component: Pointer,
  tags: ["autodocs"],
  parameters: { layout: "centered" },
} satisfies Meta<typeof Pointer>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  args: {},
  render: (args) => (
    <div className="relative flex h-48 w-72 items-center justify-center rounded-xl border">
      Hover here
      <Pointer {...args} />
    </div>
  ),
};

export const Example1: StoryObj = {
  render: () => <PointerDemo1Example />,
  parameters: {
    layout: "padded",
    docs: { source: { code: pointerDemo1ExampleSource, language: "tsx" } },
  },
};
