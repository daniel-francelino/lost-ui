import type { Meta, StoryObj } from "@storybook/react-vite";

import { navSections, profileItems } from "../app-nav/nav.fixtures";
import { AppShell } from "../app-shell";
import { UserMenu } from "../user-menu";
import { AppSidebar } from "./app-sidebar";

const meta = {
  title: "App/AppSidebar",
  component: AppSidebar,
  tags: ["autodocs"],
  parameters: { layout: "fullscreen" },
  args: {
    sections: navSections.map((section) => ({
      ...section,
      items: section.items.filter((item) => !item.hidden),
    })),
    pathname: "/admin/products",
    header: <strong className="px-2">Acme</strong>,
  },
  decorators: [
    (Story) => (
      <div className="h-[28rem] overflow-hidden">
        <AppShell sidebar={<Story />}>Page</AppShell>
      </div>
    ),
  ],
} satisfies Meta<typeof AppSidebar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const SubMenuOpen: Story = { args: { pathname: "/admin/settings/security" } };

export const WithUserMenu: Story = {
  args: {
    footer: (
      <UserMenu
        name="Ada Lovelace"
        email="ada@acme.com"
        description="Owner"
        items={profileItems}
        onSignOut={() => {}}
      />
    ),
  },
};

export const CustomLink: Story = {
  args: {
    renderLink: ({ item, href, children, ...rest }) => (
      <a href={href} data-router-link={item.title} {...rest}>
        {children}
      </a>
    ),
  },
};
