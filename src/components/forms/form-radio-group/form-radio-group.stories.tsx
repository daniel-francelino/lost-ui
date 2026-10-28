import type { Meta, StoryObj } from "@storybook/react-vite";
import { fn } from "storybook/test";

import { rules } from "../rules";
import { FormRadioGroup } from "./form-radio-group";

const plans = [
  { value: "free", label: "Free", description: "For hobby projects" },
  { value: "pro", label: "Pro", description: "For teams" },
  { value: "enterprise", label: "Enterprise", disabled: true },
];

const meta = {
  title: "Forms/FormRadioGroup",
  component: FormRadioGroup,
  tags: ["autodocs"],
  parameters: { layout: "padded" },
  args: { items: plans, onValueChange: fn() },
} satisfies Meta<typeof FormRadioGroup>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  args: { label: "Plan", description: "You can change it later." },
};

export const Preselected: Story = { args: { label: "Plan", defaultValue: "pro" } };

export const Horizontal: Story = { args: { label: "Plan", orientation: "horizontal" } };

export const StringItems: Story = {
  args: { label: "Size", items: ["Small", "Medium", "Large"] },
};

export const Required: Story = {
  args: { label: "Plan", required: true, rules: [rules.required("Choose a plan")] },
};

export const Disabled: Story = { args: { label: "Plan", disabled: true, defaultValue: "free" } };
