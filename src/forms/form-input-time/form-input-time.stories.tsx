import type { Meta, StoryObj } from "@storybook/react-vite";
import { fn } from "storybook/test";

import { rules } from "../rules";
import { FormInputTime } from "./form-input-time";

const meta = {
  title: "Forms/FormInputTime",
  component: FormInputTime,
  tags: ["autodocs"],
  parameters: { layout: "padded" },
  args: { onValueChange: fn() },
} satisfies Meta<typeof FormInputTime>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = { args: { label: "Meeting time", defaultValue: "09:30" } };

export const WithSeconds: Story = {
  args: { label: "Timestamp", seconds: true, defaultValue: "09:30:15" },
};

export const BusinessHours: Story = {
  args: {
    label: "Pick up",
    min: "09:00",
    max: "18:00",
    rules: [
      (value: string) =>
        !value || (value >= "09:00" && value <= "18:00") || "Between 09:00 and 18:00",
    ],
  },
};

export const Required: Story = {
  args: { label: "Time", required: true, rules: [rules.required("Choose a time")] },
};

export const Disabled: Story = { args: { label: "Time", disabled: true, defaultValue: "12:00" } };
