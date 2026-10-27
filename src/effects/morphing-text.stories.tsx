import type { Meta, StoryObj } from "@storybook/react-vite";

import { MorphingText } from "./morphing-text";

const meta = {
  title: "Effects/Text/MorphingText",
  component: MorphingText,
  tags: ["autodocs"],
  parameters: { layout: "centered" },
} satisfies Meta<typeof MorphingText>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { texts: ["Hello", "Morphing", "Text", "Lost UI"] },
};
