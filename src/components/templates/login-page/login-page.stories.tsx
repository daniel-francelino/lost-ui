import type { Meta, StoryObj } from "@storybook/react-vite";
import { fn } from "storybook/test";

import { LoginPage } from "./login-page";

const meta = {
  title: "Templates/LoginPage",
  component: LoginPage,
  tags: ["autodocs"],
  parameters: { layout: "fullscreen" },
  args: {
    onSubmit: fn(),
    logo: <strong className="text-xl">Acme</strong>,
    description: "Back office of Acme.",
    forgotPasswordHref: "/recover-password",
    registerHref: "/register",
  },
} satisfies Meta<typeof LoginPage>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const EmailOnly: Story = { args: { identifier: "email" } };

export const ServerError: Story = { args: { onSubmit: fn(() => "Wrong email or password.") } };

export const Split: Story = {
  args: { variant: "split", aside: <p className="text-lg">Welcome back.</p> },
};

export const WithOtherWays: Story = {
  args: { extra: <button type="button">Continue with Google</button> },
};
