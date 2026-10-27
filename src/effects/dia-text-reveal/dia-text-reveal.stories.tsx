import type { Meta, StoryObj } from "@storybook/react-vite";

import { DiaTextReveal } from "./dia-text-reveal";

const meta = {
  title: "Effects/Text/DiaTextReveal",
  component: DiaTextReveal,
  tags: ["autodocs"],
  parameters: { layout: "centered" },
} satisfies Meta<typeof DiaTextReveal>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { text: "Lost UI", repeat: true, repeatDelay: 1.5, className: "text-5xl font-bold" },
};
