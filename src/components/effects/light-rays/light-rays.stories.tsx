import type { Meta, StoryObj } from "@storybook/react-vite";
import LightRaysDemoExample from "./examples/light-rays-demo";
import lightRaysDemoExampleSource from "./examples/light-rays-demo.tsx?raw";

import { LightRays } from "./light-rays";

const meta = {
  title: "Effects/Backgrounds/LightRays",
  component: LightRays,
  tags: ["autodocs"],
  parameters: { layout: "padded" },
} satisfies Meta<typeof LightRays>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  args: {},
  render: (args) => (
    <div className="relative flex h-72 w-full max-w-xl items-center justify-center overflow-hidden rounded-lg border bg-background">
      <p className="z-10 text-sm font-medium">Background</p>
      <LightRays {...args} />
    </div>
  ),
};

export const Default: StoryObj = {
  render: () => <LightRaysDemoExample />,
  parameters: {
    layout: "padded",
    docs: { source: { code: lightRaysDemoExampleSource, language: "tsx" } },
  },
};
