import type { Meta, StoryObj } from "@storybook/react-vite";
import { fn } from "storybook/test";

import { rules } from "../rules";
import { FormListbox } from "./form-listbox";

const frameworks = [
  { value: "react", label: "React", description: "Library" },
  { value: "vue", label: "Vue" },
  { value: "svelte", label: "Svelte" },
  { value: "solid", label: "Solid", disabled: true },
];

const meta = {
  title: "Forms/FormListbox",
  component: FormListbox,
  tags: ["autodocs"],
  parameters: { layout: "padded" },
  args: { className: "w-72", items: frameworks, onValueChange: fn() },
} satisfies Meta<typeof FormListbox>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = { args: { label: "Framework", description: "Pick one." } };

export const Preselected: Story = { args: { label: "Framework", defaultValue: "vue" } };

export const Multiple: Story = {
  args: { label: "Frameworks", multiple: true, defaultValue: ["react", "svelte"] },
};

export const Required: Story = {
  args: { label: "Framework", required: true, rules: [rules.required("Choose a framework")] },
};

export const Empty: Story = {
  args: { label: "Framework", items: [], emptyText: "Nothing to show" },
};

export const Disabled: Story = {
  args: { label: "Framework", disabled: true, defaultValue: "react" },
};
