import type { Meta, StoryObj } from "@storybook/react-vite";
import BorderBeamDemoExample from "./examples/border-beam-demo";
import borderBeamDemoExampleSource from "./examples/border-beam-demo.tsx?raw";
import BorderBeamDemo2Example from "./examples/border-beam-demo-2";
import borderBeamDemo2ExampleSource from "./examples/border-beam-demo-2.tsx?raw";
import BorderBeamDemo3Example from "./examples/border-beam-demo-3";
import borderBeamDemo3ExampleSource from "./examples/border-beam-demo-3.tsx?raw";
import BorderBeamDemo4Example from "./examples/border-beam-demo-4";
import borderBeamDemo4ExampleSource from "./examples/border-beam-demo-4.tsx?raw";

import { BorderBeam } from "./border-beam";

const meta = {
  title: "Effects/Cards/BorderBeam",
  component: BorderBeam,
  tags: ["autodocs"],
  parameters: { layout: "centered" },
} satisfies Meta<typeof BorderBeam>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  args: { size: 150, duration: 8 },
  render: (args) => (
    <div className="relative flex h-48 w-72 items-center justify-center overflow-hidden rounded-xl border bg-card text-card-foreground">
      <span className="text-sm">Border beam</span>
      <BorderBeam {...args} />
    </div>
  ),
};

export const Default: StoryObj = {
  render: () => <BorderBeamDemoExample />,
  parameters: {
    layout: "padded",
    docs: { source: { code: borderBeamDemoExampleSource, language: "tsx" } },
  },
};

export const Example2: StoryObj = {
  render: () => <BorderBeamDemo2Example />,
  parameters: {
    layout: "padded",
    docs: { source: { code: borderBeamDemo2ExampleSource, language: "tsx" } },
  },
};

export const Example3: StoryObj = {
  render: () => <BorderBeamDemo3Example />,
  parameters: {
    layout: "padded",
    docs: { source: { code: borderBeamDemo3ExampleSource, language: "tsx" } },
  },
};

export const Example4: StoryObj = {
  render: () => <BorderBeamDemo4Example />,
  parameters: {
    layout: "padded",
    docs: { source: { code: borderBeamDemo4ExampleSource, language: "tsx" } },
  },
};
