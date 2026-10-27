import type { Meta, StoryObj } from "@storybook/react-vite";
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

export const Default: Story = {
  args: {
    videoSrc: "https://www.youtube.com/embed/qh3NGpYRG3I",
    thumbnailSrc: placeholderImage(1280, 720, "Hero video"),
    thumbnailAlt: "Hero video",
    className: "w-[32rem]",
  },
};
