import type { Meta, StoryObj } from "@storybook/react-vite";
import { fn } from "storybook/test";

import { busyDay, calendars, events, now } from "../calendar.fixtures";
import { MonthView } from "./month-view";

const meta = {
  title: "Calendar/MonthView",
  component: MonthView,
  tags: ["autodocs"],
  parameters: { layout: "fullscreen" },
  args: {
    date: now,
    now,
    events,
    calendars,
    onEventClick: fn(),
    onDayClick: fn(),
    onCreate: fn(),
  },
  decorators: [
    (Story) => (
      <div className="flex h-[40rem] flex-col">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof MonthView>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const BusyDay: Story = { args: { events: busyDay, maxEvents: 2 } };

export const MondayFirst: Story = { args: { weekStartsOn: 1 } };

export const Empty: Story = { args: { events: [] } };

export const CustomEvents: Story = {
  args: {
    renderEvent: (event, color) => (
      <span className="block truncate text-xs" style={{ color }}>
        ● {event.title}
      </span>
    ),
  },
};
