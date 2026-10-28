import type { Meta, StoryObj } from "@storybook/react-vite";
import { UserIcon } from "lucide-react";
import { fn } from "storybook/test";

import { UserInfo } from "./user-info";

const meta = {
  title: "Data/UserInfo",
  component: UserInfo,
  tags: ["autodocs"],
  parameters: { layout: "centered" },
  args: { name: "Ada Lovelace", description: "Software engineer" },
} satisfies Meta<typeof UserInfo>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const NameOnly: Story = { args: { description: undefined } };

export const WithImage: Story = {
  args: {
    avatar: {
      src: "https://github.com/benjamincanac.png",
      alt: "Ada Lovelace",
    },
  },
};

export const WithIcon: Story = {
  args: {
    name: undefined,
    description: "Unknown user",
    avatar: { icon: <UserIcon className="size-4" /> },
  },
};

export const WithChip: Story = {
  args: { chip: { color: "success", position: "bottom-right" }, chipLabel: "Online" },
};

export const Sizes: Story = {
  render: (args) => (
    <div className="grid gap-4">
      {(["xs", "sm", "md", "lg", "xl"] as const).map((size) => (
        <UserInfo key={size} {...args} size={size} chip />
      ))}
    </div>
  ),
};

export const Vertical: Story = { args: { orientation: "vertical", chip: true } };

export const AsLink: Story = {
  args: { href: "https://github.com/ada", target: "_blank" },
};

export const AsButton: Story = { args: { onClick: fn() } };

export const CustomSlots: Story = {
  args: {
    renderName: () => <strong>Dr. Ada</strong>,
    renderDescription: () => <em>on call</em>,
  },
};
