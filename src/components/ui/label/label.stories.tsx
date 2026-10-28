import type { Meta, StoryObj } from "@storybook/react-vite";

import { Label } from "./label";

const meta = {
  title: "UI/Label",
  component: Label,
  tags: ["autodocs"],
  parameters: { layout: "centered" },
} satisfies Meta<typeof Label>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { children: "Email", htmlFor: "email" },
  render: (args) => (
    <div className="grid w-72 gap-2">
      <Label {...args} />
      <input id="email" className="rounded-md border px-3 py-1.5 text-sm" />
    </div>
  ),
};
