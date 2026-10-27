import type { Meta, StoryObj } from "@storybook/react-vite";

import { InteractiveHoverButton } from "./interactive-hover-button";

const meta = {
  title: "Effects/Buttons/InteractiveHoverButton",
  component: InteractiveHoverButton,
  tags: ["autodocs"],
  parameters: { layout: "centered" },
} satisfies Meta<typeof InteractiveHoverButton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { children: "Hover me" },
};
