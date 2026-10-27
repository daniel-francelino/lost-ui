import type { Meta, StoryObj } from "@storybook/react-vite";

import { SpinningText } from "./spinning-text";

const meta = {
  title: "Effects/Text/SpinningText",
  component: SpinningText,
  tags: ["autodocs"],
  parameters: { layout: "centered" },
} satisfies Meta<typeof SpinningText>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { children: "spinning • text • around • ", radius: 6, duration: 10 },
  render: (args) => (
    <div className="p-16">
      <SpinningText {...args} />
    </div>
  ),
};
