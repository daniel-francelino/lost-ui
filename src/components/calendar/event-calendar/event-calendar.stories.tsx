import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { fn } from "storybook/test";

import { calendars as sampleCalendars, events, now } from "../calendar.fixtures";
import { EventCalendar } from "./event-calendar";

const meta = {
  title: "Calendar/EventCalendar",
  component: EventCalendar,
  tags: ["autodocs"],
  parameters: { layout: "fullscreen" },
  args: {
    events,
    calendars: sampleCalendars,
    now,
    defaultDate: now,
    onEventClick: fn(),
    onCreate: fn(),
    onViewChange: fn(),
    onDateChange: fn(),
  },
  decorators: [
    (Story) => (
      <div className="h-dvh p-4">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof EventCalendar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const Week: Story = { args: { defaultView: "week" } };

export const Day: Story = { args: { defaultView: "day" } };

export const WithCalendarList: Story = {
  args: { onCalendarToggle: fn(), onCalendarCreate: fn() },
};

export const ToggleCalendars: Story = {
  render: (args) => {
    const [list, setList] = useState(sampleCalendars);
    return (
      <EventCalendar
        {...args}
        calendars={list}
        onCalendarToggle={(id) =>
          setList((all) =>
            all.map((calendar) =>
              calendar.id === id ? { ...calendar, visible: calendar.visible === false } : calendar,
            ),
          )
        }
      />
    );
  },
};

export const MondayFirst: Story = { args: { weekStartsOn: 1 } };

export const ReadOnly: Story = { args: { onCreate: undefined } };

type Booking = {
  code: string;
  guest: string;
  from: string;
  to: string;
  room: string;
  vip: boolean;
};

const bookings: Booking[] = [
  {
    code: "B1",
    guest: "Ana Lima",
    from: "2026-10-28T09:00:00",
    to: "2026-10-28T10:30:00",
    room: "A1",
    vip: true,
  },
  {
    code: "B2",
    guest: "Bruno Reis",
    from: "2026-10-28T09:30:00",
    to: "2026-10-28T11:00:00",
    room: "B2",
    vip: false,
  },
  {
    code: "B3",
    guest: "Carla Dias",
    from: "2026-10-30T15:00:00",
    to: "2026-10-30T16:00:00",
    room: "A1",
    vip: false,
  },
];

/** Any object can be an event: say which fields hold what, or give a function. */
export const OwnObjects: StoryObj<typeof EventCalendar<Booking>> = {
  args: {
    events: bookings,
    calendars: undefined,
    defaultView: "week",
    accessors: {
      id: "code",
      title: (booking: Booking) => `${booking.guest} · ${booking.room}`,
      start: "from",
      end: "to",
      color: (booking: Booking) => (booking.vip ? "var(--warning)" : "var(--info)"),
    },
    onEventClick: fn(),
  },
};

export const PortugueseDatesAndHalfHours: Story = {
  args: { locale: "pt-BR", defaultView: "week", snap: 30, defaultDuration: 30 },
};

export const OnlyWeekAndDay: Story = { args: { views: ["week", "day"], defaultView: "week" } };

export const LoadingByRange: Story = {
  args: { onRangeChange: fn() },
};
