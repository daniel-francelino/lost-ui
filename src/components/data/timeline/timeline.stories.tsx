import type { Meta, StoryObj } from "@storybook/react-vite";
import { CalendarIcon, CheckIcon, RocketIcon, TruckIcon } from "lucide-react";
import { useState } from "react";
import { fn } from "storybook/test";

import { Avatar, AvatarFallback } from "../../ui/avatar";
import { Timeline, type TimelineItem } from "./timeline";

const items: TimelineItem[] = [
  {
    date: "Mar 15, 2026",
    title: "Project kickoff",
    description: "Scope and team agreed.",
    icon: <CalendarIcon />,
  },
  {
    date: "Mar 22, 2026",
    title: "Design approved",
    description: "The prototype was signed off.",
    icon: <CheckIcon />,
  },
  {
    date: "Apr 1, 2026",
    title: "Build started",
    description: "First sprint is under way.",
    icon: <TruckIcon />,
  },
  {
    date: "Apr 30, 2026",
    title: "Launch",
    description: "Public release.",
    icon: <RocketIcon />,
  },
];

const meta = {
  title: "Data/Timeline",
  component: Timeline,
  tags: ["autodocs"],
  parameters: { layout: "padded" },
  args: { items, className: "w-96" },
} satisfies Meta<typeof Timeline>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const DefaultValue: Story = { args: { defaultValue: 1 } };

export const Colors: Story = {
  render: (args) => (
    <div className="grid gap-6">
      {(["primary", "success", "info", "warning", "destructive", "neutral"] as const).map(
        (color) => (
          <Timeline
            key={color}
            {...args}
            color={color}
            defaultValue={1}
            items={items.slice(0, 3)}
          />
        ),
      )}
    </div>
  ),
};

export const Sizes: Story = {
  render: (args) => (
    <div className="grid gap-6">
      {(["xs", "sm", "md", "lg", "xl"] as const).map((size) => (
        <Timeline key={size} {...args} size={size} defaultValue={1} items={items.slice(0, 3)} />
      ))}
    </div>
  ),
};

export const Horizontal: Story = {
  args: { orientation: "horizontal", className: "w-full max-w-3xl", defaultValue: 1 },
};

export const Reversed: Story = { args: { reverse: true, defaultValue: 1 } };

export const Selectable: Story = {
  args: { onSelect: fn() },
  render: (args) => {
    const [value, setValue] = useState<string | number>(0);

    return <Timeline {...args} value={value} onValueChange={setValue} />;
  },
};

export const WithAvatars: Story = {
  args: {
    items: [
      {
        title: "Ada pushed to main",
        date: "5 minutes ago",
        avatar: (
          <Avatar className="size-full">
            <AvatarFallback>AL</AvatarFallback>
          </Avatar>
        ),
      },
      {
        title: "Grace opened a pull request",
        date: "1 hour ago",
        avatar: (
          <Avatar className="size-full">
            <AvatarFallback>GH</AvatarFallback>
          </Avatar>
        ),
      },
    ],
  },
};

export const CustomSlots: Story = {
  args: {
    defaultValue: 0,
    renderTitle: (item) => <strong className="uppercase">{item.title}</strong>,
    renderDate: (item) => <em>{item.date}</em>,
  },
};
