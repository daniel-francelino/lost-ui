import type { Meta, StoryObj } from "@storybook/react-vite";
import { fn } from "storybook/test";

import { rules } from "../rules";
import { FormInputDate } from "./form-input-date";

const meta = {
  title: "Forms/FormInputDate",
  component: FormInputDate,
  tags: ["autodocs"],
  parameters: { layout: "padded" },
  args: { className: "w-72", locale: "en-US", onValueChange: fn() },
} satisfies Meta<typeof FormInputDate>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = { args: { label: "Birthday", placeholder: "Pick a date" } };

export const Preselected: Story = {
  args: { label: "Start", defaultValue: new Date(2026, 0, 15), clearable: true },
};

export const Bounded: Story = {
  args: {
    label: "Appointment",
    defaultValue: new Date(2026, 0, 15),
    min: new Date(2026, 0, 10),
    max: new Date(2026, 0, 20),
  },
};

export const Range: Story = {
  args: {
    label: "Stay",
    mode: "range",
    defaultValue: { from: new Date(2026, 0, 10), to: new Date(2026, 0, 14) },
  },
};

export const WithTime: Story = {
  args: { label: "Meeting", time: true, defaultValue: new Date(2026, 0, 15, 14, 30) },
};

export const Required: Story = {
  args: { label: "Birthday", required: true, rules: [rules.required("Choose a date")] },
};

export const Disabled: Story = {
  args: { label: "Birthday", disabled: true, defaultValue: new Date(2026, 0, 15) },
};
