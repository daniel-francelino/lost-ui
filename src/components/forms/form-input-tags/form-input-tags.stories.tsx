import type { Meta, StoryObj } from "@storybook/react-vite";
import { fn } from "storybook/test";

import { rules } from "../rules";
import { FormInputTags } from "./form-input-tags";

const meta = {
  title: "Forms/FormInputTags",
  component: FormInputTags,
  tags: ["autodocs"],
  parameters: { layout: "padded" },
  args: { className: "w-96", onValueChange: fn() },
} satisfies Meta<typeof FormInputTags>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  args: { label: "Tags", placeholder: "Type and press Enter", help: "Use Enter or a comma." },
};

export const Preselected: Story = { args: { label: "Tags", defaultValue: ["react", "tailwind"] } };

export const MaxThree: Story = { args: { label: "Top skills", max: 3, defaultValue: ["a", "b"] } };

export const AllowDuplicates: Story = { args: { label: "Words", allowDuplicates: true } };

export const AtLeastOne: Story = {
  args: { label: "Tags", required: true, rules: [rules.required("Add at least one tag")] },
};

export const Disabled: Story = {
  args: { label: "Tags", disabled: true, defaultValue: ["locked"] },
};
