import type { Meta, StoryObj } from "@storybook/react-vite";
import AnimatedListDemoExample from "./examples/animated-list-demo";
import animatedListDemoExampleSource from "./examples/animated-list-demo.tsx?raw";

import { AnimatedList } from "./animated-list";

const meta = {
  title: "Effects/Layout/AnimatedList",
  component: AnimatedList,
  tags: ["autodocs"],
  parameters: { layout: "centered" },
} satisfies Meta<typeof AnimatedList>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  args: { children: null, delay: 1000 },
  render: (args) => (
    <AnimatedList {...args}>
      {["Payment received", "New message", "Deploy finished"].map((item) => (
        <div key={item} className="w-72 rounded-lg border p-3 text-sm">
          {item}
        </div>
      ))}
    </AnimatedList>
  ),
};

export const Default: StoryObj = {
  render: () => <AnimatedListDemoExample />,
  parameters: {
    layout: "padded",
    docs: { source: { code: animatedListDemoExampleSource, language: "tsx" } },
  },
};
