import type { Meta, StoryObj } from "@storybook/react-vite";

import { ShimmerButton } from "./shimmer-button";

const meta = {
  title: "Effects/Buttons/ShimmerButton",
  component: ShimmerButton,
  tags: ["autodocs"],
  parameters: { layout: "centered" },
} satisfies Meta<typeof ShimmerButton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { children: "Shimmer button" },
};
