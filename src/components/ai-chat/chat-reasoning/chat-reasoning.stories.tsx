import type { Meta, StoryObj } from "@storybook/react-vite";
import { BrainIcon } from "lucide-react";

import { ChatReasoning } from "./chat-reasoning";

const thought =
  "The user wants a plan for a launch campaign. I should ask who the audience is, then propose three channels and a calendar. Instagram and LinkedIn fit a B2B brand best.";

const meta = {
  title: "AI chat/ChatReasoning",
  component: ChatReasoning,
  tags: ["autodocs"],
  parameters: { layout: "centered" },
  args: { text: thought },
  decorators: [
    (Story) => (
      <div className="w-96">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof ChatReasoning>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const Streaming: Story = { args: { streaming: true } };

export const WithDuration: Story = { args: { duration: 12, defaultOpen: true } };

export const WithIcon: Story = { args: { icon: <BrainIcon />, duration: 4 } };

export const StaysOpen: Story = { args: { streaming: false, defaultOpen: true } };
