import type { Meta, StoryObj } from "@storybook/react-vite";
import { placeholderImage } from "../stories/placeholder";

import { Backlight } from "./backlight";

const meta = {
  title: "Effects/Backgrounds/Backlight",
  component: Backlight,
  tags: ["autodocs"],
  parameters: { layout: "centered" },
} satisfies Meta<typeof Backlight>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    blur: 30,
    children: (
      <img src={placeholderImage(320, 200, "Backlight")} alt="Backlight" className="rounded-xl" />
    ),
  },
};
