import type { Meta, StoryObj } from "@storybook/react-vite";
import { fn } from "storybook/test";

import type { NotificationData } from "../notification-item";
import { NotificationsPage } from "./notifications-page";

const day = (offset: number, hours = 10) => {
  const date = new Date();
  date.setDate(date.getDate() + offset);
  date.setHours(hours, 0, 0, 0);
  return date;
};

const sample: NotificationData[] = [
  {
    id: "1",
    title: "New access request",
    body: "Ada Lovelace asked for access.",
    createdAt: day(0, 9),
    kind: "access",
  },
  {
    id: "2",
    title: "Stock is out",
    body: "Mug 350 ml has no units left.",
    createdAt: day(0, 8),
    severity: "urgent",
    kind: "stock",
    readAt: day(0, 8),
  },
  { id: "3", title: "Order shipped", createdAt: day(-1, 17), readAt: day(-1, 18), kind: "orders" },
  {
    id: "4",
    title: "Fair starts soon",
    createdAt: day(-9, 12),
    severity: "warning",
    kind: "fairs",
  },
];

const meta = {
  title: "Templates/NotificationsPage",
  component: NotificationsPage,
  tags: ["autodocs"],
  parameters: { layout: "padded" },
  args: {
    notifications: sample,
    unreadCount: 1,
    onReadAll: fn(),
    onOpen: fn(),
    onRead: fn(),
    onSnooze: fn(),
  },
} satisfies Meta<typeof NotificationsPage>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const WithKinds: Story = {
  args: {
    kinds: [
      { value: "access", label: "Access requests" },
      { value: "stock", label: "Stock" },
    ],
  },
};

export const Loading: Story = { args: { loading: true } };

export const ErrorState: Story = { args: { error: true, onRetry: fn() } };

export const Empty: Story = { args: { notifications: [], unreadCount: 0 } };

export const EmptyUnread: Story = { args: { notifications: [], defaultFilter: "unread" } };

export const HasMore: Story = { args: { hasMore: true, onLoadMore: fn() } };

export const LoadingMore: Story = { args: { hasMore: true, loadingMore: true, onLoadMore: fn() } };
