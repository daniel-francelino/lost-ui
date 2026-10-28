import type { Meta, StoryObj } from "@storybook/react-vite";

import { Avatar, AvatarFallback } from "../avatar";
import { AvatarGroup } from "./avatar-group";

const people = ["Ada Lovelace", "Grace Hopper", "Alan Turing", "Joan Clarke", "Linus Torvalds"];

const initials = (name: string) =>
  name
    .split(" ")
    .map((part) => part[0])
    .join("");

const avatars = people.map((name) => (
  <Avatar key={name} title={name}>
    <AvatarFallback>{initials(name)}</AvatarFallback>
  </Avatar>
));

const meta = {
  title: "UI/AvatarGroup",
  component: AvatarGroup,
  tags: ["autodocs"],
  parameters: { layout: "centered" },
  args: { children: avatars, label: "Team members" },
} satisfies Meta<typeof AvatarGroup>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const Max: Story = { args: { max: 3 } };

export const Sizes: Story = {
  render: (args) => (
    <div className="grid gap-4">
      {(["xs", "sm", "md", "lg", "xl"] as const).map((size) => (
        <AvatarGroup key={size} {...args} size={size} />
      ))}
    </div>
  ),
};
