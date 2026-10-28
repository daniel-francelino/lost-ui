import type { Meta, StoryObj } from "@storybook/react-vite";
import WarpBackgroundDemoExample from "./examples/warp-background-demo";
import warpBackgroundDemoExampleSource from "./examples/warp-background-demo.tsx?raw";

import { WarpBackground } from "./warp-background";

const meta = {
  title: "Effects/Backgrounds/WarpBackground",
  component: WarpBackground,
  tags: ["autodocs"],
  parameters: { layout: "centered" },
} satisfies Meta<typeof WarpBackground>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  args: { children: <p className="w-56 text-center text-sm">Warp background</p> },
};

export const Default: StoryObj = {
  render: () => <WarpBackgroundDemoExample />,
  parameters: {
    layout: "padded",
    docs: { source: { code: warpBackgroundDemoExampleSource, language: "tsx" } },
  },
};
