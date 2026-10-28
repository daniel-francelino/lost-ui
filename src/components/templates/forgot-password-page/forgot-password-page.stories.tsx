import type { Meta, StoryObj } from "@storybook/react-vite";
import { fn } from "storybook/test";

import { ForgotPasswordPage } from "./forgot-password-page";

const meta = {
  title: "Templates/ForgotPasswordPage",
  component: ForgotPasswordPage,
  tags: ["autodocs"],
  parameters: { layout: "fullscreen" },
  args: { onSubmit: fn(), logo: <strong className="text-xl">Acme</strong>, loginHref: "/login" },
} satisfies Meta<typeof ForgotPasswordPage>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const ServerError: Story = {
  args: { onSubmit: fn(() => "Too many tries. Wait a moment.") },
};
