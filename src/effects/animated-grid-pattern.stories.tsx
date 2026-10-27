import type { Meta, StoryObj } from "@storybook/react-vite";

import { AnimatedGridPattern } from "./animated-grid-pattern";

const meta = {
  title: "Effects/Backgrounds/AnimatedGridPattern",
  component: AnimatedGridPattern,
  tags: ["autodocs"],
  parameters: { layout: "padded" },
} satisfies Meta<typeof AnimatedGridPattern>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { numSquares: 30, maxOpacity: 0.1, duration: 3, repeatDelay: 1 },
  render: (args) => (
    <div className="relative flex h-72 w-full max-w-xl items-center justify-center overflow-hidden rounded-lg border bg-background">
      <p className="z-10 text-sm font-medium">Background</p>
      <AnimatedGridPattern
        {...args}
        className="[mask-image:radial-gradient(300px_circle_at_center,white,transparent)] inset-x-0 inset-y-[-30%] h-[200%] skew-y-12"
      />
    </div>
  ),
};
