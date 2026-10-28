import type { Meta, StoryObj } from "@storybook/react-vite";
import { fn } from "storybook/test";

import { rules } from "../rules";
import { FormEmojiPicker } from "./form-emoji-picker";

const meta = {
  title: "Forms/FormEmojiPicker",
  component: FormEmojiPicker,
  tags: ["autodocs"],
  parameters: { layout: "padded" },
  args: { className: "w-72", onValueChange: fn() },
} satisfies Meta<typeof FormEmojiPicker>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = { args: { label: "Icon" } };

export const Preselected: Story = { args: { label: "Icon", defaultValue: "🔥", clearable: true } };

export const WithoutSkinTones: Story = {
  args: { label: "Icon", pickerProps: { skinTonesDisabled: true } },
};

export const Required: Story = {
  args: { label: "Icon", required: true, rules: [rules.required("Pick an icon")] },
};

export const Disabled: Story = { args: { label: "Icon", disabled: true, defaultValue: "🔥" } };
