import type { Meta, StoryObj } from "@storybook/react-vite";

import { MagicCard } from "./magic-card";

const meta = {
  title: "Effects/Cards/MagicCard",
  component: MagicCard,
  tags: ["autodocs"],
  parameters: { layout: "centered" },
} satisfies Meta<typeof MagicCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    children: <p className="p-8">Magic card</p>,
    className: "h-48 w-72 items-center justify-center",
  },
};

export const Orb: Story = {
  args: {
    mode: "orb",
    children: <p className="p-8">Orb mode</p>,
    className: "h-48 w-72 items-center justify-center",
  },
};
