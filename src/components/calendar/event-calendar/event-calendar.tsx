import { PlusIcon } from "lucide-react";
import { useEffect, useMemo, useRef, type MouseEvent, type ReactNode } from "react";

import { cn } from "../../../lib/cn";
import { useControlled } from "../../../lib/use-controlled";
import { useLostTranslation } from "../../../i18n/use-lost-translation";
import { Button } from "../../ui/button";
import { CalendarDateNav } from "../calendar-date-nav";
import { CalendarList } from "../calendar-list";
import { startOfDay, toCalendarEvent, visibleRange } from "../calendar-model/dates";
import { CalendarLocaleProvider } from "../calendar-model/locale";
import type {
  CalendarEvent,
  CalendarRange,
  CalendarSource,
  CalendarViewName,
  CalendarVisibleRange,
  EventAccessors,
  WeekStart,
} from "../calendar-model/types";
import { DayView } from "../day-view";
import { MonthView } from "../month-view";
import { WeekView } from "../week-view";

export type EventCalendarProps<T = CalendarEvent> = {
  /** Your own objects: tasks, appointments, posts, bookings. Say how to read them with `accessors`. */
  events: T[];
  /** Names the fields of `T` that give the id, title, start, end… Fields with the usual names need nothing. */
  accessors?: EventAccessors<T>;
  calendars?: CalendarSource[];
  view?: CalendarViewName;
  defaultView?: CalendarViewName;
  onViewChange?: (view: CalendarViewName) => void;
  /** The views of the switch, in order. One view hides the switch. */
  views?: CalendarViewName[];
  /** The day shown; the month, week or day that has it. */
  date?: Date;
  defaultDate?: Date;
  onDateChange?: (date: Date) => void;
  /** Called with the days on screen whenever the view or the date changes, and once at the start, so the app can load only those events. */
  onRangeChange?: (range: CalendarVisibleRange) => void;
  weekStartsOn?: WeekStart;
  /** The `Intl` locale for dates and times, e.g. `"pt-BR"`. Defaults to the language of the library. */
  locale?: string;
  /** Pixels per hour in the week and day views. */
  hourHeight?: number;
  /** The hour the week and day views are scrolled to when they open. */
  scrollToHour?: number;
  /** The step, in minutes, a click on an empty time snaps to. */
  snap?: number;
  /** How long, in minutes, a new event is: for a click on the week and day views and for the New event button. */
  defaultDuration?: number;
  /** How many events a day of the month shows before "N more". */
  maxMonthEvents?: number;
  /** Gets your own object back. */
  onEventClick?: (event: T, mouse: MouseEvent<HTMLButtonElement>) => void;
  /** The user picked a time or a day to create an event, by clicking an empty part or the "New event" button. */
  onCreate?: (range: CalendarRange) => void;
  /** A calendar was shown or hidden in the list. Adds the list at the side. */
  onCalendarToggle?: (id: string) => void;
  /** Adds a "new" button to the list of calendars. */
  onCalendarCreate?: () => void;
  /** Draws an event its own way; gets your object and its colour. */
  renderEvent?: (event: T, color: string) => ReactNode;
  /** Beside the "New event" button, at the end of the bar. */
  actions?: ReactNode;
  /** The moment taken as "now". Without it the clock is used. */
  now?: Date;
  className?: string;
};

/**
 * A calendar like Google Calendar: month, week and day views, previous / next / today, events of
 * several calendars that can be shown or hidden, and a click on an empty time to create an event.
 * It draws any kind of object (`events` + `accessors`), tells the app which days are on screen
 * (`onRangeChange`) and gives its own objects back. It fills its parent, so give the parent a
 * height. The app keeps the events, expands recurring ones and decides what a click does.
 */
export function EventCalendar<T = CalendarEvent>({
  events,
  accessors,
  calendars,
  view: viewProp,
  defaultView = "month",
  onViewChange,
  views,
  date: dateProp,
  defaultDate,
  onDateChange,
  onRangeChange,
  weekStartsOn = 0,
  locale,
  hourHeight,
  scrollToHour,
  snap,
  defaultDuration = 60,
  maxMonthEvents,
  onEventClick,
  onCreate,
  onCalendarToggle,
  onCalendarCreate,
  renderEvent,
  actions,
  now,
  className,
}: EventCalendarProps<T>) {
  const { t } = useLostTranslation();
  const [viewValue, setView] = useControlled<CalendarViewName>({
    value: viewProp,
    defaultValue: defaultView,
    onValueChange: onViewChange,
  });
  const [dateValue, setDate] = useControlled<Date>({
    value: dateProp,
    defaultValue: defaultDate ?? now ?? new Date(),
    onValueChange: onDateChange,
  });
  const view = viewValue ?? defaultView;
  const date = dateValue ?? new Date();

  const range = useMemo(() => visibleRange(view, date, weekStartsOn), [view, date, weekStartsOn]);
  const reported = useRef(onRangeChange);
  reported.current = onRangeChange;
  useEffect(
    () => reported.current?.(range),
    [range.view, range.start.getTime(), range.end.getTime()],
  );

  const visible = useMemo(() => {
    const hidden = new Set(
      (calendars ?? []).filter((calendar) => calendar.visible === false).map(({ id }) => id),
    );
    return events
      .map((item) => toCalendarEvent(item, accessors))
      .filter((event) => !event.calendarId || !hidden.has(event.calendarId));
  }, [events, accessors, calendars]);

  const goToDay = (day: Date) => {
    setDate(day);
    setView("day");
  };

  const newEvent = () => {
    const start = new Date(date);
    start.setHours(Math.max(new Date().getHours() + 1, 8), 0, 0, 0);
    onCreate?.({ start, end: new Date(start.getTime() + defaultDuration * 60_000), allDay: false });
  };

  const original = (event: CalendarEvent<T>) => event.data as T;
  const shared = {
    events: visible,
    calendars,
    onEventClick:
      onEventClick &&
      ((event: CalendarEvent<T>, mouse: MouseEvent<HTMLButtonElement>) =>
        onEventClick(original(event), mouse)),
    onCreate,
    renderEvent:
      renderEvent &&
      ((event: CalendarEvent<T>, color: string) => renderEvent(original(event), color)),
    now,
  };
  const grid = { hourHeight, scrollToHour, snap, defaultDuration, onDayClick: goToDay };

  const calendar = (
    <div
      data-slot="event-calendar"
      aria-label={t("calendar.label")}
      className={cn("flex h-full min-h-0 flex-col gap-3", className)}
    >
      <CalendarDateNav
        date={date}
        view={view}
        views={views}
        weekStartsOn={weekStartsOn}
        onDateChange={setDate}
        onViewChange={setView}
        actions={
          (onCreate || actions) && (
            <>
              {actions}
              {onCreate && (
                <Button type="button" onClick={newEvent}>
                  <PlusIcon aria-hidden="true" />
                  {t("calendar.newEvent")}
                </Button>
              )}
            </>
          )
        }
      />
      <div className="flex min-h-0 flex-1 gap-4">
        {calendars && onCalendarToggle && (
          <aside className="hidden w-48 shrink-0 lg:block">
            <CalendarList
              calendars={calendars}
              onToggle={onCalendarToggle}
              onCreate={onCalendarCreate}
            />
          </aside>
        )}
        <div className="flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden rounded-lg border">
          {view === "month" && (
            <MonthView<T>
              {...shared}
              date={date}
              weekStartsOn={weekStartsOn}
              maxEvents={maxMonthEvents}
              onDayClick={goToDay}
              onCreate={
                onCreate &&
                ((picked) =>
                  onCreate({
                    ...picked,
                    start: startOfDay(picked.start),
                    end: startOfDay(picked.end),
                  }))
              }
            />
          )}
          {view === "week" && (
            <WeekView<T> {...shared} {...grid} date={date} weekStartsOn={weekStartsOn} />
          )}
          {view === "day" && <DayView<T> {...shared} {...grid} date={date} />}
        </div>
      </div>
    </div>
  );

  return locale ? (
    <CalendarLocaleProvider value={locale}>{calendar}</CalendarLocaleProvider>
  ) : (
    calendar
  );
}
