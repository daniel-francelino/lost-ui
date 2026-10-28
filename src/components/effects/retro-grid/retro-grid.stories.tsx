import type { Meta, StoryObj } from "@storybook/react-vite";
import RetroGridDemoExample from "./examples/retro-grid-demo";
import retroGridDemoExampleSource from "./examples/retro-grid-demo.tsx?raw";

import { RetroGrid } from "./retro-grid";

const meta = {
  title: "Effects/Backgrounds/RetroGrid",
  component: RetroGrid,
  tags: ["autodocs"],
  parameters: { layout: "padded" },
} satisfies Meta<typeof RetroGrid>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  args: { angle: 65 },
  render: (args) => (
    <div className="relative flex h-72 w-full max-w-xl items-center justify-center overflow-hidden rounded-lg border bg-background">
      <p className="z-10 text-sm font-medium">Background</p>
      <RetroGrid {...args} />
    </div>
  ),
};

export const Default: StoryObj = {
  render: () => <RetroGridDemoExample />,
  parameters: {
    layout: "padded",
    docs: { source: { code: retroGridDemoExampleSource, language: "tsx" } },
  },
};
