import type { Meta, StoryObj } from "@storybook/react-vite";

import { WarpBackground } from "./warp-background";

const meta = {
  title: "Effects/Backgrounds/WarpBackground",
  component: WarpBackground,
  tags: ["autodocs"],
  parameters: { layout: "centered" },
} satisfies Meta<typeof WarpBackground>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { children: <p className="w-56 text-center text-sm">Warp background</p> },
};
