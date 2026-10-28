import type { Meta, StoryObj } from "@storybook/react-vite";
import { fn } from "storybook/test";

import { rules } from "../rules";
import { FormSelect } from "./form-select";

const countries = [
  { value: "br", label: "Brazil" },
  { value: "pt", label: "Portugal" },
  { value: "us", label: "United States", disabled: true },
];

const meta = {
  title: "Forms/FormSelect",
  component: FormSelect,
  tags: ["autodocs"],
  parameters: { layout: "padded" },
  args: { className: "w-72", items: countries, onValueChange: fn() },
} satisfies Meta<typeof FormSelect>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = { args: { label: "Country", placeholder: "Select a country" } };

export const Preselected: Story = { args: { label: "Country", defaultValue: "pt" } };

export const StringItems: Story = { args: { label: "Size", items: ["Small", "Medium", "Large"] } };

export const Required: Story = {
  args: {
    label: "Country",
    placeholder: "Select a country",
    required: true,
    rules: [rules.required("Choose a country")],
  },
};

export const Disabled: Story = { args: { label: "Country", disabled: true, defaultValue: "br" } };
