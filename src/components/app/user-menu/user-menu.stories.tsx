import type { Meta, StoryObj } from "@storybook/react-vite";
import { fn } from "storybook/test";

import { profileItems } from "../app-nav/nav.fixtures";
import { Sidebar, SidebarFooter, SidebarProvider } from "../sidebar";
import { UserMenu } from "./user-menu";

const meta = {
  title: "App/UserMenu",
  component: UserMenu,
  tags: ["autodocs"],
  parameters: { layout: "fullscreen" },
  args: {
    name: "Ada Lovelace",
    email: "ada@acme.com",
    description: "Owner",
    items: profileItems,
    onSignOut: fn(),
  },
  decorators: [
    (Story) => (
      <SidebarProvider className="min-h-48">
        <Sidebar collapsible="none">
          <SidebarFooter className="mt-auto">
            <Story />
          </SidebarFooter>
        </Sidebar>
      </SidebarProvider>
    ),
  ],
} satisfies Meta<typeof UserMenu>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const WithoutSignOut: Story = { args: { onSignOut: undefined } };

export const CustomSignOutLabel: Story = { args: { signOutLabel: "Leave" } };
