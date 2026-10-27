import type { Meta, StoryObj } from "@storybook/react-vite";

import { AnimatedGradientText } from "./animated-gradient-text";

const meta = {
  title: "Effects/Text/AnimatedGradientText",
  component: AnimatedGradientText,
  tags: ["autodocs"],
  parameters: { layout: "centered" },
} satisfies Meta<typeof AnimatedGradientText>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { children: "Introducing lost-ui" },
  render: (args) => (
    <div className="rounded-full border px-4 py-1.5 text-sm font-medium">
      <AnimatedGradientText {...args} />
    </div>
  ),
};
