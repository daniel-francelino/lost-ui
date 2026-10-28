import type { Meta, StoryObj } from "@storybook/react-vite";

import { Main } from "./main";

const meta = {
  title: "App/Main",
  component: Main,
  tags: ["autodocs"],
  parameters: { layout: "fullscreen" },
  args: { children: <p className="p-6">Page content</p> },
} satisfies Meta<typeof Main>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const AsDiv: Story = { args: { as: "div" } };
