import type { CSSProperties, ReactNode } from "react";

import { cn } from "../../lib/cn";
import { fillColor, type ThemeColor } from "../../lib/theme-colors";

const heights = {
  "2xs": "h-0.5",
  xs: "h-1",
  sm: "h-1.5",
  md: "h-2",
  lg: "h-3",
  xl: "h-4",
  "2xl": "h-5",
} as const;

const widths = {
  "2xs": "w-0.5",
  xs: "w-1",
  sm: "w-1.5",
  md: "w-2",
  lg: "w-3",
  xl: "w-4",
  "2xl": "w-5",
} as const;

export type ProgressGroupItem = {
  label?: ReactNode;
  /** Shown before the label. Without it the item shows a dot in its colour. */
  icon?: ReactNode;
  value: number;
  /** A theme colour, or any CSS colour (`"#4f46e5"`, `"oklch(0.7 0.2 150)"`). */
  color?: ThemeColor | (string & {});
  className?: string;
};

export type ProgressGroupState = { item: ProgressGroupItem; index: number; percent: number };

export type ProgressGroupProps = {
  items: ProgressGroupItem[];
  /** The total the items add up to. */
  max?: number;
  /** Colour of the items that do not set one. */
  color?: ThemeColor | (string & {});
  size?: keyof typeof heights;
  orientation?: "horizontal" | "vertical";
  /** Shows the sum above the bar. `true` writes it as a percentage; a function draws it. */
  status?: boolean | ((total: number, percent: number) => ReactNode);
  /** Lists the items with a dot, a label and a value under the bar. */
  legend?: boolean;
  renderLabel?: (state: ProgressGroupState) => ReactNode;
  renderTrailing?: (state: ProgressGroupState) => ReactNode;
  /** Names the bar for screen readers. */
  label?: string;
  className?: string;
};

const isThemeColor = (color: string): color is ThemeColor => color in fillColor;

function paint(color: string | undefined): { className?: string; style?: CSSProperties } {
  const chosen = color ?? "primary";
  return isThemeColor(chosen)
    ? { className: fillColor[chosen] }
    : { style: { background: chosen } };
}

export function ProgressGroup({
  items,
  max = 100,
  color = "primary",
  size = "md",
  orientation = "horizontal",
  status = false,
  legend = true,
  renderLabel,
  renderTrailing,
  label,
  className,
}: ProgressGroupProps) {
  const vertical = orientation === "vertical";
  const clamped = items.map((item) => Math.min(Math.max(item.value, 0), max));
  const sum = clamped.reduce((total, value) => total + value, 0);
  // over the total, the items share the track in proportion
  const scale = sum > max ? sum : max;
  const percentOf = (value: number) => (scale === 0 ? 0 : (value / scale) * 100);
  const total = Math.min(sum, max);
  const totalPercent = max === 0 ? 0 : (total / max) * 100;

  return (
    <div
      data-slot="progress-group"
      data-orientation={orientation}
      className={cn("grid gap-2", vertical && "h-full grid-flow-col auto-cols-max", className)}
    >
      {status && (
        <div data-slot="progress-group-status" className="text-sm text-muted-foreground">
          {typeof status === "function"
            ? status(total, totalPercent)
            : `${Math.round(totalPercent)}%`}
        </div>
      )}
      <div
        role="progressbar"
        aria-label={label}
        aria-valuemin={0}
        aria-valuemax={max}
        aria-valuenow={total}
        className={cn(
          "flex overflow-hidden rounded-full bg-muted",
          vertical
            ? cn("flex-col-reverse self-stretch", widths[size])
            : cn("w-full", heights[size]),
        )}
      >
        {items.map((item, index) => {
          const percent = percentOf(clamped[index] ?? 0);
          const look = paint(item.color ?? color);

          return (
            <span
              key={index}
              data-slot="progress-group-segment"
              className={cn("transition-all", look.className, item.className)}
              style={{
                ...look.style,
                ...(vertical ? { height: `${percent}%` } : { width: `${percent}%` }),
              }}
            />
          );
        })}
      </div>
      {legend && (
        <ul data-slot="progress-group-legend" className="grid gap-1 text-sm">
          {items.map((item, index) => {
            const state = { item, index, percent: percentOf(clamped[index] ?? 0) };
            const look = paint(item.color ?? color);

            return (
              <li key={index} className="flex items-center gap-2">
                {item.icon ?? (
                  <span
                    aria-hidden="true"
                    className={cn("size-2 shrink-0 rounded-full", look.className)}
                    style={look.style}
                  />
                )}
                <span className="flex-1 truncate">
                  {renderLabel ? renderLabel(state) : item.label}
                </span>
                <span className="tabular-nums text-muted-foreground">
                  {renderTrailing ? renderTrailing(state) : item.value}
                </span>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
