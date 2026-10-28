import type { Meta, StoryObj } from "@storybook/react-vite";
import { fn } from "storybook/test";

import { NotificationPreferences } from "./notification-preferences";

const meta = {
  title: "Templates/NotificationPreferences",
  component: NotificationPreferences,
  tags: ["autodocs"],
  args: {
    onChange: fn(),
    preferences: [
      {
        kind: "access",
        title: "Access requests",
        description: "When someone asks for access.",
        channels: { inApp: true, email: true },
      },
      { kind: "stock", title: "Low stock", channels: { inApp: true, email: false } },
      { kind: "fairs", title: "Fairs", channels: { inApp: false, email: false } },
    ],
  },
} satisfies Meta<typeof NotificationPreferences>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const Disabled: Story = { args: { disabled: true } };

export const WithoutEmail: Story = { args: { email: false } };

export const Empty: Story = { args: { preferences: [] } };
