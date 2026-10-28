import { forwardRef, useImperativeHandle, type ReactNode } from "react";
import { CheckIcon } from "lucide-react";

import { cn } from "../../../lib/cn";
import { solidColor, fillColor, type ThemeColor } from "../../../lib/theme-colors";
import { useControlled } from "../../../lib/use-controlled";

export type StepperItem = {
  /** Identifies the step for `value`. Defaults to its position. */
  value?: string | number;
  title?: ReactNode;
  description?: ReactNode;
  /** Drawn in the indicator instead of the number. */
  icon?: ReactNode;
  /** Shown below the steps while this step is the active one. */
  content?: ReactNode;
  disabled?: boolean;
  className?: string;
};

export type StepperState = { index: number; active: boolean; completed: boolean };

export type StepperHandle = {
  next: () => void;
  prev: () => void;
  hasNext: () => boolean;
  hasPrev: () => boolean;
};

export type StepperProps = {
  items: StepperItem[];
  /** The active step. Defaults to the first. */
  value?: string | number;
  defaultValue?: string | number;
  onValueChange?: (value: string | number) => void;
  orientation?: "horizontal" | "vertical";
  size?: "xs" | "sm" | "md" | "lg" | "xl";
  color?: ThemeColor;
  /** The user can only go back, or on to the next step. Set to false to let them jump anywhere. */
  linear?: boolean;
  /** Blocks the steps. Move with the buttons of the app and the `ref`. */
  disabled?: boolean;
  onNext?: (item: StepperItem) => void;
  onPrev?: (item: StepperItem) => void;
  renderIndicator?: (item: StepperItem, state: StepperState) => ReactNode;
  renderTitle?: (item: StepperItem, state: StepperState) => ReactNode;
  renderDescription?: (item: StepperItem, state: StepperState) => ReactNode;
  /** Draws the panel of the active step, instead of its `content`. */
  renderContent?: (item: StepperItem, state: StepperState) => ReactNode;
  className?: string;
  "aria-label"?: string;
};

const sizes = {
  xs: { indicator: "size-5 text-[10px]", text: "text-xs", icon: "[&_svg]:size-3" },
  sm: { indicator: "size-6 text-xs", text: "text-xs", icon: "[&_svg]:size-3.5" },
  md: { indicator: "size-8 text-sm", text: "text-sm", icon: "[&_svg]:size-4" },
  lg: { indicator: "size-10 text-base", text: "text-base", icon: "[&_svg]:size-5" },
  xl: { indicator: "size-12 text-lg", text: "text-base", icon: "[&_svg]:size-6" },
} as const;

export const Stepper = forwardRef<StepperHandle, StepperProps>(function Stepper(
  {
    items,
    value,
    defaultValue,
    onValueChange,
    orientation = "horizontal",
    size = "md",
    color = "primary",
    linear = true,
    disabled = false,
    onNext,
    onPrev,
    renderIndicator,
    renderTitle,
    renderDescription,
    renderContent,
    className,
    "aria-label": ariaLabel,
  },
  ref,
) {
  const keyOf = (item: StepperItem, index: number) => item.value ?? index;
  const [current, setCurrent] = useControlled<string | number>({
    ...(value !== undefined ? { value } : {}),
    defaultValue: defaultValue ?? (items[0] ? keyOf(items[0], 0) : 0),
    ...(onValueChange ? { onValueChange } : {}),
  });
  const found = items.findIndex((item, index) => keyOf(item, index) === current);
  const activeIndex = found === -1 ? 0 : found;
  const vertical = orientation === "vertical";
  const { indicator, text, icon } = sizes[size];

  const go = (index: number) => {
    const item = items[index];
    if (item) setCurrent(keyOf(item, index));
  };
  const canGo = (index: number) => {
    const item = items[index];
    if (!item || item.disabled || disabled) return false;
    return !linear || index <= activeIndex + 1;
  };

  const next = () => {
    const item = items[activeIndex + 1];
    if (!item || item.disabled) return;
    go(activeIndex + 1);
    onNext?.(item);
  };
  const prev = () => {
    const item = items[activeIndex - 1];
    if (!item || item.disabled) return;
    go(activeIndex - 1);
    onPrev?.(item);
  };

  useImperativeHandle(ref, () => ({
    next,
    prev,
    hasNext: () => activeIndex < items.length - 1 && !items[activeIndex + 1]?.disabled,
    hasPrev: () => activeIndex > 0 && !items[activeIndex - 1]?.disabled,
  }));

  const active = items[activeIndex];
  const activeState: StepperState = { index: activeIndex, active: true, completed: false };

  return (
    <div data-slot="stepper" data-orientation={orientation} className={cn("grid gap-4", className)}>
      <ol aria-label={ariaLabel} className={cn("flex", vertical ? "flex-col" : "flex-row", text)}>
        {items.map((item, index) => {
          const state: StepperState = {
            index,
            active: index === activeIndex,
            completed: index < activeIndex,
          };
          const last = index === items.length - 1;
          const reached = state.active || state.completed;

          return (
            <li
              key={keyOf(item, index)}
              data-state={state.active ? "active" : state.completed ? "completed" : "upcoming"}
              className={cn(
                vertical ? "flex gap-3" : "flex min-w-0 flex-1 flex-col",
                item.className,
              )}
            >
              <button
                type="button"
                aria-current={state.active ? "step" : undefined}
                disabled={!canGo(index)}
                onClick={() => go(index)}
                className={cn(
                  "group rounded-md text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-default",
                  vertical ? "flex gap-3" : "flex flex-col",
                )}
              >
                <span className={cn("flex items-center", vertical ? "flex-col" : "w-full")}>
                  <span
                    data-slot="stepper-indicator"
                    className={cn(
                      "flex shrink-0 items-center justify-center rounded-full border-2 font-medium",
                      indicator,
                      icon,
                      reached
                        ? cn(solidColor[color], "border-transparent")
                        : "border-border bg-background text-muted-foreground",
                    )}
                  >
                    {renderIndicator ? (
                      renderIndicator(item, state)
                    ) : state.completed ? (
                      <CheckIcon aria-hidden="true" />
                    ) : (
                      (item.icon ?? index + 1)
                    )}
                  </span>
                  {!last && (
                    <span
                      data-slot="stepper-separator"
                      aria-hidden="true"
                      className={cn(
                        vertical ? "my-1 w-0.5 min-h-6 flex-1" : "mx-2 h-0.5 flex-1",
                        state.completed ? fillColor[color] : "bg-border",
                      )}
                    />
                  )}
                </span>
                <span className={cn("grid gap-0.5", vertical ? "pb-4 pt-1" : "mt-2 pr-4")}>
                  <span
                    className={cn(
                      "font-medium",
                      reached ? "text-foreground" : "text-muted-foreground",
                    )}
                  >
                    {renderTitle ? renderTitle(item, state) : item.title}
                  </span>
                  {(renderDescription ? renderDescription(item, state) : item.description) && (
                    <span className="text-muted-foreground">
                      {renderDescription ? renderDescription(item, state) : item.description}
                    </span>
                  )}
                </span>
              </button>
            </li>
          );
        })}
      </ol>
      {active && (renderContent ? renderContent(active, activeState) : active.content) && (
        <div data-slot="stepper-content" role="region" aria-live="polite">
          {renderContent ? renderContent(active, activeState) : active.content}
        </div>
      )}
    </div>
  );
});
