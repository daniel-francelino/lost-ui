import type { Meta, StoryObj } from "@storybook/react-vite";
import { Button } from "../button";

import { Popover, PopoverTrigger, PopoverContent } from "./popover";

const meta = {
  title: "UI/Popover",
  component: Popover,
  tags: ["autodocs"],
  parameters: { layout: "centered" },
} satisfies Meta<typeof Popover>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {},
  render: (args) => (
    <Popover {...args}>
      <PopoverTrigger asChild>
        <Button variant="outline">Open popover</Button>
      </PopoverTrigger>
      <PopoverContent className="w-64 text-sm">Place content for the popover here.</PopoverContent>
    </Popover>
  ),
};
