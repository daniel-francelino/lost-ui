import type { Meta, StoryObj } from "@storybook/react-vite";
import PixelImageDemoExample from "./examples/pixel-image-demo";
import pixelImageDemoExampleSource from "./examples/pixel-image-demo.tsx?raw";
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

export const Playground: Story = {
  args: { src: placeholderImage(400, 300, "Pixel"), grayscaleAnimation: true },
};

export const Default: StoryObj = {
  render: () => <PixelImageDemoExample />,
  parameters: {
    layout: "padded",
    docs: { source: { code: pixelImageDemoExampleSource, language: "tsx" } },
  },
};
