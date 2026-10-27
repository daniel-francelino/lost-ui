import type { Meta, StoryObj } from "@storybook/react-vite";
import { placeholderImage } from "../../stories/placeholder";

import { Safari } from "./safari";

const meta = {
  title: "Effects/Devices/Safari",
  component: Safari,
  tags: ["autodocs"],
  parameters: { layout: "centered" },
} satisfies Meta<typeof Safari>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { url: "lost-ui.dev", imageSrc: placeholderImage(1203, 753, "Safari") },
  render: (args) => (
    <div className="w-[34rem]">
      <Safari {...args} />
    </div>
  ),
};
