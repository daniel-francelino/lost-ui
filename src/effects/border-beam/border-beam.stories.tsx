import type { Meta, StoryObj } from "@storybook/react-vite";

import { BorderBeam } from "./border-beam";

const meta = {
  title: "Effects/Cards/BorderBeam",
  component: BorderBeam,
  tags: ["autodocs"],
  parameters: { layout: "centered" },
} satisfies Meta<typeof BorderBeam>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { size: 150, duration: 8 },
  render: (args) => (
    <div className="relative flex h-48 w-72 items-center justify-center overflow-hidden rounded-xl border bg-card text-card-foreground">
      <span className="text-sm">Border beam</span>
      <BorderBeam {...args} />
    </div>
  ),
};
