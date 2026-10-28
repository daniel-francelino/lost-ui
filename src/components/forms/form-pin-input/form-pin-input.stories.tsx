import type { Meta, StoryObj } from "@storybook/react-vite";
import { fn } from "storybook/test";

import { rules } from "../rules";
import { FormPinInput } from "./form-pin-input";

const meta = {
  title: "Forms/FormPinInput",
  component: FormPinInput,
  tags: ["autodocs"],
  parameters: { layout: "padded" },
  args: { onValueChange: fn(), onComplete: fn() },
} satisfies Meta<typeof FormPinInput>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  args: { label: "Verification code", description: "Sent by email." },
};

export const FourDigits: Story = { args: { label: "PIN", length: 4 } };

export const Grouped: Story = { args: { label: "Code", length: 6, groupSize: 3 } };

export const AlphaNumeric: Story = { args: { label: "Invite code", length: 5, type: "text" } };

export const Complete: Story = {
  args: {
    label: "Verification code",
    length: 4,
    rules: [rules.minLength(4, "Enter all 4 digits")],
  },
};

export const Disabled: Story = { args: { label: "Code", disabled: true, defaultValue: "123" } };
