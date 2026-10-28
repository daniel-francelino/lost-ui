import type { Meta, StoryObj } from "@storybook/react-vite";
import { placeholderImage } from "../../../stories/placeholder";

import { Avatar, AvatarImage, AvatarFallback } from "./avatar";

const meta = {
  title: "UI/Avatar",
  component: Avatar,
  tags: ["autodocs"],
  parameters: { layout: "centered" },
} satisfies Meta<typeof Avatar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {},
  render: (args) => (
    <Avatar {...args}>
      <AvatarImage src={placeholderImage(80, 80, "LU")} alt="Lost UI" />
      <AvatarFallback>LU</AvatarFallback>
    </Avatar>
  ),
};
