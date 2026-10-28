import type { Meta, StoryObj } from "@storybook/react-vite";
import { InfoIcon, RocketIcon } from "lucide-react";
import { fn } from "storybook/test";

import { Banner } from "./banner";

const meta = {
  title: "UI/Banner",
  component: Banner,
  tags: ["autodocs"],
  parameters: { layout: "fullscreen" },
  args: { title: "Version 2 is out: read what is new." },
} satisfies Meta<typeof Banner>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const WithIcon: Story = { args: { icon: <InfoIcon /> } };

export const Colors: Story = {
  render: (args) => (
    <div className="grid gap-1">
      {(
        ["primary", "secondary", "success", "info", "warning", "destructive", "neutral"] as const
      ).map((color) => (
        <Banner key={color} {...args} color={color} title={color} />
      ))}
    </div>
  ),
};

export const Closable: Story = { args: { close: true, onClose: fn() } };

export const Persistent: Story = { args: { id: "release-2", close: true } };

export const WithActions: Story = {
  args: {
    icon: <RocketIcon />,
    actions: [
      { label: "Upgrade", onClick: fn() },
      { label: "Changelog", href: "/changelog" },
    ],
    close: true,
  },
};

export const AsLink: Story = { args: { href: "/changelog", close: true } };

export const CustomContent: Story = {
  args: {
    title: undefined,
    children: (
      <span>
        Maintenance on <strong>Saturday</strong>, 22:00 UTC.
      </span>
    ),
  },
};
