import type { Meta, StoryObj } from "@storybook/react-vite";
import { fn } from "storybook/test";

import { ResetPasswordPage } from "./reset-password-page";

const meta = {
  title: "Templates/ResetPasswordPage",
  component: ResetPasswordPage,
  tags: ["autodocs"],
  parameters: { layout: "fullscreen" },
  args: { onSubmit: fn(), logo: <strong className="text-xl">Acme</strong> },
} satisfies Meta<typeof ResetPasswordPage>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const ServerError: Story = { args: { onSubmit: fn(() => "The link has expired.") } };
