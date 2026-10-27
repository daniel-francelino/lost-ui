import type { Meta, StoryObj } from "@storybook/react-vite";

import { WordRotate } from "./word-rotate";

const meta = {
  title: "Effects/Text/WordRotate",
  component: WordRotate,
  tags: ["autodocs"],
  parameters: { layout: "centered" },
} satisfies Meta<typeof WordRotate>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { words: ["Design", "Develop", "Deploy"], className: "text-4xl font-bold" },
};
