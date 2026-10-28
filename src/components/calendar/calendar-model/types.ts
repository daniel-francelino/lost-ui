/** A date as a `Date` or as an ISO string (`"2026-10-28T14:00:00"`). */
export type CalendarDate = Date | string;

export type CalendarEvent<T = unknown> = {
  id: string;
  title: string;
  start: CalendarDate;
  /** Where it ends. A day-long event ends the same day or on its last day. */
  end: CalendarDate;
  /** Day-long: drawn in the all-day row and as a chip in the month, with no time. */
  allDay?: boolean;
  /** The calendar the event belongs to; it gives the colour when the event has none. */
  calendarId?: string;
  /** Any CSS colour or token, e.g. `"var(--info)"`. */
  color?: string;
  location?: string;
  description?: string;
  /** The object the event was made from, handed back to the handlers. */
  data?: T;
};

/** A calendar the user can show or hide: "Work", "Personal". */
export type CalendarSource = {
  id: string;
  name: string;
  color?: string;
  /** Defaults to true. */
  visible?: boolean;
};

export type CalendarViewName = "month" | "week" | "day";

/** What the user picked to create: a time range, or whole days. */
export type CalendarRange = { start: Date; end: Date; allDay: boolean };

/** An event with its dates as `Date`s, as the views use it. */
export type NormalizedEvent<T = unknown> = Omit<CalendarEvent<T>, "start" | "end"> & {
  start: Date;
  end: Date;
};

/** An event of a time grid, with where it sits in the day and in its column. */
export type PositionedEvent<T = unknown> = {
  event: NormalizedEvent<T>;
  /** Minutes from the start of the day. */
  top: number;
  /** Minutes it lasts, at least 15. */
  height: number;
  /** 0 to 1: how far from the left of the day column it starts. */
  left: number;
  /** 0 to 1: how much of the width of the day column it takes. */
  width: number;
};

export type WeekStart = 0 | 1 | 2 | 3 | 4 | 5 | 6;

/** The part of an object that gives a field of an event: its name, or a function that reads it. */
export type EventAccessor<T, V> = (keyof T & string) | ((item: T) => V);

/** How to read an event out of any object: name the fields or give a function for each. Fields not named are read by their own name (`id`, `title`, `start`, `end`…). */
export type EventAccessors<T> = {
  id?: EventAccessor<T, string>;
  title?: EventAccessor<T, string>;
  start?: EventAccessor<T, CalendarDate>;
  end?: EventAccessor<T, CalendarDate>;
  allDay?: EventAccessor<T, boolean | undefined>;
  calendarId?: EventAccessor<T, string | undefined>;
  color?: EventAccessor<T, string | undefined>;
  location?: EventAccessor<T, string | undefined>;
};

/** The days a calendar shows: from the first to the day after the last. Apps load events for it. */
export type CalendarVisibleRange = { start: Date; end: Date; view: CalendarViewName };
