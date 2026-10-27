import type { Meta, StoryObj } from "@storybook/react-vite";
import { placeholderImage } from "../../stories/placeholder";

import { AspectRatio } from "./aspect-ratio";

const meta = {
  title: "UI/AspectRatio",
  component: AspectRatio,
  tags: ["autodocs"],
  parameters: { layout: "centered" },
} satisfies Meta<typeof AspectRatio>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { ratio: 16 / 9 },
  render: (args) => (
    <div className="w-80">
      <AspectRatio {...args}>
        <img
          src={placeholderImage(640, 360, "16:9")}
          alt="Sample"
          className="size-full rounded-md object-cover"
        />
      </AspectRatio>
    </div>
  ),
};
