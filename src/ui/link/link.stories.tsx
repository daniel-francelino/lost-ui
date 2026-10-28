import type { Meta, StoryObj } from "@storybook/react-vite";
import { fn } from "storybook/test";

import { Link } from "./link";

const meta = {
  title: "UI/Link",
  component: Link,
  tags: ["autodocs"],
  parameters: { layout: "centered" },
  args: { href: "/docs/components/link", children: "Link", currentPath: "/other" },
} satisfies Meta<typeof Link>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const Active: Story = { args: { currentPath: "/docs/components/link" } };

export const ActiveParent: Story = {
  args: { href: "/docs", currentPath: "/docs/components/link" },
};

export const Exact: Story = {
  args: { href: "/docs", currentPath: "/docs/components/link", exact: true },
};

export const ForcedActive: Story = { args: { active: true } };

export const External: Story = {
  args: { href: "https://example.com", target: "_blank", children: "Example" },
};

export const AsButton: Story = { args: { href: undefined, onClick: fn(), children: "Do it" } };

export const Disabled: Story = { args: { disabled: true } };

export const Raw: Story = {
  args: {
    raw: true,
    className: "text-muted-foreground",
    activeClassName: "font-bold text-foreground",
    currentPath: "/docs/components/link",
  },
};

export const AsChild: Story = {
  args: {
    asChild: true,
    children: <a href="/docs/components/link">Router link</a>,
    currentPath: "/docs/components/link",
  },
};
