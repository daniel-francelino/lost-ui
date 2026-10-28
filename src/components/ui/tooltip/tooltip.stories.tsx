import type { Meta, StoryObj } from "@storybook/react-vite";
import { Button } from "../button";

import { TooltipProvider, Tooltip, TooltipTrigger, TooltipContent } from "./tooltip";

const meta = {
  title: "UI/Tooltip",
  component: TooltipProvider,
  tags: ["autodocs"],
  parameters: { layout: "centered" },
} satisfies Meta<typeof TooltipProvider>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { delayDuration: 0, children: null },
  render: (args) => (
    <TooltipProvider {...args}>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button variant="outline">Hover me</Button>
        </TooltipTrigger>
        <TooltipContent>Add to library</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  ),
};
