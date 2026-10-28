import { useMemo, type MouseEvent, type ReactNode } from "react";

import { cn } from "../../../lib/cn";
import { useLostTranslation } from "../../../i18n/use-lost-translation";
import { CalendarEventChip } from "../calendar-event-chip";
import {
  byStart,
  eventsOnDay,
  isSameDay,
  monthGrid,
  normalizeEvent,
  startOfDay,
} from "../calendar-model/dates";
import {
  calendarLocale,
  eventColor,
  formatShortDate,
  formatWeekday,
} from "../calendar-model/format";
import type {
  CalendarEvent,
  CalendarRange,
  CalendarSource,
  WeekStart,
} from "../calendar-model/types";

export type MonthViewProps = {
  /** Any day of the month to show. */
  date: Date;
  events: CalendarEvent[];
  calendars?: CalendarSource[];
  weekStartsOn?: WeekStart;
  /** How many events a day shows before "N more". */
  maxEvents?: number;
  onEventClick?: (event: CalendarEvent, mouse: MouseEvent<HTMLButtonElement>) => void;
  /** The number of a day, or "N more", was clicked: usually goes to that day. */
  onDayClick?: (date: Date) => void;
  /** An empty part of a day was clicked: whole-day range of that day. */
  onCreate?: (range: CalendarRange) => void;
  /** Draws an event its own way. */
  renderEvent?: (event: CalendarEvent, color: string) => ReactNode;
  /** The moment taken as "now", to mark today. Defaults to the clock. */
  now?: Date;
  className?: string;
};

/** A month as six weeks of days, each with its events as chips. */
export function MonthView({
  date,
  events,
  calendars,
  weekStartsOn = 0,
  maxEvents = 3,
  onEventClick,
  onDayClick,
  onCreate,
  renderEvent,
  now = new Date(),
  className,
}: MonthViewProps) {
  const { t, language } = useLostTranslation();
  const locale = calendarLocale(language);
  const days = useMemo(() => monthGrid(date, weekStartsOn), [date, weekStartsOn]);
  const normalized = useMemo(() => events.map(normalizeEvent).sort(byStart), [events]);
  const weeks = Array.from({ length: 6 }, (_, week) => days.slice(week * 7, week * 7 + 7));

  return (
    <div
      data-slot="month-view"
      role="grid"
      aria-label={t("calendar.month")}
      className={cn("flex min-h-0 flex-1 flex-col", className)}
    >
      <div role="row" className="grid grid-cols-7 border-b">
        {weeks[0]!.map((day) => (
          <div
            key={day.getDay()}
            role="columnheader"
            className="px-2 py-1.5 text-center text-xs font-medium text-muted-foreground uppercase"
          >
            {formatWeekday(day, locale)}
          </div>
        ))}
      </div>
      <div className="grid min-h-0 flex-1 grid-rows-6">
        {weeks.map((week) => (
          <div key={week[0]!.getTime()} role="row" className="grid grid-cols-7 border-b last:border-b-0">
            {week.map((day) => {
              const inMonth = day.getMonth() === date.getMonth();
              const today = isSameDay(day, now);
              const dayEvents = eventsOnDay(normalized, day);
              const shown = dayEvents.slice(0, maxEvents);
              const hidden = dayEvents.length - shown.length;
              return (
                <div
                  key={day.getTime()}
                  role="gridcell"
                  aria-label={formatShortDate(day, locale)}
                  data-today={today ? "" : undefined}
                  data-outside={inMonth ? undefined : ""}
                  onClick={() =>
                    onCreate?.({ start: startOfDay(day), end: startOfDay(day), allDay: true })
                  }
                  className={cn(
                    "flex min-h-0 min-w-0 flex-col gap-0.5 overflow-hidden border-r p-1 last:border-r-0",
                    !inMonth && "bg-muted/40 text-muted-foreground",
                    onCreate && "cursor-pointer",
                  )}
                >
                  <button
                    type="button"
                    aria-label={t("calendar.goToDay", { date: formatShortDate(day, locale) })}
                    onClick={(mouse) => {
                      mouse.stopPropagation();
                      onDayClick?.(day);
                    }}
                    className={cn(
                      "flex size-6 items-center justify-center self-start rounded-full text-xs outline-none hover:bg-accent focus-visible:ring-[3px] focus-visible:ring-ring/50",
                      today && "bg-primary font-semibold text-primary-foreground hover:bg-primary/90",
                    )}
                  >
                    {day.getDate()}
                  </button>
                  {shown.map((event) =>
                    renderEvent ? (
                      <div key={event.id}>{renderEvent(event, eventColor(event, calendars))}</div>
                    ) : (
                      <CalendarEventChip
                        key={event.id}
                        event={event}
                        color={eventColor(event, calendars)}
                        showTime={!event.allDay}
                        onClick={onEventClick}
                      />
                    ),
                  )}
                  {hidden > 0 && (
                    <button
                      type="button"
                      onClick={(mouse) => {
                        mouse.stopPropagation();
                        onDayClick?.(day);
                      }}
                      className="px-1.5 text-left text-xs text-muted-foreground outline-none hover:text-foreground focus-visible:ring-[3px] focus-visible:ring-ring/50"
                    >
                      {t("calendar.moreEvents", { count: hidden })}
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}
