import type { Meta, StoryObj } from "@storybook/react-vite";
import { fn } from "storybook/test";

import { FormTextarea } from "./form-textarea";

const meta = {
  title: "Forms/FormTextarea",
  component: FormTextarea,
  tags: ["autodocs"],
  parameters: { layout: "padded" },
  args: { className: "w-96", onValueChange: fn() },
} satisfies Meta<typeof FormTextarea>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = { args: { label: "Message", placeholder: "Tell us more…" } };

export const WithRules: Story = {
  args: {
    label: "Message",
    required: true,
    rules: [
      (value: string) => Boolean(value.trim()) || "Message is required",
      (value: string) => value.length >= 10 || "At least 10 characters",
    ],
  },
};

export const Autoresize: Story = {
  args: { label: "Grows with the text", autoresize: true, rows: 2, maxRows: 6 },
};

export const Disabled: Story = {
  args: { label: "Locked", disabled: true, defaultValue: "Read only" },
};

export const WithHelp: Story = {
  args: { label: "Bio", description: "Shown on your profile.", help: "Markdown is supported." },
};
