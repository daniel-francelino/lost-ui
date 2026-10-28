import type { Meta, StoryObj } from "@storybook/react-vite";
import { fn } from "storybook/test";

import { rules } from "../rules";
import { FormInputPhone } from "./form-input-phone";

const meta = {
  title: "Forms/FormInputPhone",
  component: FormInputPhone,
  tags: ["autodocs"],
  parameters: { layout: "padded" },
  args: { className: "w-96", locale: "en", onValueChange: fn(), onCountryChange: fn() },
} satisfies Meta<typeof FormInputPhone>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  args: { label: "Phone", defaultCountry: "PT", help: "Saved as +<code><number>." },
};

export const Preselected: Story = { args: { label: "Phone", defaultValue: "+5511987654321" } };

export const CustomCountries: Story = {
  args: {
    label: "Phone",
    countries: [
      { code: "PT", dial: "+351", name: "Portugal", flag: "🇵🇹" },
      { code: "BR", dial: "+55", name: "Brazil", flag: "🇧🇷" },
    ],
  },
};

export const Required: Story = {
  args: {
    label: "Phone",
    defaultCountry: "PT",
    required: true,
    rules: [
      rules.required("Enter a phone number"),
      (value) => value.length >= 11 || "Number is too short",
    ],
  },
};

export const Disabled: Story = {
  args: { label: "Phone", disabled: true, defaultValue: "+351912345678" },
};
