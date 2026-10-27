import type { Meta, StoryObj } from "@storybook/react-vite";

import { AuroraText } from "./aurora-text";

const meta = {
  title: "Effects/Text/AuroraText",
  component: AuroraText,
  tags: ["autodocs"],
  parameters: { layout: "centered" },
} satisfies Meta<typeof AuroraText>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { children: "Aurora" },
  render: (args) => (
    <h1 className="text-4xl font-bold tracking-tight">
      Build with <AuroraText {...args} />
    </h1>
  ),
};

export const Faster: Story = {
  args: { children: "Aurora", speed: 3 },
  render: (args) => (
    <h1 className="text-4xl font-bold tracking-tight">
      Build with <AuroraText {...args} />
    </h1>
  ),
};
