import type { Meta, StoryObj } from "@storybook/react-vite";
import { CalendarIcon, LightbulbIcon } from "lucide-react";
import { fn } from "storybook/test";

import { ChatSuggestions } from "./chat-suggestions";

const meta = {
  title: "AI chat/ChatSuggestions",
  component: ChatSuggestions,
  tags: ["autodocs"],
  parameters: { layout: "centered" },
  args: {
    onSelect: fn(),
    suggestions: [
      "Plan a launch campaign",
      "Write three captions for Instagram",
      "Summarise last month's results",
    ],
  },
} satisfies Meta<typeof ChatSuggestions>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const Grid: Story = {
  args: {
    layout: "grid",
    className: "w-[28rem]",
    suggestions: [
      { label: "Plan a launch campaign", icon: <CalendarIcon /> },
      { label: "Give me content ideas for a bakery", icon: <LightbulbIcon /> },
      "Write three captions for Instagram",
      "Summarise last month's results",
    ],
  },
};

export const WithAnotherValue: Story = {
  args: {
    suggestions: [{ label: "Ideas", value: "Give me five content ideas for this week" }],
  },
};

export const Disabled: Story = { args: { disabled: true } };
