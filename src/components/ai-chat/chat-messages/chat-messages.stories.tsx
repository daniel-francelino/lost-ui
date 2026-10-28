import type { Meta, StoryObj } from "@storybook/react-vite";
import { BotIcon, CopyIcon, RefreshCwIcon } from "lucide-react";
import { fn } from "storybook/test";

import { Avatar, AvatarFallback } from "../../ui/avatar";
import { ChatPrompt } from "../chat-prompt";
import { ChatSuggestions } from "../chat-suggestions";
import type { ChatMessageData } from "../chat-parts/types";
import { ChatMessages } from "./chat-messages";

const conversation: ChatMessageData[] = [
  {
    id: "1",
    role: "user",
    parts: [{ type: "text", text: "Plan a launch campaign for our bakery." }],
  },
  {
    id: "2",
    role: "assistant",
    parts: [
      {
        type: "reasoning",
        text: "Local audience, visual product: Instagram first.",
        state: "done",
      },
      {
        type: "tool-search",
        title: "Searched the web",
        state: "output-available",
        output: { results: 3 },
      },
      {
        type: "text",
        text: "Here is a plan for the launch week:\n\n1. Teaser posts on Instagram\n2. A giveaway in stories\n3. A newsletter to the mailing list",
      },
    ],
  },
  { id: "3", role: "user", parts: [{ type: "text", text: "Great, write the first caption." }] },
  {
    id: "4",
    role: "assistant",
    parts: [
      { type: "text", text: "“Something warm is coming out of the oven. 🥐 Opening Saturday.”" },
    ],
  },
];

const many: ChatMessageData[] = Array.from({ length: 14 }, (_, index) => ({
  id: String(index),
  role: index % 2 === 0 ? "user" : "assistant",
  parts: [{ type: "text", text: `Message number ${index + 1}. `.repeat(6) }],
}));

const meta = {
  title: "AI chat/ChatMessages",
  component: ChatMessages,
  tags: ["autodocs"],
  parameters: { layout: "fullscreen" },
  args: { messages: conversation },
  decorators: [
    (Story) => (
      <div className="flex h-[32rem] flex-col">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof ChatMessages>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const Streaming: Story = {
  args: {
    status: "streaming",
    messages: [
      conversation[0]!,
      {
        id: "s",
        role: "assistant",
        parts: [{ type: "reasoning", text: "Local audience, visual product" }],
      },
    ],
  },
};

export const WaitingForTheAnswer: Story = {
  args: { status: "submitted", messages: [conversation[0]!] },
};

export const Empty: Story = {
  args: {
    messages: [],
    empty: (
      <div className="grid justify-items-center gap-4 text-center">
        <h2 className="text-2xl font-semibold">How can I help?</h2>
        <ChatSuggestions
          suggestions={["Plan a launch campaign", "Write three captions", "Summarise the month"]}
        />
      </div>
    ),
  },
};

export const WithPrompt: Story = {
  args: { footer: <ChatPrompt onSubmit={fn()} /> },
};

export const WithAvatarsAndActions: Story = {
  args: {
    assistant: {
      avatar: (
        <Avatar>
          <AvatarFallback>
            <BotIcon className="size-4" />
          </AvatarFallback>
        </Avatar>
      ),
    },
    getActions: (message) =>
      message.role === "assistant"
        ? [
            { label: "Copy", icon: <CopyIcon />, onClick: fn() },
            { label: "Regenerate", icon: <RefreshCwIcon />, onClick: fn() },
          ]
        : undefined,
  },
};

export const BubblesOnBothSides: Story = {
  args: { assistant: { variant: "subtle" }, user: { variant: "solid" } },
};

export const CustomIndicator: Story = {
  args: {
    status: "submitted",
    messages: [conversation[0]!],
    indicator: <span className="text-muted-foreground">Writing the plan…</span>,
  },
};

export const LongConversation: Story = { args: { messages: many, footer: <ChatPrompt /> } };
