import type { Meta, StoryObj } from "@storybook/react-vite";
import Marquee3dExample from "./examples/marquee-3d";
import marquee3dExampleSource from "./examples/marquee-3d.tsx?raw";
import MarqueeDemoExample from "./examples/marquee-demo";
import marqueeDemoExampleSource from "./examples/marquee-demo.tsx?raw";
import MarqueeDemoVerticalExample from "./examples/marquee-demo-vertical";
import marqueeDemoVerticalExampleSource from "./examples/marquee-demo-vertical.tsx?raw";
import MarqueeLogosExample from "./examples/marquee-logos";
import marqueeLogosExampleSource from "./examples/marquee-logos.tsx?raw";

import { Marquee } from "./marquee";

const meta = {
  title: "Effects/Layout/Marquee",
  component: Marquee,
  tags: ["autodocs"],
  parameters: { layout: "padded" },
} satisfies Meta<typeof Marquee>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  args: { pauseOnHover: true, children: null },
  render: (args) => (
    <div className="relative flex w-full flex-col items-center justify-center overflow-hidden">
      <Marquee {...args} className="[--duration:20s]">
        {["Design", "Build", "Ship", "Repeat"].map((word) => (
          <span key={word} className="rounded-lg border px-4 py-2">
            {word}
          </span>
        ))}
      </Marquee>
    </div>
  ),
};

export const Vertical: Story = {
  args: { vertical: true, reverse: true, children: null },
  render: (args) => (
    <div className="relative flex h-64 w-48 flex-col items-center justify-center overflow-hidden">
      <Marquee {...args} className="[--duration:20s]">
        {["One", "Two", "Three"].map((word) => (
          <span key={word} className="rounded-lg border px-4 py-2">
            {word}
          </span>
        ))}
      </Marquee>
    </div>
  ),
};

export const Example3d: StoryObj = {
  render: () => <Marquee3dExample />,
  parameters: {
    layout: "padded",
    docs: { source: { code: marquee3dExampleSource, language: "tsx" } },
  },
};

export const Default: StoryObj = {
  render: () => <MarqueeDemoExample />,
  parameters: {
    layout: "padded",
    docs: { source: { code: marqueeDemoExampleSource, language: "tsx" } },
  },
};

export const VerticalExample: StoryObj = {
  render: () => <MarqueeDemoVerticalExample />,
  parameters: {
    layout: "padded",
    docs: { source: { code: marqueeDemoVerticalExampleSource, language: "tsx" } },
  },
};

export const Logos: StoryObj = {
  render: () => <MarqueeLogosExample />,
  parameters: {
    layout: "padded",
    docs: { source: { code: marqueeLogosExampleSource, language: "tsx" } },
  },
};
