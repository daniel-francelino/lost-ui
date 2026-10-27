import type { Meta, StoryObj } from "@storybook/react-vite";

import { KineticText } from "./kinetic-text";

const meta = {
  title: "Effects/Text/KineticText",
  component: KineticText,
  tags: ["autodocs"],
  parameters: { layout: "centered" },
} satisfies Meta<typeof KineticText>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { text: "Kinetic", className: "text-6xl font-bold" },
};
