import type { Meta, StoryObj } from "@storybook/react-vite";

import { Input } from "./input";

const meta = {
  title: "UI/Input",
  component: Input,
  tags: ["autodocs"],
  parameters: { layout: "centered" },
} satisfies Meta<typeof Input>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { placeholder: "Email", type: "email", className: "w-72" },
};

export const Disabled: Story = {
  args: { placeholder: "Disabled", disabled: true, className: "w-72" },
};
