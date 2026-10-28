import type { Meta, StoryObj } from "@storybook/react-vite";
import { fn } from "storybook/test";

import { authImage, authLegal, authProviders } from "../../lib/auth.fixtures";
import { RegisterPage } from "./register-page";

const meta = {
  title: "Templates/RegisterPage",
  component: RegisterPage,
  tags: ["autodocs"],
  parameters: { layout: "fullscreen" },
  args: {
    onSubmit: fn(),
    description: "Enter your email below to create your account",
    fields: ["email"],
    emailPlaceholder: "m@example.com",
    emailHelp: "We'll use this to contact you. We will not share your email with anyone else.",
    minPasswordLength: 8,
    loginHref: "/login",
    providers: authProviders,
    legal: authLegal,
    aside: authImage,
  },
} satisfies Meta<typeof RegisterPage>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const AllFields: Story = {
  args: { fields: ["name", "username", "email"], minPasswordLength: 10 },
};

export const WithoutImage: Story = { args: { aside: undefined } };

export const WithoutProviders: Story = { args: { providers: [] } };

export const ServerError: Story = { args: { onSubmit: fn(() => "That email is taken.") } };

export const SingleCard: Story = {
  args: { variant: "card", logo: <strong className="text-xl">Acme</strong>, aside: undefined },
};
