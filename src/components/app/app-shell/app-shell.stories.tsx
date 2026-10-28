import type { Meta, StoryObj } from "@storybook/react-vite";
import { HouseIcon, MegaphoneIcon, StoreIcon } from "lucide-react";

import { bottomItems, moreItems, navSections, profileItems } from "../app-nav/nav.fixtures";
import { AppSidebar } from "../app-sidebar";
import { AppTopbar } from "../app-topbar";
import { BottomNav } from "../bottom-nav";
import { NotificationButton } from "../notification-button";
import { SpaceSwitcher } from "../space-switcher";
import { UserMenu } from "../user-menu";
import { AppShell } from "./app-shell";

const visible = navSections.map((section) => ({
  ...section,
  items: section.items.filter((item) => !item.hidden),
}));

const meta = {
  title: "App/AppShell",
  component: AppShell,
  tags: ["autodocs"],
  parameters: { layout: "fullscreen" },
  args: {
    sidebar: (
      <AppSidebar
        sections={visible}
        pathname="/admin/products"
        header={<strong className="px-2">Acme</strong>}
        footer={
          <UserMenu
            name="Ada Lovelace"
            email="ada@acme.com"
            description="Owner"
            items={profileItems}
            onSignOut={() => {}}
          />
        }
      />
    ),
    topbar: (
      <AppTopbar
        breadcrumbs={[{ label: "Catalogue", to: "/admin" }, { label: "Products" }]}
        actions={
          <>
            <SpaceSwitcher
              current="shop"
              spaces={[
                { id: "shop", title: "Shop", icon: <StoreIcon />, to: "/admin" },
                { id: "marketing", title: "Marketing", icon: <MegaphoneIcon />, to: "/marketing" },
              ]}
            />
            <NotificationButton count={4} to="/admin/notifications" />
          </>
        }
      />
    ),
    bottomNav: (
      <BottomNav
        items={[...bottomItems, { title: "Home 2", icon: <HouseIcon />, to: "/home" }]}
        moreItems={moreItems}
        pathname="/admin/products"
      />
    ),
    children: <p>The page</p>,
  },
} satisfies Meta<typeof AppShell>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const FullWidth: Story = { args: { fullWidth: true } };

export const FullScreen: Story = { args: { fullScreen: true } };

export const ClosedSidebar: Story = { args: { defaultSidebarOpen: false } };
