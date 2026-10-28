import type { Meta, StoryObj } from "@storybook/react-vite";
import { fn } from "storybook/test";

import { authImage, authLegal, authProviders } from "../lib/auth.fixtures";
import { LoginPage } from "./login-page";

const meta = {
  title: "Templates/LoginPage",
  component: LoginPage,
  tags: ["autodocs"],
  parameters: { layout: "fullscreen" },
  args: {
    onSubmit: fn(),
    description: "Login to your Acme Inc account",
    identifier: "email",
    identifierPlaceholder: "m@example.com",
    forgotPasswordHref: "/recover-password",
    registerHref: "/register",
    providers: authProviders,
    legal: authLegal,
    aside: authImage,
  },
} satisfies Meta<typeof LoginPage>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const WithLogo: Story = { args: { logo: <strong className="text-xl">Acme</strong> } };

export const WithoutImage: Story = { args: { aside: undefined } };

export const WithoutProviders: Story = { args: { providers: [] } };

export const UsernameOrEmail: Story = {
  args: { identifier: "text", identifierPlaceholder: undefined },
};

export const ServerError: Story = { args: { onSubmit: fn(() => "Wrong email or password.") } };

export const SingleCard: Story = {
  args: { variant: "card", logo: <strong className="text-xl">Acme</strong>, aside: undefined },
};

export const HalfScreen: Story = {
  args: { variant: "split", aside: <p className="text-lg">Welcome back.</p> },
};
