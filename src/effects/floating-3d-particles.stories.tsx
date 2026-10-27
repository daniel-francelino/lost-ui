import type { Meta, StoryObj } from "@storybook/react-vite";

import { Floating3DParticles } from "./floating-3d-particles";

const meta = {
  title: "Effects/Backgrounds/Floating3DParticles",
  component: Floating3DParticles,
  tags: ["autodocs"],
  parameters: { layout: "padded" },
} satisfies Meta<typeof Floating3DParticles>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { quantity: 60 },
  render: (args) => (
    <div className="relative flex h-72 w-full max-w-xl items-center justify-center overflow-hidden rounded-lg border bg-background">
      <p className="z-10 text-sm font-medium">Background</p>
      <Floating3DParticles {...args} />
    </div>
  ),
};
