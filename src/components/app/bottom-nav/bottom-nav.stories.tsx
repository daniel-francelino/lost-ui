import type { Meta, StoryObj } from "@storybook/react-vite";
import { InboxIcon, SendIcon } from "lucide-react";
import { useState } from "react";

import { bottomItems, moreItems } from "../app-nav/nav.fixtures";
import { BottomNav } from "./bottom-nav";

const meta = {
  title: "App/BottomNav",
  component: BottomNav,
  tags: ["autodocs"],
  parameters: { layout: "fullscreen" },
  args: { items: bottomItems, moreItems, pathname: "/admin" },
  decorators: [
    (Story) => (
      <div className="relative h-72 [&_[data-slot=bottom-nav]]:absolute [&_[data-slot=bottom-nav]]:lg:block">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof BottomNav>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const MoreIsActive: Story = { args: { pathname: "/admin/settings" } };

export const WithoutMore: Story = { args: { moreItems: [] } };

export const ContextTabs: Story = {
  render: (args) => {
    const [tab, setTab] = useState("inbox");
    return (
      <BottomNav
        {...args}
        contextItems={[
          {
            id: "inbox",
            title: "Inbox",
            icon: <InboxIcon />,
            active: tab === "inbox",
            onSelect: () => setTab("inbox"),
          },
          {
            id: "sent",
            title: "Sent",
            icon: <SendIcon />,
            active: tab === "sent",
            onSelect: () => setTab("sent"),
          },
        ]}
      />
    );
  },
};
