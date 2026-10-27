import type { Meta, StoryObj } from "@storybook/react-vite";

import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from "./resizable";

const meta = {
  title: "UI/Resizable",
  component: ResizablePanelGroup,
  tags: ["autodocs"],
  parameters: { layout: "centered" },
} satisfies Meta<typeof ResizablePanelGroup>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { orientation: "horizontal", className: "h-40 w-96 rounded-lg border" },
  render: (args) => (
    <ResizablePanelGroup {...args}>
      <ResizablePanel defaultSize={50}>
        <div className="flex h-full items-center justify-center p-4 text-sm">One</div>
      </ResizablePanel>
      <ResizableHandle withHandle />
      <ResizablePanel defaultSize={50}>
        <div className="flex h-full items-center justify-center p-4 text-sm">Two</div>
      </ResizablePanel>
    </ResizablePanelGroup>
  ),
};
