import type { Meta, StoryObj } from "@storybook/react-vite";

import { TextReveal } from "./text-reveal";

const meta = {
  title: "Effects/Text/TextReveal",
  component: TextReveal,
  tags: ["autodocs"],
  parameters: { layout: "fullscreen" },
} satisfies Meta<typeof TextReveal>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { children: "Components that reveal themselves as you scroll down the page." },
};
