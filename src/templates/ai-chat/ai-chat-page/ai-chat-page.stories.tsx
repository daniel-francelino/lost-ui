import type { Meta, StoryObj } from "@storybook/react-vite";
import { fn } from "storybook/test";

import { conversations, messages, suggestions } from "./ai-chat-page.fixtures";
import { AiChatPage } from "./ai-chat-page";

const meta = {
  title: "Templates/AiChatPage",
  component: AiChatPage,
  tags: ["autodocs"],
  parameters: { layout: "fullscreen" },
  args: {
    conversations,
    activeConversationId: "c1",
    messages,
    suggestions,
    note: "The assistant can make mistakes. Check important information.",
    onSend: fn(),
    onStop: fn(),
    onReload: fn(),
    onSelectConversation: fn(),
    onNewConversation: fn(),
  },
  decorators: [
    (Story) => (
      <div className="h-dvh">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof AiChatPage>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const NewChat: Story = {
  args: {
    activeConversationId: null,
    messages: [],
    welcomeDescription: "Ask about your brands, your calendar or your results.",
  },
};

export const WaitingForTheAnswer: Story = {
  args: { status: "submitted", messages: messages.slice(0, 1) },
};

export const Streaming: Story = { args: { status: "streaming" } };

export const Failed: Story = { args: { status: "error" } };

export const WithDeleteAndAttachments: Story = {
  args: { onDeleteConversation: fn(), attachments: true, accept: "image/*,application/pdf" },
};

export const WithoutSidebar: Story = { args: { sidebar: false, title: "Ask the assistant" } };

export const NoConversations: Story = {
  args: { conversations: [], activeConversationId: null, messages: [] },
};
