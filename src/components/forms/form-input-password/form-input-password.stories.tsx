import type { Meta, StoryObj } from "@storybook/react-vite";

import { rules } from "../rules";
import { FormInputPassword } from "./form-input-password";

const meta = {
  title: "Forms/FormInputPassword",
  component: FormInputPassword,
  tags: ["autodocs"],
  args: { label: "Password", name: "password" },
} satisfies Meta<typeof FormInputPassword>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const WithRules: Story = {
  args: { rules: [rules.required(), rules.minLength(10)], hint: "At least 10 characters." },
};

export const NewPassword: Story = { args: { label: "New password", autoComplete: "new-password" } };
