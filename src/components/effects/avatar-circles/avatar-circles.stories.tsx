import type { Meta, StoryObj } from "@storybook/react-vite";
import AvatarCirclesDemoExample from "./examples/avatar-circles-demo";
import avatarCirclesDemoExampleSource from "./examples/avatar-circles-demo.tsx?raw";
import { placeholderImage } from "../../../stories/placeholder";

import { AvatarCircles } from "./avatar-circles";

const meta = {
  title: "Effects/Media/AvatarCircles",
  component: AvatarCircles,
  tags: ["autodocs"],
  parameters: { layout: "centered" },
} satisfies Meta<typeof AvatarCircles>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  args: {
    numPeople: 99,
    avatarUrls: [1, 2, 3, 4].map((id) => ({
      imageUrl: placeholderImage(80, 80, String(id)),
      profileUrl: "#",
    })),
  },
};

export const Default: StoryObj = {
  render: () => <AvatarCirclesDemoExample />,
  parameters: {
    layout: "padded",
    docs: { source: { code: avatarCirclesDemoExampleSource, language: "tsx" } },
  },
};
