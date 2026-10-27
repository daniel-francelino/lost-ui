import type { Meta, StoryObj } from "@storybook/react-vite";
import BacklightImageDemoExample from "./examples/backlight-image-demo";
import backlightImageDemoExampleSource from "./examples/backlight-image-demo.tsx?raw";
import BacklightSvgDemoExample from "./examples/backlight-svg-demo";
import backlightSvgDemoExampleSource from "./examples/backlight-svg-demo.tsx?raw";
import BacklightVideoDemoExample from "./examples/backlight-video-demo";
import backlightVideoDemoExampleSource from "./examples/backlight-video-demo.tsx?raw";
import { placeholderImage } from "../../stories/placeholder";

import { Backlight } from "./backlight";

const meta = {
  title: "Effects/Backgrounds/Backlight",
  component: Backlight,
  tags: ["autodocs"],
  parameters: { layout: "centered" },
} satisfies Meta<typeof Backlight>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  args: {
    blur: 30,
    children: (
      <img src={placeholderImage(320, 200, "Backlight")} alt="Backlight" className="rounded-xl" />
    ),
  },
};

export const Image: StoryObj = {
  render: () => <BacklightImageDemoExample />,
  parameters: {
    layout: "padded",
    docs: { source: { code: backlightImageDemoExampleSource, language: "tsx" } },
  },
};

export const Svg: StoryObj = {
  render: () => <BacklightSvgDemoExample />,
  parameters: {
    layout: "padded",
    docs: { source: { code: backlightSvgDemoExampleSource, language: "tsx" } },
  },
};

export const Video: StoryObj = {
  render: () => <BacklightVideoDemoExample />,
  parameters: {
    layout: "padded",
    docs: { source: { code: backlightVideoDemoExampleSource, language: "tsx" } },
  },
};
