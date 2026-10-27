import type { Meta, StoryObj } from "@storybook/react-vite";

import { NumberTicker } from "./number-ticker";

const meta = {
  title: "Effects/Text/NumberTicker",
  component: NumberTicker,
  tags: ["autodocs"],
  parameters: { layout: "centered" },
} satisfies Meta<typeof NumberTicker>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { value: 1000, className: "text-6xl font-semibold" },
};

export const CountingDown: Story = {
  args: { value: 0, startValue: 100, direction: "down", className: "text-6xl font-semibold" },
};
