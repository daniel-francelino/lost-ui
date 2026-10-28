import type { Meta, StoryObj } from "@storybook/react-vite";
import NoiseTextureDemoExample from "./examples/noise-texture-demo";
import noiseTextureDemoExampleSource from "./examples/noise-texture-demo.tsx?raw";
import NoiseTextureDemo2Example from "./examples/noise-texture-demo-2";
import noiseTextureDemo2ExampleSource from "./examples/noise-texture-demo-2.tsx?raw";
import NoiseTextureDemo3Example from "./examples/noise-texture-demo-3";
import noiseTextureDemo3ExampleSource from "./examples/noise-texture-demo-3.tsx?raw";
import NoiseTextureDemo4Example from "./examples/noise-texture-demo-4";
import noiseTextureDemo4ExampleSource from "./examples/noise-texture-demo-4.tsx?raw";

import { NoiseTexture } from "./noise-texture";

const meta = {
  title: "Effects/Backgrounds/NoiseTexture",
  component: NoiseTexture,
  tags: ["autodocs"],
  parameters: { layout: "padded" },
} satisfies Meta<typeof NoiseTexture>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  args: { frequency: 0.8, noiseOpacity: 0.3 },
  render: (args) => (
    <div className="relative flex h-72 w-full max-w-xl items-center justify-center overflow-hidden rounded-lg border bg-background">
      <p className="z-10 text-sm font-medium">Background</p>
      <NoiseTexture {...args} />
    </div>
  ),
};

export const Default: StoryObj = {
  render: () => <NoiseTextureDemoExample />,
  parameters: {
    layout: "padded",
    docs: { source: { code: noiseTextureDemoExampleSource, language: "tsx" } },
  },
};

export const Example2: StoryObj = {
  render: () => <NoiseTextureDemo2Example />,
  parameters: {
    layout: "padded",
    docs: { source: { code: noiseTextureDemo2ExampleSource, language: "tsx" } },
  },
};

export const Example3: StoryObj = {
  render: () => <NoiseTextureDemo3Example />,
  parameters: {
    layout: "padded",
    docs: { source: { code: noiseTextureDemo3ExampleSource, language: "tsx" } },
  },
};

export const Example4: StoryObj = {
  render: () => <NoiseTextureDemo4Example />,
  parameters: {
    layout: "padded",
    docs: { source: { code: noiseTextureDemo4ExampleSource, language: "tsx" } },
  },
};
