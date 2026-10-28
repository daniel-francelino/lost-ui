import type { Meta, StoryObj } from "@storybook/react-vite";
import { fn } from "storybook/test";

import { rules } from "../rules";
import { FormCheckbox } from "./form-checkbox";

const meta = {
  title: "Forms/FormCheckbox",
  component: FormCheckbox,
  tags: ["autodocs"],
  parameters: { layout: "padded" },
  args: { onValueChange: fn() },
} satisfies Meta<typeof FormCheckbox>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  args: { label: "Subscribe to the newsletter", description: "One email a week." },
};

export const Checked: Story = { args: { label: "Remember me", defaultValue: true } };

export const Indeterminate: Story = { args: { label: "Select all", indeterminate: true } };

export const MustAccept: Story = {
  args: {
    label: "I accept the terms",
    required: true,
    rules: [rules.required("You must accept the terms")],
  },
};

export const Disabled: Story = { args: { label: "Not available", disabled: true } };
