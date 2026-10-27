import type { Meta, StoryObj } from "@storybook/react-vite";

import { ComicText } from "./comic-text";

const meta = {
  title: "Effects/Text/ComicText",
  component: ComicText,
  tags: ["autodocs"],
  parameters: { layout: "centered" },
} satisfies Meta<typeof ComicText>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { children: "BOOM!" },
};
