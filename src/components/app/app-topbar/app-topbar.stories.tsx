import type { Meta, StoryObj } from "@storybook/react-vite";

import { NotificationButton } from "../notification-button";
import { SidebarProvider } from "../sidebar";
import { AppTopbar } from "./app-topbar";

const meta = {
  title: "App/AppTopbar",
  component: AppTopbar,
  tags: ["autodocs"],
  parameters: { layout: "fullscreen" },
  args: {
    breadcrumbs: [
      { label: "Catalogue", to: "/admin" },
      { label: "Products", to: "/admin/products" },
      { label: "Mug" },
    ],
    actions: <NotificationButton count={2} />,
  },
  decorators: [
    (Story) => (
      <SidebarProvider className="min-h-0">
        <div className="w-full">
          <Story />
        </div>
      </SidebarProvider>
    ),
  ],
} satisfies Meta<typeof AppTopbar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const WithoutTrigger: Story = { args: { trigger: false } };

export const WithContent: Story = {
  args: { children: <span className="text-sm">Draft saved</span> },
};
