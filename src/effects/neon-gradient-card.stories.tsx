import type { Meta, StoryObj } from "@storybook/react-vite";

import { NeonGradientCard } from "./neon-gradient-card";

const meta = {
  title: "Effects/Cards/NeonGradientCard",
  component: NeonGradientCard,
  tags: ["autodocs"],
  parameters: { layout: "centered" },
} satisfies Meta<typeof NeonGradientCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { children: <p className="text-2xl font-bold">Neon card</p>, className: "w-72" },
};
