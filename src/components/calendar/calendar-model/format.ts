import { addDays, startOfWeek } from "./dates";
import type { CalendarEvent, CalendarSource, WeekStart } from "./types";

const locales: Record<string, string> = { en: "en-US", es: "es-ES", pt: "pt-BR" };

/** The `Intl` locale of a language of the library: `pt` and `pt-BR` give `pt-BR`. */
export const calendarLocale = (language: string): string =>
  locales[language.slice(0, 2).toLowerCase()] ?? "en-US";

const text = (locale: string, options: Intl.DateTimeFormatOptions, date: Date) =>
  new Intl.DateTimeFormat(locale, options).format(date);

/** "October 2026" */
export const formatMonthTitle = (date: Date, locale: string) =>
  text(locale, { month: "long", year: "numeric" }, date);

/** "Wednesday, 28 October 2026" */
export const formatDayTitle = (date: Date, locale: string) =>
  text(locale, { weekday: "long", day: "numeric", month: "long", year: "numeric" }, date);

/** "25 – 31 Oct 2026", or "26 Oct – 1 Nov 2026" when the week crosses a month. */
export function formatWeekTitle(date: Date, locale: string, weekStartsOn: WeekStart = 0): string {
  const first = startOfWeek(date, weekStartsOn);
  const last = addDays(first, 6);
  if (first.getMonth() === last.getMonth() && first.getFullYear() === last.getFullYear()) {
    return `${text(locale, { day: "numeric" }, first)} – ${text(locale, { day: "numeric", month: "short", year: "numeric" }, last)}`;
  }
  return `${text(locale, { day: "numeric", month: "short" }, first)} – ${text(locale, { day: "numeric", month: "short", year: "numeric" }, last)}`;
}

/** "Wed" */
export const formatWeekday = (date: Date, locale: string) =>
  text(locale, { weekday: "short" }, date);

/** "2:30 PM" or "14:30", as the locale writes it. */
export const formatTime = (date: Date, locale: string) =>
  text(locale, { hour: "numeric", minute: "2-digit" }, date);

/** "2 PM" or "14:00" for the hour column. */
export const formatHour = (hour: number, locale: string) =>
  text(locale, { hour: "numeric" }, new Date(2000, 0, 1, hour));

/** "28 Oct 2026" */
export const formatShortDate = (date: Date, locale: string) =>
  text(locale, { day: "numeric", month: "short", year: "numeric" }, date);

/** The colour of an event: its own, its calendar's, or the primary. */
export function eventColor(event: CalendarEvent, calendars: CalendarSource[] = []): string {
  return (
    event.color ??
    calendars.find((calendar) => calendar.id === event.calendarId)?.color ??
    "var(--primary)"
  );
}
