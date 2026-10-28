import type { Meta, StoryObj } from "@storybook/react-vite";
import { fn } from "storybook/test";

import { ChatAttachment } from "./chat-attachment";

const picture =
  "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='64' height='64'><rect width='64' height='64' fill='%238b5cf6'/></svg>";

const meta = {
  title: "AI chat/ChatAttachment",
  component: ChatAttachment,
  tags: ["autodocs"],
  parameters: { layout: "centered" },
  args: { name: "brief.pdf", mediaType: "application/pdf" },
} satisfies Meta<typeof ChatAttachment>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const Removable: Story = { args: { onRemove: fn() } };

export const Thumbnail: Story = {
  args: { variant: "thumbnail", name: "mockup.png", mediaType: "image/png", url: picture },
};

export const ThumbnailOfAFile: Story = { args: { variant: "thumbnail", onRemove: fn() } };

export const LongName: Story = {
  args: { name: "campaign-launch-brief-final-final-v7.pdf", onRemove: fn() },
};
