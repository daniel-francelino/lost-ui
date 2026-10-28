import type { Meta, StoryObj } from "@storybook/react-vite";
import { fn } from "storybook/test";

import { NotificationItem } from "./notification-item";

const meta = {
  title: "App/NotificationItem",
  component: NotificationItem,
  tags: ["autodocs"],
  args: {
    notification: {
      id: "1",
      title: "New access request",
      body: "Ada Lovelace asked for access.",
      createdAt: new Date(2026, 5, 15, 9, 30),
      readAt: null,
    },
    onOpen: fn(),
    onRead: fn(),
    onSnooze: fn(),
  },
  decorators: [
    (Story) => (
      <ul className="max-w-xl">
        <Story />
      </ul>
    ),
  ],
} satisfies Meta<typeof NotificationItem>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const Read: Story = {
  args: {
    notification: {
      id: "2",
      title: "Order shipped",
      createdAt: new Date(2026, 5, 14, 17, 0),
      readAt: new Date(2026, 5, 14, 18, 0),
    },
  },
};

export const Urgent: Story = {
  args: {
    notification: {
      id: "3",
      title: "Stock is out",
      body: "Mug 350 ml has no units left.",
      createdAt: new Date(2026, 5, 15, 8, 0),
      severity: "urgent",
    },
  },
};

export const Warning: Story = {
  args: {
    notification: {
      id: "4",
      title: "Fair starts soon",
      createdAt: new Date(2026, 5, 15),
      severity: "warning",
    },
  },
};

export const NoActions: Story = {
  args: { onOpen: undefined, onRead: undefined, onSnooze: undefined },
};
