import type { Meta, StoryObj } from "@storybook/react-vite";

import { DotPattern } from "./dot-pattern";

const meta = {
  title: "Effects/Backgrounds/DotPattern",
  component: DotPattern,
  tags: ["autodocs"],
  parameters: { layout: "padded" },
} satisfies Meta<typeof DotPattern>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { glow: true },
  render: (args) => (
    <div className="relative flex h-72 w-full max-w-xl items-center justify-center overflow-hidden rounded-lg border bg-background">
      <p className="z-10 text-sm font-medium">Background</p>
      <DotPattern
        {...args}
        className="[mask-image:radial-gradient(300px_circle_at_center,white,transparent)]"
      />
    </div>
  ),
};
