import type { Meta, StoryObj } from "@storybook/react-vite";
import { GithubIcon } from "lucide-react";
import { fn } from "storybook/test";

import { Button } from "../../ui/button";
import { Link } from "../../elements/link";
import { Header } from "./header";

const links = (
  <nav aria-label="Main" className="flex items-center gap-4">
    <Link href="/docs">Docs</Link>
    <Link href="/components">Components</Link>
    <Link href="/blog">Blog</Link>
  </nav>
);

const meta = {
  title: "App/Header",
  component: Header,
  tags: ["autodocs"],
  parameters: { layout: "fullscreen" },
  args: {
    title: "lost-ui",
    children: links,
    right: (
      <Button variant="ghost" size="icon" aria-label="GitHub">
        <GithubIcon />
      </Button>
    ),
    body: (
      <nav aria-label="Mobile" className="grid gap-3">
        <Link href="/docs">Docs</Link>
        <Link href="/components">Components</Link>
        <Link href="/blog">Blog</Link>
      </nav>
    ),
    onOpenChange: fn(),
  },
} satisfies Meta<typeof Header>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const Slideover: Story = { args: { mode: "slideover" } };

export const ToggleOnTheLeft: Story = { args: { toggleSide: "left", mode: "slideover" } };

export const WithLogo: Story = { args: { logo: <strong>◆ lost-ui</strong> } };

export const CustomLeft: Story = { args: { left: <span>Custom start</span> } };

export const WithoutMenu: Story = { args: { body: undefined } };

export const HiddenToggle: Story = { args: { toggle: false } };

export const CustomMenu: Story = {
  args: { body: undefined, content: <div className="p-6 text-sm">Your own menu.</div> },
};
