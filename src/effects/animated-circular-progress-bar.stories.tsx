import type { Meta, StoryObj } from "@storybook/react-vite";

import { AnimatedCircularProgressBar } from "./animated-circular-progress-bar";

const meta = {
  title: "Effects/Media/AnimatedCircularProgressBar",
  component: AnimatedCircularProgressBar,
  tags: ["autodocs"],
  parameters: { layout: "centered" },
} satisfies Meta<typeof AnimatedCircularProgressBar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    value: 65,
    min: 0,
    max: 100,
    gaugePrimaryColor: "var(--primary)",
    gaugeSecondaryColor: "var(--muted)",
    className: "size-40",
  },
};
