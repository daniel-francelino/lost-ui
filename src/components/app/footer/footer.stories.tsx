import type { Meta, StoryObj } from "@storybook/react-vite";
import { GithubIcon, TwitterIcon } from "lucide-react";

import { Button } from "../../ui/button";
import { FooterColumns } from "../footer-columns";
import { Link } from "../../elements/link";
import { Footer } from "./footer";

const meta = {
  title: "App/Footer",
  component: Footer,
  tags: ["autodocs"],
  parameters: { layout: "fullscreen" },
  args: {
    left: <p className="text-sm text-muted-foreground">© 2026 lost-ui</p>,
    children: (
      <>
        <Link href="/docs">Docs</Link>
        <Link href="/blog">Blog</Link>
      </>
    ),
    right: (
      <>
        <Button variant="ghost" size="icon" aria-label="GitHub">
          <GithubIcon />
        </Button>
        <Button variant="ghost" size="icon" aria-label="Twitter">
          <TwitterIcon />
        </Button>
      </>
    ),
  },
} satisfies Meta<typeof Footer>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const WithTopAndBottom: Story = {
  args: {
    top: (
      <FooterColumns
        aria-label="Sitemap"
        columns={[
          { label: "Product", children: [{ label: "Features", href: "/features" }] },
          { label: "Company", children: [{ label: "About", href: "/about" }] },
        ]}
      />
    ),
    bottom: <p className="text-xs text-muted-foreground">Made with care.</p>,
  },
};

export const NotContained: Story = { args: { contained: false } };

export const OnlyLeft: Story = { args: { children: undefined, right: undefined } };
