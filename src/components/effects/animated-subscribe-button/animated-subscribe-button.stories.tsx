import type { Meta, StoryObj } from "@storybook/react-vite";

import { AnimatedSubscribeButton } from "./animated-subscribe-button";

const meta = {
  title: "Effects/Buttons/AnimatedSubscribeButton",
  component: AnimatedSubscribeButton,
  tags: ["autodocs"],
  parameters: { layout: "centered" },
} satisfies Meta<typeof AnimatedSubscribeButton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  args: { children: [<span key="idle">Subscribe</span>, <span key="done">Subscribed</span>] },
};
