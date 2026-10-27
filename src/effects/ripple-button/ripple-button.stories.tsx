import type { Meta, StoryObj } from "@storybook/react-vite";

import { RippleButton } from "./ripple-button";

const meta = {
  title: "Effects/Buttons/RippleButton",
  component: RippleButton,
  tags: ["autodocs"],
  parameters: { layout: "centered" },
} satisfies Meta<typeof RippleButton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { children: "Click me" },
};
