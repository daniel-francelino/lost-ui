import type { MouseEvent, ReactNode } from "react";

import { cn } from "../../lib/cn";
import { useControlled } from "../../lib/use-controlled";

export type TimelineItem = {
  /** Identifies the item for `value`. Defaults to its position. */
  value?: string | number;
  date?: ReactNode;
  title?: ReactNode;
  description?: ReactNode;
  /** Drawn in the indicator. Without an icon or avatar the indicator is a dot. */
  icon?: ReactNode;
  /** Drawn in the indicator instead of the icon, e.g. an `Avatar`. */
  avatar?: ReactNode;
  className?: string;
};

export type TimelineColor =
  "primary" | "secondary" | "success" | "info" | "warning" | "destructive" | "neutral";

export type TimelineSize = "xs" | "sm" | "md" | "lg" | "xl";

export type TimelineItemState = { index: number; active: boolean; current: boolean };

export type TimelineProps = {
  items: TimelineItem[];
  orientation?: "vertical" | "horizontal";
  size?: TimelineSize;
  /** Colour of the active items and of the line between them. */
  color?: TimelineColor;
  /** Lists the items from the last to the first. */
  reverse?: boolean;
  /** The active item. The items up to it are marked as done. */
  value?: string | number;
  defaultValue?: string | number;
  onValueChange?: (value: string | number) => void;
  /** Makes the items clickable. */
  onSelect?: (item: TimelineItem, event: MouseEvent<HTMLElement>) => void;
  renderIndicator?: (item: TimelineItem, state: TimelineItemState) => ReactNode;
  renderDate?: (item: TimelineItem, state: TimelineItemState) => ReactNode;
  renderTitle?: (item: TimelineItem, state: TimelineItemState) => ReactNode;
  renderDescription?: (item: TimelineItem, state: TimelineItemState) => ReactNode;
  className?: string;
  "aria-label"?: string;
};

const activeColor: Record<TimelineColor, string> = {
  primary: "border-primary bg-primary text-primary-foreground",
  secondary: "border-secondary bg-secondary text-secondary-foreground",
  success: "border-success bg-success text-success-foreground",
  info: "border-info bg-info text-info-foreground",
  warning: "border-warning bg-warning text-warning-foreground",
  destructive: "border-destructive bg-destructive text-destructive-foreground",
  neutral: "border-foreground bg-foreground text-background",
};

const lineColor: Record<TimelineColor, string> = {
  primary: "bg-primary",
  secondary: "bg-secondary",
  success: "bg-success",
  info: "bg-info",
  warning: "bg-warning",
  destructive: "bg-destructive",
  neutral: "bg-foreground",
};

const sizes: Record<TimelineSize, { indicator: string; text: string; dot: string }> = {
  xs: { indicator: "size-5 [&_svg]:size-3", text: "text-xs", dot: "size-1.5" },
  sm: { indicator: "size-6 [&_svg]:size-3.5", text: "text-xs", dot: "size-2" },
  md: { indicator: "size-8 [&_svg]:size-4", text: "text-sm", dot: "size-2.5" },
  lg: { indicator: "size-10 [&_svg]:size-5", text: "text-base", dot: "size-3" },
  xl: { indicator: "size-12 [&_svg]:size-6", text: "text-base", dot: "size-3.5" },
};

export function Timeline({
  items,
  orientation = "vertical",
  size = "md",
  color = "primary",
  reverse = false,
  value,
  defaultValue,
  onValueChange,
  onSelect,
  renderIndicator,
  renderDate,
  renderTitle,
  renderDescription,
  className,
  "aria-label": ariaLabel,
}: TimelineProps) {
  const [current, setCurrent] = useControlled<string | number>({
    ...(value !== undefined ? { value } : {}),
    ...(defaultValue !== undefined ? { defaultValue } : {}),
    ...(onValueChange ? { onValueChange } : {}),
  });
  const vertical = orientation === "vertical";
  const clickable = onSelect !== undefined || onValueChange !== undefined;
  const keyOf = (item: TimelineItem, index: number) => item.value ?? index;
  const activeIndex =
    current === undefined ? -1 : items.findIndex((item, index) => keyOf(item, index) === current);
  const { indicator, text, dot } = sizes[size];

  return (
    <ol
      data-slot="timeline"
      data-orientation={orientation}
      aria-label={ariaLabel}
      className={cn(
        "flex",
        vertical ? "flex-col" : "flex-row",
        reverse && (vertical ? "flex-col-reverse" : "flex-row-reverse"),
        text,
        className,
      )}
    >
      {items.map((item, index) => {
        const state: TimelineItemState = {
          index,
          active: index <= activeIndex,
          current: index === activeIndex,
        };
        const last = index === items.length - 1;
        const lineActive = index < activeIndex;

        const date = renderDate ? renderDate(item, state) : item.date;
        const title = renderTitle ? renderTitle(item, state) : item.title;
        const description = renderDescription ? renderDescription(item, state) : item.description;

        const body = (
          <>
            <div
              className={cn(
                "flex items-center",
                vertical ? "flex-col" : "w-full flex-row",
                reverse && !vertical && "flex-row-reverse",
              )}
            >
              <span
                data-slot="timeline-indicator"
                className={cn(
                  "flex shrink-0 items-center justify-center overflow-hidden rounded-full border-2",
                  indicator,
                  state.active
                    ? activeColor[color]
                    : "border-border bg-background text-muted-foreground",
                )}
              >
                {renderIndicator
                  ? renderIndicator(item, state)
                  : (item.avatar ??
                    item.icon ?? (
                      <span aria-hidden="true" className={cn("rounded-full bg-current", dot)} />
                    ))}
              </span>
              {!last && (
                <span
                  data-slot="timeline-separator"
                  aria-hidden="true"
                  className={cn(
                    "flex-1",
                    vertical ? "my-1 w-0.5 min-h-4" : "mx-2 h-0.5 min-w-4",
                    lineActive ? lineColor[color] : "bg-border",
                  )}
                />
              )}
            </div>
            <div
              data-slot="timeline-content"
              className={cn("grid gap-0.5", vertical ? "pb-6 pt-1" : "mt-2 pr-4", last && "pb-0")}
            >
              {date && <div className="text-xs text-muted-foreground">{date}</div>}
              {title && <div className="font-medium text-foreground">{title}</div>}
              {description && <div className="text-muted-foreground">{description}</div>}
            </div>
          </>
        );

        const itemClass = cn(
          "group relative",
          vertical ? "flex gap-3" : "flex min-w-0 flex-1 flex-col",
          item.className,
        );

        return (
          <li
            key={keyOf(item, index)}
            data-active={state.active ? "" : undefined}
            aria-current={state.current ? "step" : undefined}
            className={itemClass}
          >
            {clickable ? (
              <button
                type="button"
                className={cn(
                  "w-full rounded-md text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                  vertical ? "flex gap-3" : "flex flex-col",
                )}
                onClick={(event) => {
                  setCurrent(keyOf(item, index));
                  onSelect?.(item, event);
                }}
              >
                {body}
              </button>
            ) : (
              body
            )}
          </li>
        );
      })}
    </ol>
  );
}
