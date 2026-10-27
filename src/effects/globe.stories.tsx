import type { Meta, StoryObj } from "@storybook/react-vite";

import { Globe } from "./globe";

const meta = {
  title: "Effects/Media/Globe",
  component: Globe,
  tags: ["autodocs"],
  parameters: { layout: "centered" },
} satisfies Meta<typeof Globe>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { className: "size-80" },
  render: (args) => (
    <div className="relative size-80">
      <Globe {...args} />
    </div>
  ),
};
