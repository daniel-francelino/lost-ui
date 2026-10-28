import type { ComponentProps } from "react";

import { cn } from "../../../lib/cn";

const sizes = {
  xs: "[&>*]:h-7 [&>*]:text-xs",
  sm: "[&>*]:h-8 [&>*]:text-sm",
  md: "[&>*]:h-9 [&>*]:text-sm",
  lg: "[&>*]:h-10 [&>*]:text-base",
  xl: "[&>*]:h-12 [&>*]:text-base",
} as const;

const horizontal =
  "[&>*:not(:first-child)]:rounded-l-none [&>*:not(:last-child)]:rounded-r-none [&>*:not(:first-child)]:-ml-px";
const vertical =
  "flex-col [&>*:not(:first-child)]:rounded-t-none [&>*:not(:last-child)]:rounded-b-none [&>*:not(:first-child)]:-mt-px";

export type ButtonGroupProps = ComponentProps<"div"> & {
  /** Height and text size of every control in the group. Leave it out to keep their own. */
  size?: keyof typeof sizes;
  orientation?: "horizontal" | "vertical";
};

/**
 * Joins buttons, inputs, selects and badges into one control: the inner corners are squared and the
 * borders overlap. The counterpart of `FieldGroup` in Nuxt UI.
 */
export function ButtonGroup({
  size,
  orientation = "horizontal",
  className,
  role = "group",
  ...props
}: ButtonGroupProps) {
  return (
    <div
      role={role}
      data-slot="button-group"
      data-orientation={orientation}
      className={cn(
        "inline-flex items-stretch",
        orientation === "vertical" ? vertical : horizontal,
        // the control being used is raised, so its whole outline shows over its neighbours
        "[&>*:focus-visible]:relative [&>*:focus-visible]:z-10",
        size && sizes[size],
        className,
      )}
      {...props}
    />
  );
}
