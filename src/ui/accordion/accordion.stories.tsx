import type { Meta, StoryObj } from "@storybook/react-vite";

import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "./accordion";

const meta = {
  title: "UI/Accordion",
  component: Accordion,
  tags: ["autodocs"],
  parameters: { layout: "centered" },
} satisfies Meta<typeof Accordion>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { type: "single", collapsible: true, className: "w-80" },
  render: (args) => (
    <Accordion {...args}>
      <AccordionItem value="item-1">
        <AccordionTrigger>Is it accessible?</AccordionTrigger>
        <AccordionContent>Yes. It follows the WAI-ARIA pattern.</AccordionContent>
      </AccordionItem>
      <AccordionItem value="item-2">
        <AccordionTrigger>Is it styled?</AccordionTrigger>
        <AccordionContent>Yes. It uses the theme tokens.</AccordionContent>
      </AccordionItem>
    </Accordion>
  ),
};
