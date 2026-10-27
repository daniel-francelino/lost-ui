import type { Meta, StoryObj } from "@storybook/react-vite";

import { ShineBorder } from "./shine-border";

const meta = {
  title: "Effects/Cards/ShineBorder",
  component: ShineBorder,
  tags: ["autodocs"],
  parameters: { layout: "centered" },
} satisfies Meta<typeof ShineBorder>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { shineColor: ["var(--effect-from)", "var(--effect-to)"] },
  render: (args) => (
    <div className="relative flex h-48 w-72 items-center justify-center overflow-hidden rounded-xl border bg-card text-card-foreground">
      <span className="text-sm">Shine border</span>
      <ShineBorder {...args} />
    </div>
  ),
};
