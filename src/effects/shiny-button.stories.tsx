import type { Meta, StoryObj } from "@storybook/react-vite";

import { ShinyButton } from "./shiny-button";

const meta = {
  title: "Effects/Buttons/ShinyButton",
  component: ShinyButton,
  tags: ["autodocs"],
  parameters: { layout: "centered" },
} satisfies Meta<typeof ShinyButton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { children: "Shiny button" },
};
