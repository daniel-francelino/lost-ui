import type { Meta, StoryObj } from "@storybook/react-vite";

import { PulsatingButton } from "./pulsating-button";

const meta = {
  title: "Effects/Buttons/PulsatingButton",
  component: PulsatingButton,
  tags: ["autodocs"],
  parameters: { layout: "centered" },
} satisfies Meta<typeof PulsatingButton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { children: "Join the waitlist" },
};

export const Ripple: Story = {
  args: { children: "Join the waitlist", variant: "ripple" },
};
