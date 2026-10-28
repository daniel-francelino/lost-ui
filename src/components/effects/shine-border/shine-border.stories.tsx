import type { Meta, StoryObj } from "@storybook/react-vite";
import ShineBorderDemoExample from "./examples/shine-border-demo";
import shineBorderDemoExampleSource from "./examples/shine-border-demo.tsx?raw";
import ShineBorderDemo2Example from "./examples/shine-border-demo-2";
import shineBorderDemo2ExampleSource from "./examples/shine-border-demo-2.tsx?raw";

import { ShineBorder } from "./shine-border";

const meta = {
  title: "Effects/Cards/ShineBorder",
  component: ShineBorder,
  tags: ["autodocs"],
  parameters: { layout: "centered" },
} satisfies Meta<typeof ShineBorder>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  args: { shineColor: ["var(--effect-from)", "var(--effect-to)"] },
  render: (args) => (
    <div className="relative flex h-48 w-72 items-center justify-center overflow-hidden rounded-xl border bg-card text-card-foreground">
      <span className="text-sm">Shine border</span>
      <ShineBorder {...args} />
    </div>
  ),
};

export const Default: StoryObj = {
  render: () => <ShineBorderDemoExample />,
  parameters: {
    layout: "padded",
    docs: { source: { code: shineBorderDemoExampleSource, language: "tsx" } },
  },
};

export const Example2: StoryObj = {
  render: () => <ShineBorderDemo2Example />,
  parameters: {
    layout: "padded",
    docs: { source: { code: shineBorderDemo2ExampleSource, language: "tsx" } },
  },
};
