import type { Meta, StoryObj } from "@storybook/react-vite";

import { ScrollArea } from "./scroll-area";

const meta = {
  title: "UI/ScrollArea",
  component: ScrollArea,
  tags: ["autodocs"],
  parameters: { layout: "centered" },
} satisfies Meta<typeof ScrollArea>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {},
  render: (args) => (
    <ScrollArea {...args} className="h-48 w-56 rounded-md border">
      <div className="p-4">
        {Array.from({ length: 20 }, (_, index) => (
          <div key={index} className="py-1 text-sm">
            Item {index + 1}
          </div>
        ))}
      </div>
    </ScrollArea>
  ),
};
