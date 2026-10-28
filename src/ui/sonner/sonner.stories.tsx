import type { Meta, StoryObj } from "@storybook/react-vite";

import { Button } from "../button";
import { Toaster, toast } from "./sonner";

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

export const Kinds: Story = {
  args: {},
  render: (args) => (
    <div className="flex flex-wrap gap-2">
      <Toaster {...args} />
      <Button variant="outline" onClick={() => toast.success("Saved", { description: "All set." })}>
        Success
      </Button>
      <Button variant="outline" onClick={() => toast.error("Could not save")}>
        Error
      </Button>
      <Button variant="outline" onClick={() => toast.warning("Unsaved changes")}>
        Warning
      </Button>
      <Button variant="outline" onClick={() => toast.info("New version available")}>
        Info
      </Button>
      <Button variant="outline" onClick={() => toast.loading("Uploading")}>
        Loading
      </Button>
    </div>
  ),
};
