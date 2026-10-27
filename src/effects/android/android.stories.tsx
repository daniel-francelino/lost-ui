import type { Meta, StoryObj } from "@storybook/react-vite";
import { placeholderImage } from "../../stories/placeholder";

import { Android } from "./android";

const meta = {
  title: "Effects/Devices/Android",
  component: Android,
  tags: ["autodocs"],
  parameters: { layout: "centered" },
} satisfies Meta<typeof Android>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { width: 217, height: 441, src: placeholderImage(433, 882, "Android") },
};
