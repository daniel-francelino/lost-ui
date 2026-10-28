import type { Meta, StoryObj } from "@storybook/react-vite";
import { fn } from "storybook/test";

import { RegisterPage } from "./register-page";

const meta = {
  title: "Templates/RegisterPage",
  component: RegisterPage,
  tags: ["autodocs"],
  parameters: { layout: "fullscreen" },
  args: {
    onSubmit: fn(),
    logo: <strong className="text-xl">Acme</strong>,
    description: "Create your account. The team reviews the request.",
    loginHref: "/login",
  },
} satisfies Meta<typeof RegisterPage>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const EmailOnly: Story = { args: { fields: ["email"] } };

export const ServerError: Story = { args: { onSubmit: fn(() => "That username is taken.") } };

export const ShorterPassword: Story = { args: { minPasswordLength: 8 } };
