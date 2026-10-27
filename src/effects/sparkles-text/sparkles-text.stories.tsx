import type { Meta, StoryObj } from "@storybook/react-vite";

import { SparklesText } from "./sparkles-text";

const meta = {
  title: "Effects/Text/SparklesText",
  component: SparklesText,
  tags: ["autodocs"],
  parameters: { layout: "centered" },
} satisfies Meta<typeof SparklesText>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { children: "Sparkles", className: "text-5xl" },
};
