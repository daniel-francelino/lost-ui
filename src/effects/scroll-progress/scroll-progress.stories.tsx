import type { Meta, StoryObj } from "@storybook/react-vite";

import { ScrollProgress } from "./scroll-progress";

const meta = {
  title: "Effects/Layout/ScrollProgress",
  component: ScrollProgress,
  tags: ["autodocs"],
  parameters: { layout: "fullscreen" },
} satisfies Meta<typeof ScrollProgress>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {},
  render: (args) => (
    <div className="h-[200vh] w-full p-8">
      <ScrollProgress {...args} />
      <p>Scroll down to fill the progress bar at the top.</p>
    </div>
  ),
};
