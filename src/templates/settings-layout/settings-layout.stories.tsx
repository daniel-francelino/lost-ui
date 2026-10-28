import type { Meta, StoryObj } from "@storybook/react-vite";
import { BellIcon, CreditCardIcon, ShieldIcon, UserIcon } from "lucide-react";

import { SettingsSection } from "../../components/app/settings-section";
import { SettingsLayout } from "./settings-layout";

const meta = {
  title: "Templates/SettingsLayout",
  component: SettingsLayout,
  tags: ["autodocs"],
  parameters: { layout: "padded" },
  args: {
    pathname: "/settings",
    items: [
      { title: "General", icon: <UserIcon />, to: "/settings", exact: true },
      { title: "Billing", icon: <CreditCardIcon />, to: "/settings/billing" },
      { title: "Notifications", icon: <BellIcon />, to: "/settings/notifications" },
      { title: "Security", icon: <ShieldIcon />, to: "/settings/security", hidden: true },
    ],
    children: <SettingsSection title="Name">The page.</SettingsSection>,
  },
} satisfies Meta<typeof SettingsLayout>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const SideNavigation: Story = {
  args: { navigation: "side", pathname: "/settings/billing" },
};

export const CustomTitle: Story = {
  args: { title: "Organisation", description: "Settings of the whole team." },
};
