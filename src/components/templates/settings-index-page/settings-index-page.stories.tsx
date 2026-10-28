import type { Meta, StoryObj } from "@storybook/react-vite";
import { BellRingIcon, ScrollTextIcon, ShieldCheckIcon, UsersIcon } from "lucide-react";

import { SettingsIndexPage } from "./settings-index-page";

const meta = {
  title: "Templates/SettingsIndexPage",
  component: SettingsIndexPage,
  tags: ["autodocs"],
  parameters: { layout: "padded" },
  args: {
    description: "Settings of the organisation and of the access.",
    entries: [
      {
        title: "People",
        description: "Invitations, profiles and suspended access.",
        icon: <UsersIcon />,
        to: "/settings/users",
      },
      {
        title: "Roles",
        description: "What each role can do.",
        icon: <ShieldCheckIcon />,
        to: "/settings/roles",
      },
      {
        title: "Default notices",
        description: "How each kind of notice starts for people.",
        icon: <BellRingIcon />,
        to: "/settings/notifications",
      },
      { title: "Audit", icon: <ScrollTextIcon />, to: "/settings/audit", hidden: true },
    ],
  },
} satisfies Meta<typeof SettingsIndexPage>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const Empty: Story = { args: { entries: [] } };
