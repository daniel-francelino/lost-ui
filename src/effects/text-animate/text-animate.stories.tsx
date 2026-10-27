import type { Meta, StoryObj } from "@storybook/react-vite";

import { TextAnimate } from "./text-animate";

const meta = {
  title: "Effects/Text/TextAnimate",
  component: TextAnimate,
  tags: ["autodocs"],
  parameters: { layout: "centered" },
} satisfies Meta<typeof TextAnimate>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { children: "Animated text from lost-ui", by: "word", className: "text-3xl font-semibold" },
};

export const ByCharacter: Story = {
  args: {
    children: "Characters",
    by: "character",
    animation: "blurInUp",
    className: "text-3xl font-semibold",
  },
};
