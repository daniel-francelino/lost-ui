import type { Meta, StoryObj } from "@storybook/react-vite";
import { Button } from "../button";
import { toast } from "sonner";

import { Toaster } from "./sonner";

const meta = {
  title: "UI/Sonner",
  component: Toaster,
  tags: ["autodocs"],
  parameters: { layout: "centered" },
} satisfies Meta<typeof Toaster>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {},
  render: (args) => (
    <div>
      <Toaster {...args} />
      <Button variant="outline" onClick={() => toast("Event has been created")}>
        Show toast
      </Button>
    </div>
  ),
};
