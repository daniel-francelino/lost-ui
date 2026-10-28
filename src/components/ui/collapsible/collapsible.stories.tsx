import type { Meta, StoryObj } from "@storybook/react-vite";
import { Button } from "../button";

import { Collapsible, CollapsibleTrigger, CollapsibleContent } from "./collapsible";

const meta = {
  title: "UI/Collapsible",
  component: Collapsible,
  tags: ["autodocs"],
  parameters: { layout: "centered" },
} satisfies Meta<typeof Collapsible>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { className: "w-72" },
  render: (args) => (
    <Collapsible {...args}>
      <CollapsibleTrigger asChild>
        <Button variant="outline">Toggle details</Button>
      </CollapsibleTrigger>
      <CollapsibleContent className="pt-2 text-sm">Hidden details</CollapsibleContent>
    </Collapsible>
  ),
};
