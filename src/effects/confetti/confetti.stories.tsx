import type { Meta, StoryObj } from "@storybook/react-vite";

import { ConfettiButton } from "./confetti";

const meta = {
  title: "Effects/Interactive/Confetti",
  component: ConfettiButton,
  tags: ["autodocs"],
  parameters: { layout: "centered" },
} satisfies Meta<typeof ConfettiButton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { children: "Celebrate" },
};
