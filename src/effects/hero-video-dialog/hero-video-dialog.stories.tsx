import type { Meta, StoryObj } from "@storybook/react-vite";
import HeroVideoDialogDemoExample from "./examples/hero-video-dialog-demo";
import heroVideoDialogDemoExampleSource from "./examples/hero-video-dialog-demo.tsx?raw";
import HeroVideoDialogDemoTopInBottomOutExample from "./examples/hero-video-dialog-demo-top-in-bottom-out";
import heroVideoDialogDemoTopInBottomOutExampleSource from "./examples/hero-video-dialog-demo-top-in-bottom-out.tsx?raw";
import { placeholderImage } from "../../stories/placeholder";

import { HeroVideoDialog } from "./hero-video-dialog";

const meta = {
  title: "Effects/Cards/HeroVideoDialog",
  component: HeroVideoDialog,
  tags: ["autodocs"],
  parameters: { layout: "centered" },
} satisfies Meta<typeof HeroVideoDialog>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  args: {
    videoSrc: "https://www.youtube.com/embed/qh3NGpYRG3I",
    thumbnailSrc: placeholderImage(1280, 720, "Hero video"),
    thumbnailAlt: "Hero video",
    className: "w-[32rem]",
  },
};

export const Default: StoryObj = {
  render: () => <HeroVideoDialogDemoExample />,
  parameters: {
    layout: "padded",
    docs: { source: { code: heroVideoDialogDemoExampleSource, language: "tsx" } },
  },
};

export const TopInBottomOut: StoryObj = {
  render: () => <HeroVideoDialogDemoTopInBottomOutExample />,
  parameters: {
    layout: "padded",
    docs: { source: { code: heroVideoDialogDemoTopInBottomOutExampleSource, language: "tsx" } },
  },
};
