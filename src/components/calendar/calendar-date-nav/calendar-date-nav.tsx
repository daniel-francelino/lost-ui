import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import type { ReactNode } from "react";

import { cn } from "../../../lib/cn";
import type { LostKey } from "../../../i18n";
import { useLostTranslation } from "../../../i18n/use-lost-translation";
import { Button } from "../../ui/button";
import { addDays, addMonths } from "../calendar-model/dates";
import { useCalendarLocale } from "../calendar-model/locale";
import { formatDayTitle, formatMonthTitle, formatWeekTitle } from "../calendar-model/format";
import type { CalendarViewName, WeekStart } from "../calendar-model/types";

export type CalendarDateNavProps = {
  /** The day the calendar shows; the month, week or day that has it. */
  date: Date;
  view: CalendarViewName;
  onDateChange: (date: Date) => void;
  onViewChange?: (view: CalendarViewName) => void;
  weekStartsOn?: WeekStart;
  /** The views of the switcher, in order. */
  views?: CalendarViewName[];
  /** At the end of the bar: a "New event" button. */
  actions?: ReactNode;
  className?: string;
};

/** The bar over a calendar: previous, today, next, the title of the period and the switch between views. */
export function CalendarDateNav({
  date,
  view,
  onDateChange,
  onViewChange,
  weekStartsOn = 0,
  views = ["month", "week", "day"],
  actions,
  className,
}: CalendarDateNavProps) {
  const { t } = useLostTranslation();
  const locale = useCalendarLocale();

  const step = (direction: 1 | -1) =>
    onDateChange(
      view === "month"
        ? addMonths(date, direction)
        : addDays(date, direction * (view === "week" ? 7 : 1)),
    );

  const title =
    view === "month"
      ? formatMonthTitle(date, locale)
      : view === "week"
        ? formatWeekTitle(date, locale, weekStartsOn)
        : formatDayTitle(date, locale);

  return (
    <div
      data-slot="calendar-date-nav"
      className={cn("flex flex-wrap items-center gap-2", className)}
    >
      <div className="flex items-center gap-1">
        <Button
          type="button"
          variant="outline"
          size="icon"
          aria-label={t("calendar.previous")}
          onClick={() => step(-1)}
        >
          <ChevronLeftIcon aria-hidden="true" />
        </Button>
        <Button
          type="button"
          variant="outline"
          size="icon"
          aria-label={t("calendar.next")}
          onClick={() => step(1)}
        >
          <ChevronRightIcon aria-hidden="true" />
        </Button>
        <Button type="button" variant="outline" onClick={() => onDateChange(new Date())}>
          {t("calendar.today")}
        </Button>
      </div>
      <h2 aria-live="polite" className="min-w-0 flex-1 truncate text-lg font-semibold capitalize">
        {title}
      </h2>
      {onViewChange && views.length > 1 && (
        <div role="group" aria-label={t("calendar.views")} className="flex rounded-lg border p-0.5">
          {views.map((name) => (
            <Button
              key={name}
              type="button"
              size="sm"
              variant={name === view ? "secondary" : "ghost"}
              aria-pressed={name === view}
              onClick={() => onViewChange(name)}
            >
              {t(`calendar.${name}` as LostKey)}
            </Button>
          ))}
        </div>
      )}
      {actions}
    </div>
  );
}
