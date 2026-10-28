import type { Meta, StoryObj } from "@storybook/react-vite";
import { SparklesIcon } from "lucide-react";
import { fn } from "storybook/test";

import { Button } from "../../ui/button";
import { ChatPrompt } from "./chat-prompt";

const meta = {
  title: "AI chat/ChatPrompt",
  component: ChatPrompt,
  tags: ["autodocs"],
  parameters: { layout: "centered" },
  args: { onSubmit: fn(), onStop: fn(), onReload: fn(), onClose: fn() },
  decorators: [
    (Story) => (
      <div className="w-[32rem] max-w-full">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof ChatPrompt>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const Streaming: Story = { args: { status: "streaming" } };

export const Failed: Story = { args: { status: "error" } };

export const WithAttachments: Story = {
  args: { attachments: true, accept: "image/*,application/pdf" },
};

export const EnterBreaksTheLine: Story = { args: { submitOnEnter: false } };

export const WithFooter: Story = {
  args: {
    attachments: true,
    footer: (
      <Button type="button" variant="ghost" size="sm" className="text-muted-foreground">
        <SparklesIcon /> Auto
      </Button>
    ),
  },
};

export const WithHeader: Story = {
  args: {
    header: (
      <p className="rounded-lg bg-muted px-3 py-1.5 text-xs text-muted-foreground">
        Answering: “Plan a launch campaign”
      </p>
    ),
  },
};

export const Soft: Story = { args: { variant: "soft" } };

export const Naked: Story = { args: { variant: "naked" } };

export const Disabled: Story = { args: { disabled: true, defaultValue: "Not now" } };

export const LongText: Story = {
  args: {
    maxRows: 4,
    defaultValue: Array.from({ length: 12 }, (_, i) => `Line ${i + 1}`).join("\n"),
  },
};
