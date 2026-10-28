import type { Meta, StoryObj } from "@storybook/react-vite";
import { fn } from "storybook/test";

import { rules } from "../rules";
import { FormCountrySelect } from "./form-country-select";

const meta = {
  title: "Forms/FormCountrySelect",
  component: FormCountrySelect,
  tags: ["autodocs"],
  parameters: { layout: "padded" },
  args: { className: "w-72", locale: "en", onValueChange: fn() },
} satisfies Meta<typeof FormCountrySelect>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = { args: { label: "Country" } };

export const Preselected: Story = { args: { label: "Country", defaultValue: "PT" } };

export const Portuguese: Story = { args: { label: "País", locale: "pt-BR", defaultValue: "BR" } };

export const CustomList: Story = {
  args: {
    label: "Country",
    countries: [
      { code: "PT", dial: "+351", name: "Portugal", flag: "🇵🇹" },
      { code: "BR", dial: "+55", name: "Brazil", flag: "🇧🇷" },
    ],
  },
};

export const Required: Story = {
  args: { label: "Country", required: true, rules: [rules.required("Choose a country")] },
};

export const Disabled: Story = { args: { label: "Country", disabled: true, defaultValue: "PT" } };
