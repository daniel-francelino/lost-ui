import type { Meta, StoryObj } from "@storybook/react-vite";
import { fn } from "storybook/test";

import { calendars, events, now } from "../calendar.fixtures";
import { DayView } from "./day-view";

const meta = {
  title: "Calendar/DayView",
  component: DayView,
  tags: ["autodocs"],
  parameters: { layout: "fullscreen" },
  args: {
    date: now,
    now,
    events,
    calendars,
    scrollToHour: 7,
    onEventClick: fn(),
    onCreate: fn(),
  },
  decorators: [
    (Story) => (
      <div className="flex h-[36rem] flex-col">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof DayView>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const AllDayEvent: Story = { args: { date: new Date(2026, 9, 29) } };

export const NoEvents: Story = { args: { date: new Date(2026, 9, 31) } };
