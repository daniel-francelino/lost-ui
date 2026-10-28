import { PlusIcon } from "lucide-react";

import { cn } from "../../../lib/cn";
import { useLostTranslation } from "../../../i18n/use-lost-translation";
import { Button } from "../../ui/button";
import type { CalendarSource } from "../calendar-model/types";

export type CalendarListProps = {
  calendars: CalendarSource[];
  /** A calendar was shown or hidden. */
  onToggle?: (id: string) => void;
  /** Adds a "new" button to the heading. */
  onCreate?: () => void;
  /** Hides the heading, e.g. when a drawer already has one. */
  showTitle?: boolean;
  className?: string;
};

/** The calendars of the user, each with its colour and a checkbox to show or hide its events. */
export function CalendarList({
  calendars,
  onToggle,
  onCreate,
  showTitle = true,
  className,
}: CalendarListProps) {
  const { t } = useLostTranslation();

  return (
    <div data-slot="calendar-list" className={cn("grid gap-2", className)}>
      {(showTitle || onCreate) && (
        <div className="flex items-center justify-between">
          {showTitle && <h3 className="text-sm font-semibold">{t("calendar.calendars")}</h3>}
          {onCreate && (
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="ml-auto size-7"
              aria-label={t("calendar.newEvent")}
              onClick={onCreate}
            >
              <PlusIcon aria-hidden="true" />
            </Button>
          )}
        </div>
      )}
      {calendars.length === 0 ? (
        <p className="text-sm text-muted-foreground">{t("calendar.noCalendars")}</p>
      ) : (
        <ul className="grid gap-0.5">
          {calendars.map((calendar) => {
            const visible = calendar.visible !== false;
            return (
              <li key={calendar.id}>
                <label className="flex cursor-pointer items-center gap-2 rounded-md px-1.5 py-1 text-sm hover:bg-accent has-[:focus-visible]:ring-[3px] has-[:focus-visible]:ring-ring/50">
                  <input
                    type="checkbox"
                    checked={visible}
                    aria-label={t("calendar.showCalendar", { name: calendar.name })}
                    onChange={() => onToggle?.(calendar.id)}
                    className="peer sr-only"
                  />
                  <span
                    aria-hidden="true"
                    className={cn(
                      "size-3.5 shrink-0 rounded border-2 transition-colors",
                      visible ? "border-transparent" : "bg-transparent",
                    )}
                    style={{
                      borderColor: visible ? undefined : (calendar.color ?? "var(--primary)"),
                      background: visible ? (calendar.color ?? "var(--primary)") : undefined,
                    }}
                  />
                  <span className={cn("min-w-0 truncate", !visible && "text-muted-foreground")}>
                    {calendar.name}
                  </span>
                </label>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
