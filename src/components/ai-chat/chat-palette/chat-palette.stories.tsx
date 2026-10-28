import type { Meta, StoryObj } from "@storybook/react-vite";
import { fn } from "storybook/test";

import { Modal } from "../../elements/modal";
import { ChatMessages } from "../chat-messages";
import { ChatPrompt } from "../chat-prompt";
import type { ChatMessageData } from "../chat-parts/types";
import { ChatPalette } from "./chat-palette";

const messages: ChatMessageData[] = [
  { id: "1", role: "user", parts: [{ type: "text", text: "What is our best performing post?" }] },
  {
    id: "2",
    role: "assistant",
    parts: [{ type: "text", text: "The bakery reel from Saturday: 12k views, 4% saves." }],
  },
];

const meta = {
  title: "AI chat/ChatPalette",
  component: ChatPalette,
  tags: ["autodocs"],
  parameters: { layout: "centered" },
  args: {
    children: <ChatMessages messages={messages} compact />,
    prompt: <ChatPrompt variant="naked" onSubmit={fn()} />,
  },
  decorators: [
    (Story) => (
      <div className="h-[28rem] w-[30rem] overflow-hidden rounded-xl border">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof ChatPalette>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const WithoutPrompt: Story = { args: { prompt: undefined } };

export const InAModal: Story = {
  decorators: [],
  render: (args) => (
    <Modal open title="Ask the assistant" description="Answers from your data.">
      <div className="h-80">
        <ChatPalette {...args} />
      </div>
    </Modal>
  ),
};
