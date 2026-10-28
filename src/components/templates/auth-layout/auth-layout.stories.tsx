import type { Meta, StoryObj } from "@storybook/react-vite";

import { AuthLayout } from "./auth-layout";

const meta = {
  title: "Templates/AuthLayout",
  component: AuthLayout,
  tags: ["autodocs"],
  parameters: { layout: "fullscreen" },
  args: {
    title: "Sign in",
    description: "Use your email or your username.",
    logo: <strong className="text-xl">Acme</strong>,
    children: <p>The form goes here.</p>,
    footer: <a href="/register">Create an account</a>,
  },
} satisfies Meta<typeof AuthLayout>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const Split: Story = {
  args: {
    variant: "split",
    aside: <blockquote className="max-w-sm text-lg">“It does what it says.”</blockquote>,
  },
};

export const Minimal: Story = {
  args: { description: undefined, logo: undefined, footer: undefined, children: undefined },
};
