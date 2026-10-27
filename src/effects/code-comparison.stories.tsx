import type { Meta, StoryObj } from "@storybook/react-vite";

import { CodeComparison } from "./code-comparison";

const meta = {
  title: "Effects/Media/CodeComparison",
  component: CodeComparison,
  tags: ["autodocs"],
  parameters: { layout: "padded" },
} satisfies Meta<typeof CodeComparison>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    beforeCode: "const total = items.reduce((sum, item) => sum + item.price, 0);",
    afterCode: "const total = sum(items, (item) => item.price);",
    language: "ts",
    filename: "total.ts",
    lightTheme: "github-light",
    darkTheme: "github-dark",
  },
};
