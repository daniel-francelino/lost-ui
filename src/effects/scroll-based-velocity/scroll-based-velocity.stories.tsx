import type { Meta, StoryObj } from "@storybook/react-vite";

import { ScrollVelocityContainer, ScrollVelocityRow } from "./scroll-based-velocity";

const meta = {
  title: "Effects/Layout/ScrollVelocity",
  component: ScrollVelocityContainer,
  tags: ["autodocs"],
  parameters: { layout: "fullscreen" },
} satisfies Meta<typeof ScrollVelocityContainer>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {},
  render: (args) => (
    <ScrollVelocityContainer {...args} className="w-full py-12 text-4xl font-bold">
      <ScrollVelocityRow baseVelocity={3}>Scroll velocity </ScrollVelocityRow>
      <ScrollVelocityRow baseVelocity={3} direction={-1}>
        Another row{" "}
      </ScrollVelocityRow>
    </ScrollVelocityContainer>
  ),
};
