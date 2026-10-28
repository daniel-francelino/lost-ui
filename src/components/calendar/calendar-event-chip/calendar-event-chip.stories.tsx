import type { Meta, StoryObj } from "@storybook/react-vite";
import { fn } from "storybook/test";

import { CalendarEventChip } from "./calendar-event-chip";

const timed = {
  id: "a",
  title: "Design review",
  start: new Date(2026, 9, 28, 10),
  end: new Date(2026, 9, 28, 11, 30),
  location: "Room 2",
};

const meta = {
  title: "Calendar/CalendarEventChip",
  component: CalendarEventChip,
  tags: ["autodocs"],
  parameters: { layout: "centered" },
  args: { event: timed, onClick: fn() },
  decorators: [
    (Story) => (
      <div className="h-24 w-56">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof CalendarEventChip>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const WithTime: Story = { args: { showTime: true } };

export const Block: Story = { args: { variant: "block" } };

export const AllDay: Story = { args: { event: { ...timed, allDay: true }, showTime: true } };

export const Coloured: Story = { args: { color: "var(--success)" } };

export const WithoutTitle: Story = { args: { event: { ...timed, title: " " } } };
