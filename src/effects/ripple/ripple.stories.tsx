import type { Meta, StoryObj } from "@storybook/react-vite";
import RippleDemoExample from "./examples/ripple-demo";
import rippleDemoExampleSource from "./examples/ripple-demo.tsx?raw";

import { Ripple } from "./ripple";

const meta = {
  title: "Effects/Backgrounds/Ripple",
  component: Ripple,
  tags: ["autodocs"],
  parameters: { layout: "padded" },
} satisfies Meta<typeof Ripple>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  args: {},
  render: (args) => (
    <div className="relative flex h-72 w-full max-w-xl items-center justify-center overflow-hidden rounded-lg border bg-background">
      <p className="z-10 text-sm font-medium">Background</p>
      <Ripple {...args} />
    </div>
  ),
};

export const Default: StoryObj = {
  render: () => <RippleDemoExample />,
  parameters: {
    layout: "padded",
    docs: { source: { code: rippleDemoExampleSource, language: "tsx" } },
  },
};
