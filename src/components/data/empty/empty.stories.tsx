import type { Meta, StoryObj } from "@storybook/react-vite";
import { BellIcon, FileIcon, PlusIcon, RefreshCwIcon } from "lucide-react";
import { fn } from "storybook/test";

import { Avatar, AvatarFallback } from "../../ui/avatar";
import { Empty } from "./empty";

const meta = {
  title: "Data/Empty",
  component: Empty,
  tags: ["autodocs"],
  parameters: { layout: "centered" },
  args: { className: "w-96" },
} satisfies Meta<typeof Empty>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  args: {
    icon: <FileIcon />,
    title: "No projects found",
    description: "Create a project to get started.",
  },
};

export const WithActions: Story = {
  args: {
    icon: <FileIcon />,
    title: "No projects found",
    description: "Create a project to get started.",
    actions: [
      { label: "Create new", icon: <PlusIcon />, onClick: fn() },
      { label: "Refresh", icon: <RefreshCwIcon />, variant: "outline", onClick: fn() },
    ],
  },
};

export const WithLink: Story = {
  args: {
    title: "No projects found",
    actions: [{ label: "Read the guide", href: "/guide", variant: "link" }],
  },
};

export const WithAvatar: Story = {
  args: {
    avatar: (
      <Avatar className="size-12">
        <AvatarFallback>AL</AvatarFallback>
      </Avatar>
    ),
    title: "No messages from Ada",
  },
};

export const Loading: Story = {
  args: { loading: true, icon: <FileIcon />, title: "Loading projects" },
};

export const Variants: Story = {
  render: (args) => (
    <div className="grid gap-4">
      {(["outline", "solid", "soft", "subtle", "naked"] as const).map((variant) => (
        <Empty
          key={variant}
          {...args}
          variant={variant}
          icon={<BellIcon />}
          title={variant}
          description="No notifications"
        />
      ))}
    </div>
  ),
};

export const Sizes: Story = {
  render: (args) => (
    <div className="grid gap-4">
      {(["xs", "sm", "md", "lg", "xl"] as const).map((size) => (
        <Empty key={size} {...args} size={size} icon={<BellIcon />} title={`Size ${size}`} />
      ))}
    </div>
  ),
};

export const WithContent: Story = {
  args: {
    title: "No members yet",
    children: <p className="text-xs text-muted-foreground">Invite people from the settings.</p>,
    footer: <small className="text-muted-foreground">Need help? Contact support.</small>,
  },
};
