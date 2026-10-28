import type { Meta, StoryObj } from "@storybook/react-vite";
import { fn } from "storybook/test";

import { rules } from "../rules";
import { FormCheckboxGroup } from "./form-checkbox-group";

const toppings = [
  { value: "cheese", label: "Cheese", description: "Mozzarella" },
  { value: "mushroom", label: "Mushroom" },
  { value: "olive", label: "Olive" },
  { value: "anchovy", label: "Anchovy", disabled: true },
];

const meta = {
  title: "Forms/FormCheckboxGroup",
  component: FormCheckboxGroup,
  tags: ["autodocs"],
  parameters: { layout: "padded" },
  args: { items: toppings, onValueChange: fn() },
} satisfies Meta<typeof FormCheckboxGroup>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = { args: { label: "Toppings", description: "Pick any." } };

export const Preselected: Story = {
  args: { label: "Toppings", defaultValue: ["cheese", "olive"] },
};

export const Horizontal: Story = { args: { label: "Toppings", orientation: "horizontal" } };

export const PickTwo: Story = {
  args: {
    label: "Toppings",
    required: true,
    rules: [rules.minLength(2, "Pick at least two toppings")],
  },
};

export const Disabled: Story = { args: { label: "Toppings", disabled: true } };
