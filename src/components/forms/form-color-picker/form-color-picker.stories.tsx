import type { Meta, StoryObj } from "@storybook/react-vite";
import { fn } from "storybook/test";

import { FormColorPicker } from "./form-color-picker";

const swatches = ["#ef4444", "#f59e0b", "#22c55e", "#3b82f6", "#8b5cf6"];

const meta = {
  title: "Forms/FormColorPicker",
  component: FormColorPicker,
  tags: ["autodocs"],
  parameters: { layout: "padded" },
  args: { className: "w-72", onValueChange: fn() },
} satisfies Meta<typeof FormColorPicker>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = { args: { label: "Brand color", defaultValue: "#3b82f6" } };

export const WithSwatches: Story = {
  args: { label: "Accent", swatches, defaultValue: "#22c55e" },
};

export const Validated: Story = {
  args: {
    label: "Hex color",
    help: "Use a 6 digit hex value.",
    rules: [(value: string, test) => test.hexColor(value) || "Enter a hex color like #1a2b3c"],
  },
};

export const Disabled: Story = {
  args: { label: "Color", disabled: true, swatches, defaultValue: "#ef4444" },
};
