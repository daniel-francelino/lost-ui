import type { Meta, StoryObj } from "@storybook/react-vite";
import { MegaphoneIcon, StoreIcon } from "lucide-react";
import { fn } from "storybook/test";

import { bottomItems, moreItems, navSections, profileItems } from "../../app/app-nav/nav.fixtures";
import { PageHeader } from "../../app/page-header";
import { BackofficeLayout } from "./backoffice-layout";

const meta = {
  title: "Templates/BackofficeLayout",
  component: BackofficeLayout,
  tags: ["autodocs"],
  parameters: { layout: "fullscreen" },
  args: {
    sections: navSections,
    pathname: "/admin/products",
    logo: <strong className="px-2">Acme</strong>,
    user: { name: "Ada Lovelace", email: "ada@acme.com", description: "Owner" },
    userItems: profileItems,
    onSignOut: fn(),
    breadcrumbs: [{ label: "Catalogue", to: "/admin" }, { label: "Products" }],
    unreadCount: 3,
    notificationsHref: "/admin/notifications",
    spaces: [
      { id: "shop", title: "Shop", icon: <StoreIcon />, to: "/admin" },
      { id: "marketing", title: "Marketing", icon: <MegaphoneIcon />, to: "/marketing" },
    ],
    currentSpace: "shop",
    bottomItems,
    moreItems,
    children: <PageHeader title="Products" description="Everything in the catalogue." />,
  },
} satisfies Meta<typeof BackofficeLayout>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const OnlyAllowedItems: Story = {
  args: { allow: (item) => item.title !== "Customers" },
};

export const WithoutExtras: Story = {
  args: {
    spaces: undefined,
    unreadCount: undefined,
    bottomItems: undefined,
    user: undefined,
    breadcrumbs: undefined,
  },
};

export const FullScreen: Story = { args: { fullScreen: true } };
