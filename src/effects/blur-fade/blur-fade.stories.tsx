import type { Meta, StoryObj } from "@storybook/react-vite";

import { BlurFade } from "./blur-fade";

const meta = {
  title: "Effects/Layout/BlurFade",
  component: BlurFade,
  tags: ["autodocs"],
  parameters: { layout: "centered" },
} satisfies Meta<typeof BlurFade>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { children: <p className="text-2xl font-semibold">Blur fade</p>, delay: 0.1, blur: "8px" },
};
