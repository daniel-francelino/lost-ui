import type { Meta, StoryObj } from "@storybook/react-vite";
import { SettingsIcon } from "lucide-react";
import { useState } from "react";
import { fn } from "storybook/test";

import { Button } from "../../ui/button";
import { Modal } from "./modal";

const open = <Button variant="outline">Open</Button>;

const meta = {
  title: "Elements/Modal",
  component: Modal,
  tags: ["autodocs"],
  parameters: { layout: "centered" },
  args: {
    trigger: open,
    title: "Delete project",
    description: "This action cannot be undone.",
    children: <p className="text-sm">Everything inside the project will be removed.</p>,
    onOpenChange: fn(),
  },
} satisfies Meta<typeof Modal>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const WithFooter: Story = {
  args: {
    footer: ({ close }) => (
      <>
        <Button variant="outline" onClick={close}>
          Cancel
        </Button>
        <Button variant="destructive" onClick={close}>
          Delete
        </Button>
      </>
    ),
  },
};

export const WithActions: Story = {
  args: {
    actions: (
      <Button variant="ghost" size="icon" aria-label="Settings">
        <SettingsIcon />
      </Button>
    ),
  },
};

export const Controlled: Story = {
  args: { trigger: undefined },
  render: (args) => {
    const [isOpen, setIsOpen] = useState(false);

    return (
      <>
        <Button variant="outline" onClick={() => setIsOpen(true)}>
          Open from outside
        </Button>
        <Modal {...args} open={isOpen} onOpenChange={setIsOpen} />
      </>
    );
  },
};

export const NoCloseButton: Story = {
  args: {
    close: false,
    footer: ({ close }) => <Button onClick={close}>Got it</Button>,
  },
};

export const NotDismissible: Story = {
  args: {
    dismissible: false,
    onClosePrevented: fn(),
    close: false,
    footer: ({ close }) => <Button onClick={close}>Close</Button>,
  },
};

export const NoOverlay: Story = { args: { overlay: false } };

export const NotModal: Story = { args: { modal: false } };

export const Fullscreen: Story = { args: { fullscreen: true } };

export const Scrollable: Story = {
  args: {
    scrollable: true,
    children: (
      <div className="grid gap-3">
        {Array.from({ length: 30 }, (_, index) => (
          <p key={index} className="text-sm">
            Paragraph {index + 1}
          </p>
        ))}
      </div>
    ),
  },
};

export const NoTransition: Story = { args: { transition: false } };

export const KeepMounted: Story = { args: { unmountOnHide: false } };

export const CustomHeader: Story = {
  args: { title: undefined, description: undefined, header: <strong>Custom header</strong> },
};

export const CustomContent: Story = {
  args: {
    title: "Panel",
    content: <div className="p-6 text-sm">Everything in here is yours.</div>,
    children: undefined,
  },
};

export const FromTheSide: Story = { args: { side: "right" } };

export const FromTheLeft: Story = { args: { side: "left", inset: true } };
