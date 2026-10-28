import type { Meta, StoryObj } from "@storybook/react-vite";
import { BellIcon } from "lucide-react";

import { Avatar, AvatarFallback } from "../../ui/avatar";
import { Button } from "../../ui/button";
import { Chip } from "./chip";

const meta = {
  title: "Elements/Chip",
  component: Chip,
  tags: ["autodocs"],
  parameters: { layout: "centered" },
  args: {
    children: (
      <Button variant="outline" size="icon" aria-label="Notifications">
        <BellIcon />
      </Button>
    ),
  },
} satisfies Meta<typeof Chip>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const WithText: Story = { args: { text: 5, size: "xl" } };

export const WithLabel: Story = { args: { text: 3, size: "xl", label: "unread" } };

export const Colors: Story = {
  render: (args) => (
    <div className="flex gap-6">
      {(
        ["primary", "secondary", "success", "info", "warning", "destructive", "neutral"] as const
      ).map((color) => (
        <Chip key={color} {...args} color={color} size="lg" />
      ))}
    </div>
  ),
};

export const Sizes: Story = {
  render: (args) => (
    <div className="flex gap-6">
      {(["xs", "sm", "md", "lg", "xl", "2xl", "3xl"] as const).map((size) => (
        <Chip key={size} {...args} size={size} />
      ))}
    </div>
  ),
};

export const Positions: Story = {
  render: (args) => (
    <div className="flex gap-6">
      {(["top-right", "bottom-right", "top-left", "bottom-left"] as const).map((position) => (
        <Chip key={position} {...args} position={position} />
      ))}
    </div>
  ),
};

export const InsetOnAvatar: Story = {
  args: {
    inset: true,
    color: "success",
    children: (
      <Avatar>
        <AvatarFallback>AL</AvatarFallback>
      </Avatar>
    ),
  },
};

export const Standalone: Story = { args: { children: undefined, standalone: true, text: "New" } };

export const Hidden: Story = { args: { show: false } };
