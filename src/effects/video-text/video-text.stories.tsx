import type { Meta, StoryObj } from "@storybook/react-vite";
import { sampleVideo } from "../../stories/placeholder";

import { VideoText } from "./video-text";

const meta = {
  title: "Effects/Text/VideoText",
  component: VideoText,
  tags: ["autodocs"],
  parameters: { layout: "centered" },
} satisfies Meta<typeof VideoText>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { src: sampleVideo, children: "LOST", fontWeight: 900 },
  render: (args) => (
    <div className="relative h-48 w-[28rem]">
      <VideoText {...args} />
    </div>
  ),
};
