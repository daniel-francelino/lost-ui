import type { CalendarDate, CalendarEvent, NormalizedEvent, WeekStart } from "./types";

export const MINUTES_PER_DAY = 1440;

export const toDate = (value: CalendarDate): Date =>
  value instanceof Date ? value : new Date(value);

export function normalizeEvent(event: CalendarEvent): NormalizedEvent {
  const start = toDate(event.start);
  const end = toDate(event.end);
  return { ...event, start, end: end < start ? start : end };
}

export const startOfDay = (date: Date): Date =>
  new Date(date.getFullYear(), date.getMonth(), date.getDate());

export const addDays = (date: Date, days: number): Date =>
  new Date(
    date.getFullYear(),
    date.getMonth(),
    date.getDate() + days,
    date.getHours(),
    date.getMinutes(),
  );

/** Adds months, keeping the day when the month has it and the last day when it has not (31 Jan + 1 month = 28 Feb). */
export function addMonths(date: Date, months: number): Date {
  const first = new Date(
    date.getFullYear(),
    date.getMonth() + months,
    1,
    date.getHours(),
    date.getMinutes(),
  );
  const last = new Date(first.getFullYear(), first.getMonth() + 1, 0).getDate();
  first.setDate(Math.min(date.getDate(), last));
  return first;
}

export const startOfMonth = (date: Date): Date => new Date(date.getFullYear(), date.getMonth(), 1);

export function startOfWeek(date: Date, weekStartsOn: WeekStart = 0): Date {
  const day = startOfDay(date);
  return addDays(day, -((day.getDay() - weekStartsOn + 7) % 7));
}

export const isSameDay = (a: Date, b: Date): boolean =>
  a.getFullYear() === b.getFullYear() &&
  a.getMonth() === b.getMonth() &&
  a.getDate() === b.getDate();

export const isToday = (date: Date, now: Date = new Date()): boolean => isSameDay(date, now);

/** The seven days of the week that has `date`. */
export const weekDays = (date: Date, weekStartsOn: WeekStart = 0): Date[] =>
  Array.from({ length: 7 }, (_, index) => addDays(startOfWeek(date, weekStartsOn), index));

/** The six weeks (42 days) that show a month, from the first day of the week of the 1st. */
export function monthGrid(date: Date, weekStartsOn: WeekStart = 0): Date[] {
  const first = startOfWeek(startOfMonth(date), weekStartsOn);
  return Array.from({ length: 42 }, (_, index) => addDays(first, index));
}

export const minutesOfDay = (date: Date): number => date.getHours() * 60 + date.getMinutes();

/** The date at `minutes` from the start of `day`. */
export const atMinutes = (day: Date, minutes: number): Date =>
  new Date(day.getFullYear(), day.getMonth(), day.getDate(), 0, Math.round(minutes));

export const snapMinutes = (minutes: number, step = 15): number =>
  Math.round(minutes / step) * step;

/** Does the event touch this day? A day-long event ends at the start of the day it ends on, so it counts that day. */
export function eventOnDay(event: NormalizedEvent, day: Date): boolean {
  const from = startOfDay(day);
  const to = addDays(from, 1);
  if (event.allDay) return startOfDay(event.start) <= from && startOfDay(event.end) >= from;
  const end = event.end > event.start ? event.end : new Date(event.start.getTime() + 1);
  return event.start < to && end > from;
}

export const eventsOnDay = (events: NormalizedEvent[], day: Date): NormalizedEvent[] =>
  events.filter((event) => eventOnDay(event, day));

/** Sorts by start, then longest first, so the chips of a day read in order. */
export const byStart = (a: NormalizedEvent, b: NormalizedEvent): number =>
  a.start.getTime() - b.start.getTime() || b.end.getTime() - a.end.getTime();
