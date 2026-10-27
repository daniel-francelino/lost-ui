import type { Meta, StoryObj } from "@storybook/react-vite";
import { HomeIcon, MailIcon, SearchIcon } from "lucide-react";

import { Dock, DockIcon } from "./dock";

const meta = {
  title: "Effects/Layout/Dock",
  component: Dock,
  tags: ["autodocs"],
  parameters: { layout: "centered" },
} satisfies Meta<typeof Dock>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { children: null },
  render: (args) => (
    <Dock {...args}>
      {[HomeIcon, SearchIcon, MailIcon].map((Icon, index) => (
        <DockIcon key={index}>
          <Icon className="size-full" />
        </DockIcon>
      ))}
    </Dock>
  ),
};
