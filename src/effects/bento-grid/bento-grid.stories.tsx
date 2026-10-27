import type { Meta, StoryObj } from "@storybook/react-vite";
import { BellIcon, CalendarIcon, FileTextIcon } from "lucide-react";

import { BentoGrid, BentoCard } from "./bento-grid";

const meta = {
  title: "Effects/Cards/BentoGrid",
  component: BentoGrid,
  tags: ["autodocs"],
  parameters: { layout: "padded" },
} satisfies Meta<typeof BentoGrid>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { children: null },
  render: () => (
    <BentoGrid className="lg:grid-rows-2">
      {[
        {
          Icon: FileTextIcon,
          name: "Save your files",
          description: "We automatically save your files as you type.",
          className: "lg:col-span-2",
        },
        {
          Icon: BellIcon,
          name: "Notifications",
          description: "Get notified when something happens.",
          className: "lg:col-span-1",
        },
        {
          Icon: CalendarIcon,
          name: "Calendar",
          description: "Use the calendar to filter your files by date.",
          className: "lg:col-span-3",
        },
      ].map((feature) => (
        <BentoCard
          key={feature.name}
          {...feature}
          href="#"
          cta="Learn more"
          background={<div className="absolute inset-0 bg-muted/40" />}
        />
      ))}
    </BentoGrid>
  ),
};
