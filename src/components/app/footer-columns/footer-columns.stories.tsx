import type { Meta, StoryObj } from "@storybook/react-vite";
import { GithubIcon } from "lucide-react";

import { Button } from "../../ui/button";
import { Input } from "../../ui/input";
import { FooterColumns, type FooterColumn } from "./footer-columns";

const columns: FooterColumn[] = [
  {
    label: "Resources",
    children: [
      { label: "Documentation", href: "/docs" },
      { label: "Examples", href: "/examples" },
      { label: "Releases", href: "/releases" },
    ],
  },
  {
    label: "Company",
    children: [
      { label: "About", href: "/about" },
      { label: "Blog", href: "/blog" },
      { label: "Contact", href: "mailto:hello@example.com" },
    ],
  },
  {
    label: "Community",
    children: [
      { label: "GitHub", href: "https://github.com", target: "_blank", icon: <GithubIcon /> },
      { label: "Discord", href: "https://discord.com", target: "_blank" },
      { label: "Archived", href: "/archive", disabled: true },
    ],
  },
];

const meta = {
  title: "App/FooterColumns",
  component: FooterColumns,
  tags: ["autodocs"],
  parameters: { layout: "padded" },
  args: { columns, "aria-label": "Footer" },
} satisfies Meta<typeof FooterColumns>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const WithLeftAndRight: Story = {
  args: {
    left: <strong className="text-lg">lost-ui</strong>,
    right: (
      <form className="grid w-64 gap-2">
        <label className="text-sm font-semibold" htmlFor="newsletter">
          Subscribe to our newsletter
        </label>
        <Input id="newsletter" type="email" placeholder="you@example.com" />
        <Button type="submit">Subscribe</Button>
      </form>
    ),
  },
};

export const HeadingLevel: Story = { args: { headingLevel: 2 } };

export const CustomSlots: Story = {
  args: {
    renderColumnLabel: (column) => <span className="uppercase">{column.label}</span>,
    renderLink: (link) => <span>{link.label}</span>,
  },
};
