import type { Meta, StoryObj } from "@storybook/react-vite";
import { fn } from "storybook/test";

import { rules } from "../rules";
import { FormInputMenu } from "./form-input-menu";

const cities = [
  { value: "lisbon", label: "Lisbon", description: "Portugal" },
  { value: "porto", label: "Porto" },
  { value: "sao-paulo", label: "São Paulo" },
  { value: "rio", label: "Rio de Janeiro", disabled: true },
];

const meta = {
  title: "Forms/FormInputMenu",
  component: FormInputMenu,
  tags: ["autodocs"],
  parameters: { layout: "padded" },
  args: { className: "w-72", items: cities, onValueChange: fn() },
} satisfies Meta<typeof FormInputMenu>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = { args: { label: "City", placeholder: "Search a city" } };

export const Preselected: Story = { args: { label: "City", defaultValue: "porto" } };

export const Creatable: Story = {
  args: { label: "City", creatable: true, help: "Type a new city and press Enter." },
};

export const Required: Story = {
  args: { label: "City", required: true, rules: [rules.required("Choose a city")] },
};

export const Disabled: Story = { args: { label: "City", disabled: true, defaultValue: "lisbon" } };
