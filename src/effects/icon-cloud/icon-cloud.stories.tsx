import type { Meta, StoryObj } from "@storybook/react-vite";
import { placeholderImage } from "../../stories/placeholder";

import { IconCloud } from "./icon-cloud";

const meta = {
  title: "Effects/Media/IconCloud",
  component: IconCloud,
  tags: ["autodocs"],
  parameters: { layout: "centered" },
} satisfies Meta<typeof IconCloud>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { images: [1, 2, 3, 4, 5, 6].map((id) => placeholderImage(64, 64, String(id))) },
  render: (args) => (
    <div className="size-80">
      <IconCloud {...args} />
    </div>
  ),
};
