import type { Meta, StoryObj } from "@storybook/react-vite";
import { fn } from "storybook/test";

import { NotificationButton } from "./notification-button";

const meta = {
  title: "App/NotificationButton",
  component: NotificationButton,
  tags: ["autodocs"],
  args: { count: 3, onClick: fn() },
} satisfies Meta<typeof NotificationButton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const NoUnread: Story = { args: { count: 0 } };

export const OverTheLimit: Story = { args: { count: 120 } };

export const AsLink: Story = { args: { to: "/notifications" } };
