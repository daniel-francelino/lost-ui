import type { Meta, StoryObj } from "@storybook/react-vite";

import { AnimatedShinyText } from "./animated-shiny-text";

const meta = {
  title: "Effects/Text/AnimatedShinyText",
  component: AnimatedShinyText,
  tags: ["autodocs"],
  parameters: { layout: "centered" },
} satisfies Meta<typeof AnimatedShinyText>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { children: "Introducing lost-ui" },
  render: (args) => <AnimatedShinyText {...args} />,
};
