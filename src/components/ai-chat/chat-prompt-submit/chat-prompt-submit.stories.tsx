import type { Meta, StoryObj } from "@storybook/react-vite";
import { fn } from "storybook/test";

import { ChatPromptSubmit } from "./chat-prompt-submit";

const meta = {
  title: "AI chat/ChatPromptSubmit",
  component: ChatPromptSubmit,
  tags: ["autodocs"],
  parameters: { layout: "centered" },
  args: { onStop: fn(), onReload: fn() },
} satisfies Meta<typeof ChatPromptSubmit>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const Submitted: Story = { args: { status: "submitted" } };

export const Streaming: Story = { args: { status: "streaming" } };

export const Failed: Story = { args: { status: "error" } };

export const Disabled: Story = { args: { disabled: true } };

export const AllStates: Story = {
  render: (args) => (
    <div className="flex gap-3">
      {(["ready", "submitted", "streaming", "error"] as const).map((status) => (
        <ChatPromptSubmit key={status} {...args} status={status} />
      ))}
    </div>
  ),
};
