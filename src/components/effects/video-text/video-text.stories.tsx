import type { Meta, StoryObj } from "@storybook/react-vite";
import VideoTextDemoExample from "./examples/video-text-demo";
import videoTextDemoExampleSource from "./examples/video-text-demo.tsx?raw";
import { sampleVideo } from "../../../stories/placeholder";

import { VideoText } from "./video-text";

const meta = {
  title: "Effects/Text/VideoText",
  component: VideoText,
  tags: ["autodocs"],
  parameters: { layout: "centered" },
} satisfies Meta<typeof VideoText>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  args: { src: sampleVideo, children: "LOST", fontWeight: 900 },
  render: (args) => (
    <div className="relative h-48 w-[28rem]">
      <VideoText {...args} />
    </div>
  ),
};

export const Default: StoryObj = {
  render: () => <VideoTextDemoExample />,
  parameters: {
    layout: "padded",
    docs: { source: { code: videoTextDemoExampleSource, language: "tsx" } },
  },
};
