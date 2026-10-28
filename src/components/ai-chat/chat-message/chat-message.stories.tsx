import type { Meta, StoryObj } from "@storybook/react-vite";
import { BotIcon, CopyIcon, RefreshCwIcon, ThumbsDownIcon, ThumbsUpIcon } from "lucide-react";
import { fn } from "storybook/test";

import { Avatar, AvatarFallback } from "../../ui/avatar";
import { ChatMessage } from "./chat-message";

const actions = [
  { label: "Copy", icon: <CopyIcon />, onClick: fn() },
  { label: "Regenerate", icon: <RefreshCwIcon />, onClick: fn() },
  { label: "Good response", icon: <ThumbsUpIcon />, onClick: fn() },
  { label: "Bad response", icon: <ThumbsDownIcon />, onClick: fn() },
];

const meta = {
  title: "AI chat/ChatMessage",
  component: ChatMessage,
  tags: ["autodocs"],
  parameters: { layout: "padded" },
  args: {
    role: "assistant",
    parts: [{ type: "text", text: "Here is a plan for the launch week, one post a day." }],
  },
  decorators: [
    (Story) => (
      <div className="mx-auto w-[36rem] max-w-full">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof ChatMessage>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const FromTheUser: Story = {
  args: { role: "user", parts: [{ type: "text", text: "Plan a launch campaign for our bakery." }] },
};

export const Variants: Story = {
  render: (args) => (
    <div className="grid gap-4">
      {(["solid", "soft", "outline", "subtle", "naked"] as const).map((variant) => (
        <ChatMessage key={variant} {...args} role="user" variant={variant} side="left" />
      ))}
    </div>
  ),
};

export const WithAvatar: Story = {
  args: {
    avatar: (
      <Avatar>
        <AvatarFallback>
          <BotIcon className="size-4" />
        </AvatarFallback>
      </Avatar>
    ),
    header: "Aura · 10:42",
  },
};

export const WithActions: Story = { args: { actions } };

export const Compact: Story = { args: { compact: true, role: "user" } };

export const Reasoning: Story = {
  args: {
    parts: [
      {
        type: "reasoning",
        text: "Three channels fit the audience: Instagram, LinkedIn and email.",
      },
      { type: "text", text: "I suggest Instagram, LinkedIn and a newsletter." },
    ],
  },
};

export const StreamingReasoning: Story = {
  args: {
    streaming: true,
    parts: [{ type: "reasoning", text: "Looking at the audience first, then the channels" }],
  },
};

export const ToolCalls: Story = {
  args: {
    parts: [
      {
        type: "tool-search",
        title: "Searched the web",
        state: "output-available",
        output: { results: 3 },
      },
      { type: "tool-schedule", title: "Scheduling posts", state: "input-available" },
      { type: "tool-publish", title: "Publishing", state: "output-error", errorText: "No access" },
      { type: "text", text: "The posts are scheduled, but publishing failed." },
    ],
  },
};

export const FilesAndSources: Story = {
  args: {
    parts: [
      { type: "file", mediaType: "application/pdf", url: "/brief.pdf", filename: "brief.pdf" },
      { type: "text", text: "Based on the brief and on these articles:" },
      { type: "source-url", url: "https://example.com/post", title: "How to plan a launch" },
    ],
  },
};

export const CustomText: Story = {
  args: {
    parts: [{ type: "text", text: "Use **bold** for the offer." }],
    renderText: (text) => (
      <p
        dangerouslySetInnerHTML={{ __html: text.replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>") }}
      />
    ),
  },
};
