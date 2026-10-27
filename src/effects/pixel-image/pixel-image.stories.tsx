import type { Meta, StoryObj } from "@storybook/react-vite";
import { placeholderImage } from "../../stories/placeholder";

import { PixelImage } from "./pixel-image";

const meta = {
  title: "Effects/Media/PixelImage",
  component: PixelImage,
  tags: ["autodocs"],
  parameters: { layout: "centered" },
} satisfies Meta<typeof PixelImage>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { src: placeholderImage(400, 300, "Pixel"), grayscaleAnimation: true },
};
