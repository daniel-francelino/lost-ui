import type { Meta, StoryObj } from "@storybook/react-vite";

import { NoiseTexture } from "./noise-texture";

const meta = {
  title: "Effects/Backgrounds/NoiseTexture",
  component: NoiseTexture,
  tags: ["autodocs"],
  parameters: { layout: "padded" },
} satisfies Meta<typeof NoiseTexture>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { frequency: 0.8, noiseOpacity: 0.3 },
  render: (args) => (
    <div className="relative flex h-72 w-full max-w-xl items-center justify-center overflow-hidden rounded-lg border bg-background">
      <p className="z-10 text-sm font-medium">Background</p>
      <NoiseTexture {...args} />
    </div>
  ),
};
