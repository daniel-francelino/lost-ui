import type { Meta, StoryObj } from "@storybook/react-vite";
import { fn } from "storybook/test";

import { rules } from "../rules";
import { FormInputNumber } from "./form-input-number";

const meta = {
  title: "Forms/FormInputNumber",
  component: FormInputNumber,
  tags: ["autodocs"],
  parameters: { layout: "padded" },
  args: { className: "w-48", onValueChange: fn() },
} satisfies Meta<typeof FormInputNumber>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = { args: { label: "Quantity", defaultValue: 1 } };

export const Bounded: Story = { args: { label: "Seats", min: 1, max: 10, defaultValue: 5 } };

export const Decimals: Story = {
  args: { label: "Price", step: 0.25, min: 0, defaultValue: 9.5 },
};

export const WithoutControls: Story = { args: { label: "Age", showControls: false } };

export const Required: Story = {
  args: { label: "Quantity", required: true, rules: [rules.required("Enter a quantity")] },
};

export const Disabled: Story = { args: { label: "Quantity", disabled: true, defaultValue: 3 } };
