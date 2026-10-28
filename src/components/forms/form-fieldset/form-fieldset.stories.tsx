import type { Meta, StoryObj } from "@storybook/react-vite";
import { UserIcon } from "lucide-react";

import { FormInput } from "../form-input";
import { FormFieldset } from "./form-fieldset";

const meta = {
  title: "Forms/FormFieldset",
  component: FormFieldset,
  tags: ["autodocs"],
  parameters: { layout: "padded" },
  args: {
    legend: "Contact",
    className: "w-96",
    children: (
      <>
        <FormInput label="Name" name="name" />
        <FormInput label="Email" name="email" type="email" />
      </>
    ),
  },
} satisfies Meta<typeof FormFieldset>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = { args: { description: "How we reach you." } };

export const Section: Story = {
  args: { variant: "section", icon: <UserIcon className="size-4" /> },
};

export const Boxed: Story = { args: { variant: "boxed" } };

export const HiddenLegend: Story = {
  args: { hideLegend: true, description: "Screen readers only." },
};

export const Compact: Story = { args: { gap: "sm" } };

export const Disabled: Story = { args: { disabled: true } };
