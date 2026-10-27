import type { Meta, StoryObj } from "@storybook/react-vite";

import { Calendar } from "./calendar";

const meta = {
  title: "UI/Calendar",
  component: Calendar,
  tags: ["autodocs"],
  parameters: { layout: "centered" },
} satisfies Meta<typeof Calendar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { mode: "single", defaultMonth: new Date(2026, 0, 1), className: "rounded-md border" },
};
