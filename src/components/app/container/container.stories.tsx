import type { Meta, StoryObj } from "@storybook/react-vite";

import { Container } from "./container";

const meta = {
  title: "App/Container",
  component: Container,
  tags: ["autodocs"],
  parameters: { layout: "fullscreen" },
  args: {
    children: <div className="h-32 rounded-md border border-dashed bg-muted/40" />,
  },
} satisfies Meta<typeof Container>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const NarrowerByVariable: Story = {
  args: { style: { "--container-width": "40rem" } as React.CSSProperties },
};

export const AsSection: Story = { args: { as: "section", "aria-label": "Content" } };
