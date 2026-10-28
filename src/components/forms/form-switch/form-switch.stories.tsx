import type { Meta, StoryObj } from "@storybook/react-vite";
import { fn } from "storybook/test";

import { rules } from "../rules";
import { FormSwitch } from "./form-switch";

const meta = {
  title: "Forms/FormSwitch",
  component: FormSwitch,
  tags: ["autodocs"],
  parameters: { layout: "padded" },
  args: { className: "w-96", onValueChange: fn() },
} satisfies Meta<typeof FormSwitch>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  args: { label: "Airplane mode", description: "Turns off all wireless connections." },
};

export const On: Story = { args: { label: "Notifications", defaultValue: true } };

export const MustBeOn: Story = {
  args: { label: "Enable two factor", rules: [rules.required("Two factor is mandatory")] },
};

export const Disabled: Story = { args: { label: "Managed by your admin", disabled: true } };
