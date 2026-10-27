import type { Meta, StoryObj } from "@storybook/react-vite";

import { GlareHover } from "./glare-hover";

const meta = {
  title: "Effects/Cards/GlareHover",
  component: GlareHover,
  tags: ["autodocs"],
  parameters: { layout: "centered" },
} satisfies Meta<typeof GlareHover>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    width: "18rem",
    height: "12rem",
    color: "#ffffff",
    background: "var(--card)",
    children: <p className="text-sm">Hover for a glare</p>,
  },
};
