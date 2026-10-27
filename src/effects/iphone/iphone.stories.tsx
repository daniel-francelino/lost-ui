import type { Meta, StoryObj } from "@storybook/react-vite";
import { placeholderImage } from "../../stories/placeholder";

import { Iphone } from "./iphone";

const meta = {
  title: "Effects/Devices/Iphone",
  component: Iphone,
  tags: ["autodocs"],
  parameters: { layout: "centered" },
} satisfies Meta<typeof Iphone>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { src: placeholderImage(433, 882, "iPhone") },
  render: (args) => (
    <div className="w-56">
      <Iphone {...args} />
    </div>
  ),
};
