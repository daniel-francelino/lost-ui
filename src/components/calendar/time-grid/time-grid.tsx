import { useEffect, useMemo, useRef, useState, type MouseEvent, type ReactNode } from "react";

import { cn } from "../../../lib/cn";
import { useLostTranslation } from "../../../i18n/use-lost-translation";
import { CalendarEventChip } from "../calendar-event-chip";
import {
  atMinutes,
  byStart,
  eventsOnDay,
  isSameDay,
  minutesOfDay,
  normalizeEvent,
  snapMinutes,
} from "../calendar-model/dates";
import {
  calendarLocale,
  eventColor,
  formatHour,
  formatShortDate,
  formatWeekday,
} from "../calendar-model/format";
import { layoutTimedEvents } from "../calendar-model/layout";
import type { CalendarEvent, CalendarRange, CalendarSource } from "../calendar-model/types";

export type TimeGridProps = {
  /** The days to draw as columns: seven for a week, one for a day. */
  days: Date[];
  events: CalendarEvent[];
  calendars?: CalendarSource[];
  /** Pixels per hour: the zoom of the grid. */
  hourHeight?: number;
  /** The hour the grid is scrolled to when it opens. */
  scrollToHour?: number;
  onEventClick?: (event: CalendarEvent, mouse: MouseEvent<HTMLButtonElement>) => void;
  onDayClick?: (date: Date) => void;
  /** An empty part of the grid was clicked: one hour from that time, snapped to 15 minutes. */
  onCreate?: (range: CalendarRange) => void;
  renderEvent?: (event: CalendarEvent, color: string) => ReactNode;
  /** The moment taken as "now", for the red line. Without it the clock is used and the line moves. */
  now?: Date;
  className?: string;
};

const HOURS = Array.from({ length: 24 }, (_, hour) => hour);

function useClock(fixed: Date | undefined): Date {
  const [clock, setClock] = useState(() => new Date());
  useEffect(() => {
    if (fixed) return;
    const id = setInterval(() => setClock(new Date()), 60_000);
    return () => clearInterval(id);
  }, [fixed]);
  return fixed ?? clock;
}

/** The days of a week or a day as columns over a column of hours: all-day row, timed events side by side, and the line of now. */
export function TimeGrid({
  days,
  events,
  calendars,
  hourHeight = 48,
  scrollToHour = 7,
  onEventClick,
  onDayClick,
  onCreate,
  renderEvent,
  now: nowProp,
  className,
}: TimeGridProps) {
  const { t, language } = useLostTranslation();
  const locale = calendarLocale(language);
  const now = useClock(nowProp);
  const scroller = useRef<HTMLDivElement>(null);
  const normalized = useMemo(() => events.map(normalizeEvent).sort(byStart), [events]);
  const allDay = days.map((day) => eventsOnDay(normalized, day).filter((event) => event.allDay));
  const hasAllDay = allDay.some((list) => list.length > 0);
  const columns = `3.5rem repeat(${days.length}, minmax(0, 1fr))`;

  useEffect(() => {
    if (scroller.current) scroller.current.scrollTop = scrollToHour * hourHeight;
  }, [scrollToHour, hourHeight]);

  const create = (day: Date, mouse: MouseEvent<HTMLDivElement>) => {
    if (!onCreate) return;
    const offset = mouse.clientY - mouse.currentTarget.getBoundingClientRect().top;
    const minutes = Math.min(snapMinutes((offset / hourHeight) * 60), 23 * 60);
    onCreate({ start: atMinutes(day, minutes), end: atMinutes(day, minutes + 60), allDay: false });
  };

  const draw = (event: CalendarEvent, variant: "chip" | "block") => {
    const color = eventColor(event, calendars);
    return renderEvent ? (
      renderEvent(event, color)
    ) : (
      <CalendarEventChip
        event={event}
        color={color}
        variant={variant}
        showTime={false}
        onClick={onEventClick}
      />
    );
  };

  return (
    <div
      data-slot="time-grid"
      className={cn("flex min-h-0 flex-1 flex-col", className)}
    >
      <div role="row" className="grid border-b pr-[var(--scrollbar,0px)]" style={{ gridTemplateColumns: columns }}>
        <div />
        {days.map((day) => {
          const today = isSameDay(day, now);
          return (
            <div key={day.getTime()} role="columnheader" className="flex flex-col items-center gap-0.5 py-1.5">
              <span className="text-xs font-medium text-muted-foreground uppercase">
                {formatWeekday(day, locale)}
              </span>
              <button
                type="button"
                aria-label={t("calendar.goToDay", { date: formatShortDate(day, locale) })}
                data-today={today ? "" : undefined}
                onClick={() => onDayClick?.(day)}
                className={cn(
                  "flex size-8 items-center justify-center rounded-full text-sm outline-none hover:bg-accent focus-visible:ring-[3px] focus-visible:ring-ring/50",
                  today && "bg-primary font-semibold text-primary-foreground hover:bg-primary/90",
                )}
              >
                {day.getDate()}
              </button>
            </div>
          );
        })}
      </div>

      {hasAllDay && (
        <div
          data-slot="time-grid-all-day"
          className="grid border-b"
          style={{ gridTemplateColumns: columns }}
        >
          <div className="px-1 py-1 text-right text-[10px] text-muted-foreground">
            {t("calendar.allDay")}
          </div>
          {allDay.map((list, index) => (
            <div key={days[index]!.getTime()} className="flex min-w-0 flex-col gap-0.5 border-l p-0.5">
              {list.map((event) => (
                <div key={event.id}>{draw(event, "chip")}</div>
              ))}
            </div>
          ))}
        </div>
      )}

      <div ref={scroller} data-slot="time-grid-scroll" className="min-h-0 flex-1 overflow-y-auto">
        <div
          className="relative grid"
          style={{ gridTemplateColumns: columns, height: hourHeight * 24 }}
        >
          <div className="relative">
            {HOURS.slice(1).map((hour) => (
              <span
                key={hour}
                className="absolute right-1.5 -translate-y-1/2 text-[10px] text-muted-foreground"
                style={{ top: hour * hourHeight }}
              >
                {formatHour(hour, locale)}
              </span>
            ))}
          </div>
          {days.map((day) => {
            const positioned = layoutTimedEvents(normalized, day);
            const today = isSameDay(day, now);
            return (
              <div
                key={day.getTime()}
                role="gridcell"
                aria-label={t("calendar.createAt", { date: formatShortDate(day, locale) })}
                data-slot="time-grid-day"
                onClick={(mouse) => create(day, mouse)}
                className={cn("relative border-l", onCreate && "cursor-pointer")}
                style={{
                  backgroundImage:
                    "repeating-linear-gradient(to bottom, transparent 0, transparent calc(var(--hour) - 1px), var(--border) calc(var(--hour) - 1px), var(--border) var(--hour))",
                  ["--hour" as string]: `${hourHeight}px`,
                }}
              >
                {positioned.map(({ event, top, height, left, width }) => (
                  <div
                    key={event.id}
                    data-slot="time-grid-event"
                    className="absolute p-px"
                    style={{
                      top: (top / 60) * hourHeight,
                      height: (height / 60) * hourHeight,
                      left: `${left * 100}%`,
                      width: `${width * 100}%`,
                    }}
                  >
                    {draw(event, "block")}
                  </div>
                ))}
                {today && (
                  <div
                    data-slot="time-grid-now"
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-x-0 z-10 flex items-center"
                    style={{ top: (minutesOfDay(now) / 60) * hourHeight }}
                  >
                    <span className="-ml-1 size-2 rounded-full bg-destructive" />
                    <span className="h-px flex-1 bg-destructive" />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
