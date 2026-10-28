import type { Meta, StoryObj } from "@storybook/react-vite";
import { fn } from "storybook/test";

import { NotificationPreferences } from "../../../components/app/notification-preferences";
import { SettingsSection } from "../../../components/app/settings-section";
import { ProfilePage } from "./profile-page";

const meta = {
  title: "Templates/ProfilePage",
  component: ProfilePage,
  tags: ["autodocs"],
  parameters: { layout: "padded" },
  args: {
    name: "Ada Lovelace",
    description: "@ada · ada@acme.com · Owner",
    onSaveName: fn(),
    onChangePassword: fn(),
  },
} satisfies Meta<typeof ProfilePage>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const WithoutPassword: Story = { args: { onChangePassword: undefined } };

export const ServerError: Story = { args: { onSaveName: fn(() => "That name is not allowed.") } };

export const WithNotifications: Story = {
  args: {
    children: (
      <SettingsSection title="Notifications">
        <NotificationPreferences
          onChange={() => {}}
          preferences={[
            { kind: "orders", title: "Orders", channels: { inApp: true, email: false } },
          ]}
        />
      </SettingsSection>
    ),
  },
};
