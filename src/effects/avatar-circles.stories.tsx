import type { Meta, StoryObj } from "@storybook/react-vite";
import { placeholderImage } from "../stories/placeholder";

import { AvatarCircles } from "./avatar-circles";

const meta = {
  title: "Effects/Media/AvatarCircles",
  component: AvatarCircles,
  tags: ["autodocs"],
  parameters: { layout: "centered" },
} satisfies Meta<typeof AvatarCircles>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    numPeople: 99,
    avatarUrls: [1, 2, 3, 4].map((id) => ({
      imageUrl: placeholderImage(80, 80, String(id)),
      profileUrl: "#",
    })),
  },
};
