import type { Meta, StoryObj } from "@storybook/react-vite";
import { Button } from "../button";

import { HoverCard, HoverCardTrigger, HoverCardContent } from "./hover-card";

const meta = {
  title: "UI/HoverCard",
  component: HoverCard,
  tags: ["autodocs"],
  parameters: { layout: "centered" },
} satisfies Meta<typeof HoverCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { openDelay: 0, closeDelay: 0 },
  render: (args) => (
    <HoverCard {...args}>
      <HoverCardTrigger asChild>
        <Button variant="link">@lostui</Button>
      </HoverCardTrigger>
      <HoverCardContent className="w-72">
        The component library for our landing pages.
      </HoverCardContent>
    </HoverCard>
  ),
};
