import type { Meta, StoryObj } from "@storybook/react-vite";
import { SearchIcon } from "lucide-react";

import { Button } from "../../ui/button";
import { ChatTool } from "./chat-tool";

const meta = {
  title: "AI chat/ChatTool",
  component: ChatTool,
  tags: ["autodocs"],
  parameters: { layout: "centered" },
  args: { text: "Lint checks completed" },
  decorators: [
    (Story) => (
      <div className="w-96">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof ChatTool>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const WithOutput: Story = {
  args: {
    children: <pre className="whitespace-pre-wrap">{"✓ 24 files checked\n✓ 0 problems"}</pre>,
  },
};

export const Running: Story = { args: { text: "Running lint checks", loading: true } };

export const Streaming: Story = { args: { text: "Searching components", streaming: true } };

export const Failed: Story = {
  args: { text: "Lint checks failed", error: true, children: <pre>{"3 problems found"}</pre> },
};

export const WithSuffix: Story = {
  args: { text: "Searched the web", suffix: "“launch campaign ideas”", icon: <SearchIcon /> },
};

export const Card: Story = {
  args: {
    variant: "card",
    text: "Publish to Instagram",
    children: <pre>{"3 posts will be scheduled"}</pre>,
    actions: (
      <>
        <Button size="sm">Approve</Button>
        <Button size="sm" variant="outline">
          Deny
        </Button>
      </>
    ),
  },
};
