import type { Meta, StoryObj } from "@storybook/react-vite";

import { ChatShimmer } from "./chat-shimmer";

const meta = {
  title: "AI chat/ChatShimmer",
  component: ChatShimmer,
  tags: ["autodocs"],
  parameters: { layout: "centered" },
  args: { text: "Thinking…" },
} satisfies Meta<typeof ChatShimmer>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const SlowAndWide: Story = { args: { text: "Searching the web", duration: 4, spread: 4 } };

export const Large: Story = { args: { className: "text-2xl font-semibold" } };
