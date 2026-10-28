import type { Meta, StoryObj } from "@storybook/react-vite";
import { fn } from "storybook/test";

import { Button } from "../../ui/button";
import { Slideover } from "./slideover";

const meta = {
  title: "Elements/Slideover",
  component: Slideover,
  tags: ["autodocs"],
  parameters: { layout: "centered" },
  args: {
    trigger: <Button variant="outline">Open</Button>,
    title: "Filters",
    description: "Narrow the list down.",
    children: <p className="text-sm">The filters go here.</p>,
    onOpenChange: fn(),
  },
} satisfies Meta<typeof Slideover>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const Left: Story = { args: { side: "left" } };

export const Top: Story = { args: { side: "top" } };

export const Bottom: Story = { args: { side: "bottom" } };

export const Inset: Story = { args: { inset: true } };

export const WithFooter: Story = {
  args: {
    footer: ({ close }) => (
      <>
        <Button variant="outline" onClick={close}>
          Cancel
        </Button>
        <Button onClick={close}>Apply</Button>
      </>
    ),
  },
};

export const NonModal: Story = { args: { modal: false } };
