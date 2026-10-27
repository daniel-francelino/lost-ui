import type { Meta, StoryObj } from "@storybook/react-vite";

import { ClientTweetCard } from "./client-tweet-card";

const meta = {
  title: "Effects/Cards/ClientTweetCard",
  component: ClientTweetCard,
  tags: ["autodocs"],
  parameters: { layout: "centered" },
} satisfies Meta<typeof ClientTweetCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { id: "1628832338187636740", className: "w-96" },
};
