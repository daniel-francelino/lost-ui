import type { CalendarEvent, CalendarSource } from "./calendar-model";

/** Wednesday 28 October 2026, 10:30: the moment every story and test takes as "now". */
export const now = new Date(2026, 9, 28, 10, 30);

export const calendars: CalendarSource[] = [
  { id: "work", name: "Work", color: "var(--info)" },
  { id: "personal", name: "Personal", color: "var(--success)" },
  { id: "campaign", name: "Campaigns", color: "var(--primary)" },
];

const at = (day: number, hour: number, minute = 0) => new Date(2026, 9, day, hour, minute);

export const events: CalendarEvent[] = [
  {
    id: "standup",
    title: "Team standup",
    start: at(26, 9),
    end: at(26, 9, 30),
    calendarId: "work",
  },
  {
    id: "review",
    title: "Design review",
    start: at(28, 10),
    end: at(28, 11, 30),
    calendarId: "work",
    location: "Room 2",
  },
  {
    id: "lunch",
    title: "Lunch with Ana",
    start: at(28, 10, 30),
    end: at(28, 11, 30),
    calendarId: "personal",
  },
  {
    id: "gym",
    title: "Gym",
    start: at(28, 18),
    end: at(28, 19),
    calendarId: "personal",
  },
  {
    id: "launch",
    title: "Launch day",
    start: at(29, 0),
    end: at(29, 0),
    allDay: true,
    calendarId: "campaign",
  },
  {
    id: "shoot",
    title: "Photo shoot",
    start: at(30, 14),
    end: at(30, 17),
    calendarId: "work",
  },
];

/** Five more on the 28th, so a day of the month has more than it can show. */
export const busyDay: CalendarEvent[] = [
  ...events,
  ...Array.from({ length: 3 }, (_, index) => ({
    id: `extra-${index}`,
    title: `Extra ${index + 1}`,
    start: at(28, 12 + index),
    end: at(28, 13 + index),
    calendarId: "work",
  })),
];
