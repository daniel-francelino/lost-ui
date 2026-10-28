import type { Meta, StoryObj } from "@storybook/react-vite";
import { fn } from "storybook/test";

import { rules } from "../rules";
import { FormInputMoney } from "./form-input-money";

const meta = {
  title: "Forms/FormInputMoney",
  component: FormInputMoney,
  tags: ["autodocs"],
  parameters: { layout: "padded" },
  args: { className: "w-72", locale: "en-US", onValueChange: fn() },
} satisfies Meta<typeof FormInputMoney>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  args: { label: "Amount", placeholder: "0.00", help: "Typing fills the cents first." },
};

export const WithCurrency: Story = {
  args: { label: "Price", currency: "USD", defaultValue: 1234.5 },
};

export const OtherLocale: Story = {
  args: { label: "Preço", currency: "BRL", locale: "pt-BR", defaultValue: 1234.5 },
};

export const NoDecimals: Story = {
  args: { label: "Price", currency: "JPY", defaultValue: 1500 },
};

export const Bounded: Story = {
  args: { label: "Discount", currency: "USD", min: 5, max: 100, defaultValue: 50 },
};

export const Required: Story = {
  args: {
    label: "Amount",
    required: true,
    rules: [rules.required("Enter an amount"), (value) => (value ?? 0) > 0 || "Must be positive"],
  },
};

export const Disabled: Story = { args: { label: "Amount", disabled: true, defaultValue: 10 } };
