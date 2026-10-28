import { PlusIcon } from "lucide-react";
import { useMemo, type MouseEvent, type ReactNode } from "react";

import { cn } from "../../../lib/cn";
import { useControlled } from "../../../lib/use-controlled";
import { useLostTranslation } from "../../../i18n/use-lost-translation";
import { Button } from "../../ui/button";
import { CalendarDateNav } from "../calendar-date-nav";
import { CalendarList } from "../calendar-list";
import { startOfDay } from "../calendar-model/dates";
import type {
  CalendarEvent,
  CalendarRange,
  CalendarSource,
  CalendarViewName,
  WeekStart,
} from "../calendar-model/types";
import { DayView } from "../day-view";
import { MonthView } from "../month-view";
import { WeekView } from "../week-view";

export type EventCalendarProps = {
  events: CalendarEvent[];
  calendars?: CalendarSource[];
  view?: CalendarViewName;
  defaultView?: CalendarViewName;
  onViewChange?: (view: CalendarViewName) => void;
  /** The day shown; the month, week or day that has it. */
  date?: Date;
  defaultDate?: Date;
  onDateChange?: (date: Date) => void;
  weekStartsOn?: WeekStart;
  /** Pixels per hour in the week and day views. */
  hourHeight?: number;
  /** The hour the week and day views are scrolled to when they open. */
  scrollToHour?: number;
  /** How many events a day of the month shows before "N more". */
  maxMonthEvents?: number;
  onEventClick?: (event: CalendarEvent, mouse: MouseEvent<HTMLButtonElement>) => void;
  /** The user picked a time or a day to create an event, by clicking an empty part or the "New event" button. */
  onCreate?: (range: CalendarRange) => void;
  /** A calendar was shown or hidden in the list. Adds the list at the side. */
  onCalendarToggle?: (id: string) => void;
  /** Adds a "new" button to the list of calendars. */
  onCalendarCreate?: () => void;
  renderEvent?: (event: CalendarEvent, color: string) => ReactNode;
  /** The moment taken as "now". Without it the clock is used. */
  now?: Date;
  className?: string;
};

/**
 * A calendar like Google Calendar: month, week and day views, previous / next / today, events of
 * several calendars that can be shown or hidden, and a click on an empty time to create an event.
 * It fills its parent, so give the parent a height. It draws events it is given; the app keeps
 * them, expands recurring ones and decides what a click does.
 */
export function EventCalendar({
  events,
  calendars,
  view: viewProp,
  defaultView = "month",
  onViewChange,
  date: dateProp,
  defaultDate,
  onDateChange,
  weekStartsOn = 0,
  hourHeight,
  scrollToHour,
  maxMonthEvents,
  onEventClick,
  onCreate,
  onCalendarToggle,
  onCalendarCreate,
  renderEvent,
  now,
  className,
}: EventCalendarProps) {
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

  const visible = useMemo(() => {
    const hidden = new Set(
      (calendars ?? []).filter((calendar) => calendar.visible === false).map(({ id }) => id),
    );
    return events.filter((event) => !event.calendarId || !hidden.has(event.calendarId));
  }, [events, calendars]);

  const goToDay = (day: Date) => {
    setDate(day);
    setView("day");
  };

  const newEvent = () => {
    const start = new Date(date);
    start.setHours(Math.max(new Date().getHours() + 1, 8), 0, 0, 0);
    onCreate?.({ start, end: new Date(start.getTime() + 3_600_000), allDay: false });
  };

  const shared = { events: visible, calendars, onEventClick, onCreate, renderEvent, now };
  const grid = { hourHeight, scrollToHour, onDayClick: goToDay };

  return (
    <div
      data-slot="event-calendar"
      aria-label={t("calendar.label")}
      className={cn("flex h-full min-h-0 flex-col gap-3", className)}
    >
      <CalendarDateNav
        date={date}
        view={view}
        weekStartsOn={weekStartsOn}
        onDateChange={setDate}
        onViewChange={setView}
        actions={
          onCreate && (
            <Button type="button" onClick={newEvent}>
              <PlusIcon aria-hidden="true" />
              {t("calendar.newEvent")}
            </Button>
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
            <MonthView
              {...shared}
              date={date}
              weekStartsOn={weekStartsOn}
              maxEvents={maxMonthEvents}
              onDayClick={goToDay}
              onCreate={
                onCreate &&
                ((range) =>
                  onCreate({
                    ...range,
                    start: startOfDay(range.start),
                    end: startOfDay(range.end),
                  }))
              }
            />
          )}
          {view === "week" && (
            <WeekView {...shared} {...grid} date={date} weekStartsOn={weekStartsOn} />
          )}
          {view === "day" && <DayView {...shared} {...grid} date={date} />}
        </div>
      </div>
    </div>
  );
}
