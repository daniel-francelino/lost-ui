import type { CSSProperties, MouseEvent, ReactNode } from "react";

import { cn } from "../../../lib/cn";
import { useLostTranslation } from "../../../i18n/use-lost-translation";
import { formatTime } from "../calendar-model/format";
import { useCalendarLocale } from "../calendar-model/locale";
import { normalizeEvent } from "../calendar-model/dates";
import type { CalendarEvent } from "../calendar-model/types";

export type CalendarEventChipProps<T = unknown> = {
  event: CalendarEvent<T>;
  /** The colour of the event. Defaults to the primary. */
  color?: string;
  /** `chip` is one line (month, all-day row); `block` fills a box and shows the time and place (time grid). */
  variant?: "chip" | "block";
  /** Writes the time before the title in a `chip`. */
  showTime?: boolean;
  onClick?: (event: CalendarEvent<T>, mouse: MouseEvent<HTMLButtonElement>) => void;
  style?: CSSProperties;
  className?: string;
  children?: ReactNode;
};

/** An event as a coloured button: a chip for the month and the all-day row, a block for the time grid. */
export function CalendarEventChip<T = unknown>({
  event,
  color = "var(--primary)",
  variant = "chip",
  showTime = false,
  onClick,
  style,
  className,
  children,
}: CalendarEventChipProps<T>) {
  const { t } = useLostTranslation();
  const locale = useCalendarLocale();
  const { start, end, allDay } = normalizeEvent(event);
  const title = event.title.trim() === "" ? t("calendar.untitled") : event.title;
  const time = allDay ? null : `${formatTime(start, locale)} – ${formatTime(end, locale)}`;

  return (
    <button
      type="button"
      data-slot="calendar-event"
      data-variant={variant}
      title={[title, time, event.location].filter(Boolean).join(" · ")}
      onClick={(mouse) => {
        mouse.stopPropagation();
        onClick?.(event, mouse);
      }}
      style={{ ...style, "--event-color": color } as CSSProperties}
      className={cn(
        "block w-full min-w-0 overflow-hidden rounded-md border-l-[3px] border-[var(--event-color)] bg-[color-mix(in_oklab,var(--event-color)_18%,var(--background))] px-1.5 text-left text-xs text-foreground outline-none transition-colors hover:bg-[color-mix(in_oklab,var(--event-color)_28%,var(--background))] focus-visible:ring-[3px] focus-visible:ring-ring/50",
        variant === "chip" ? "truncate py-0.5" : "h-full py-1",
        className,
      )}
    >
      {children ?? (
        <>
          {variant === "chip" ? (
            <span className="truncate">
              {showTime && time && (
                <span className="mr-1 text-muted-foreground">{formatTime(start, locale)}</span>
              )}
              {title}
            </span>
          ) : (
            <>
              <span className="block truncate font-medium">{title}</span>
              {time && <span className="block truncate text-muted-foreground">{time}</span>}
              {event.location && (
                <span className="block truncate text-muted-foreground">{event.location}</span>
              )}
            </>
          )}
        </>
      )}
    </button>
  );
}
