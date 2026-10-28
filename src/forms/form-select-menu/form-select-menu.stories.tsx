import type { Meta, StoryObj } from "@storybook/react-vite";
import { fn } from "storybook/test";

import { rules } from "../rules";
import { FormSelectMenu } from "./form-select-menu";

const languages = [
  { value: "ts", label: "TypeScript" },
  { value: "js", label: "JavaScript" },
  { value: "rs", label: "Rust" },
  { value: "go", label: "Go", disabled: true },
];

const meta = {
  title: "Forms/FormSelectMenu",
  component: FormSelectMenu,
  tags: ["autodocs"],
  parameters: { layout: "padded" },
  args: { className: "w-72", items: languages, onValueChange: fn() },
} satisfies Meta<typeof FormSelectMenu>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = { args: { label: "Language", placeholder: "Select a language" } };

export const Preselected: Story = { args: { label: "Language", defaultValue: "rs" } };

export const Multiple: Story = {
  args: {
    label: "Languages",
    multiple: true,
    defaultValue: ["ts"],
    placeholder: "Select languages",
  },
};

export const Required: Story = {
  args: { label: "Language", required: true, rules: [rules.required("Choose a language")] },
};

export const Disabled: Story = { args: { label: "Language", disabled: true, defaultValue: "ts" } };
